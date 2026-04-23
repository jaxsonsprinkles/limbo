import { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain } from 'electron'
import path from 'path'
import { limboStore } from './services/limbo-store'
import { expiryManager } from './services/expiry-manager'
import { watcherService } from './services/watcher'
import { registerFileHandlers } from './ipc/file-handlers'
import { registerSettingsHandlers } from './ipc/settings-handlers'

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
let tray: Tray | null = null

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function getWindowPosition() {
  if (!tray || !win) return { x: 0, y: 0 }
  const trayBounds = tray.getBounds()
  const windowBounds = win.getBounds()
  const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2)
  const y = Math.round(trayBounds.y - windowBounds.height - 4)
  return { x, y }
}

function createWindow() {
  win = new BrowserWindow({
    width: 420,
    height: 580,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    alwaysOnTop: false,
    transparent: false,
    backgroundColor: '#F5F3EF',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  win.on('blur', () => {
    if (win && !win.webContents.isDevToolsOpened()) {
      win.hide()
    }
  })

  win.on('closed', () => { win = null })

  return win
}

function createTray() {
  const iconPath = isDev
    ? path.join(process.cwd(), 'resources/icons/tray-default.png')
    : path.join(process.resourcesPath, 'icons/tray-default.png')

  const icon = nativeImage.createFromPath(iconPath)
  tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon)
  tray.setToolTip('Limbo — 0 files waiting')

  tray.on('click', () => {
    if (!win) return
    if (win.isVisible()) {
      win.hide()
    } else {
      const pos = getWindowPosition()
      win.setPosition(pos.x, pos.y, false)
      win.show()
      win.focus()
    }
  })

  tray.on('right-click', () => {
    const menu = Menu.buildFromTemplate([
      { label: 'Open Limbo', click: () => { win?.show(); win?.focus() } },
      { type: 'separator' },
      { label: 'Quit Limbo', click: () => app.quit() },
    ])
    tray?.popUpContextMenu(menu)
  })
}

function updateTrayBadge() {
  const count = limboStore.getAll().length
  tray?.setToolTip(`Limbo — ${count} file${count !== 1 ? 's' : ''} waiting`)
}

app.whenReady().then(() => {
  limboStore.init()
  createWindow()
  createTray()

  registerFileHandlers(() => win)
  registerSettingsHandlers()

  ipcMain.on('window:minimize', () => win?.minimize())
  ipcMain.on('window:close', () => win?.hide())

  if (win) {
    expiryManager.start(win)
    watcherService.start(win)
  }

  win?.webContents.on('did-finish-load', updateTrayBadge)
})

app.on('window-all-closed', () => {
  // Intentional no-op: keep app alive in tray
})

app.on('second-instance', () => {
  win?.show()
  win?.focus()
})
