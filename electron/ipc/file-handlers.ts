import { ipcMain, shell, dialog, BrowserWindow, nativeImage, app } from 'electron'
import fs from 'fs'
import path from 'path'
import { limboStore } from '../services/limbo-store'
import { copyFileToClipboard } from '../services/clipboard-service'

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function getDragIconPath(): string {
  return isDev
    ? path.join(process.cwd(), 'resources/icons/drag-icon.png')
    : path.join(process.resourcesPath, 'icons/drag-icon.png')
}

export function registerFileHandlers(getWindow: () => BrowserWindow | null) {
  ipcMain.handle('files:getAll', () => limboStore.getAll())

  ipcMain.handle('files:delete', async (_, id: string) => {
    const file = limboStore.delete(id)
    if (file) {
      try { await fs.promises.unlink(file.limboPath) } catch {}
    }
    getWindow()?.webContents.send('file:deleted', id)
    return { ok: true }
  })

  ipcMain.handle('files:savePermanently', async (_, id: string) => {
    const file = limboStore.get(id)
    if (!file) return { ok: false }
    const { filePath } = await dialog.showSaveDialog({
      defaultPath: path.join(require('os').homedir(), 'Documents', file.filename),
      title: 'Save File Permanently',
    })
    if (!filePath) return { ok: false, cancelled: true }
    await fs.promises.copyFile(file.limboPath, filePath)
    limboStore.delete(id)
    try { await fs.promises.unlink(file.limboPath) } catch {}
    getWindow()?.webContents.send('file:deleted', id)
    return { ok: true }
  })

  ipcMain.handle('files:copyToClipboard', async (_, id: string) => {
    const file = limboStore.get(id)
    if (!file) return { ok: false }
    await copyFileToClipboard(file.limboPath)
    return { ok: true }
  })

  ipcMain.handle('files:openInExplorer', async (_, id: string) => {
    const file = limboStore.get(id)
    if (!file) return { ok: false }
    shell.showItemInFolder(file.limboPath)
    return { ok: true }
  })

  ipcMain.handle('files:pinToggle', (_, id: string) => {
    const file = limboStore.get(id)
    if (!file) return { ok: false }
    limboStore.update(id, { isPinned: !file.isPinned })
    return { ok: true, isPinned: !file.isPinned }
  })

  ipcMain.on('files:startDrag', (event, id: string) => {
    const file = limboStore.get(id)
    if (!file || !fs.existsSync(file.limboPath)) return
    const iconPath = getDragIconPath()
    const icon = fs.existsSync(iconPath)
      ? nativeImage.createFromPath(iconPath)
      : nativeImage.createEmpty()
    event.sender.startDrag({ file: file.limboPath, icon })
  })

  ipcMain.handle('files:updateExpiry', (_, id: string, expiresAt: number) => {
    const file = limboStore.get(id)
    if (!file) return { ok: false }
    limboStore.update(id, { expiresAt })
    return { ok: true }
  })
}
