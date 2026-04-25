import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  nativeImage,
  ipcMain,
  screen,
  protocol,
} from "electron";
import path from "path";
import fs from "fs";
import { limboStore } from "./services/limbo-store";
import { settingsService } from "./services/settings-service";
import { expiryManager } from "./services/expiry-manager";
import { watcherService } from "./services/watcher";
import { registerFileHandlers } from "./ipc/file-handlers";
import { registerSettingsHandlers } from "./ipc/settings-handlers";

app.setName('Limbo')

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

if (process.platform === "darwin") {
  app.dock.hide();
}

let win: BrowserWindow | null = null;
let tray: Tray | null = null;

const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

function getWindowPosition() {
  if (!tray || !win) return { x: 0, y: 0 };
  const trayBounds = tray.getBounds();
  const windowBounds = win.getBounds();
  const { workArea } = screen.getPrimaryDisplay();
  const rawX = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2,
  );
  const rawY =
    process.platform === "darwin"
      ? Math.round(trayBounds.y + trayBounds.height + 4)
      : Math.round(trayBounds.y - windowBounds.height - 4);
  const x = Math.max(
    workArea.x,
    Math.min(rawX, workArea.x + workArea.width - windowBounds.width),
  );
  const y = Math.max(
    workArea.y,
    Math.min(rawY, workArea.y + workArea.height - windowBounds.height),
  );
  return { x, y };
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
    backgroundColor: "#F5F3EF",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }


  win.on("blur", () => {
    if (win && !win.webContents.isDevToolsOpened()) {
      win.hide();
    }
  });

  win.on("closed", () => {
    win = null;
  });

  return win;
}

function createTray() {
  const iconPath = isDev
    ? path.join(process.cwd(), "resources/icons/tray-default.png")
    : path.join(process.resourcesPath, "icons/tray-default.png");

  if (!fs.existsSync(iconPath)) {
    console.warn("[tray] icon not found at", iconPath);
  }
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon);
  tray.setToolTip("Limbo - 0 files waiting");
  if (process.platform === "darwin") {
    tray.setIgnoreDoubleClickEvents(true);
  }

  tray.on("click", () => {
    if (!win) return;
    if (win.isVisible()) {
      win.hide();
    } else {
      const pos = getWindowPosition();
      win.setPosition(pos.x, pos.y, false);
      win.show();
      win.focus();
    }
  });

  tray.on("right-click", () => {
    const menu = Menu.buildFromTemplate([
      {
        label: "Open Limbo",
        click: () => {
          win?.show();
          win?.focus();
        },
      },
      { type: "separator" },
      { label: "Quit Limbo", click: () => app.quit() },
    ]);
    tray?.popUpContextMenu(menu);
  });
}

function updateTrayBadge() {
  const count = limboStore.getAll().length;
  tray?.setToolTip(`Limbo - ${count} file${count !== 1 ? "s" : ""} waiting`);
}

app.whenReady().then(async () => {
  // Serve limbo files via limbo:// protocol for image thumbnails
  protocol.registerFileProtocol("limbo", (request, callback) => {
    const filePath = decodeURIComponent(request.url.replace("limbo://", ""));
    callback({ path: filePath });
  });

  limboStore.init();
  createWindow();
  createTray();

  registerFileHandlers(() => win);
  registerSettingsHandlers();

  ipcMain.on("window:minimize", () => win?.minimize());
  ipcMain.on("window:close", () => win?.hide());

  // Apply persisted autoLaunch setting on startup
  const settings = settingsService.get();
  if (app.isPackaged) {
    try {
      app.setLoginItemSettings({ openAtLogin: settings.autoLaunch });
    } catch {
      // macOS rejects login item registration for unsigned builds
    }
  }

  if (win) {
    expiryManager.start(win);
    watcherService.start(win);
  }

  win?.webContents.on("did-finish-load", updateTrayBadge);
});

app.on("window-all-closed", () => {
  // Intentional no-op: keep app alive in tray
});

app.on("second-instance", () => {
  win?.show();
  win?.focus();
});
