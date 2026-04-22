"use strict";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");
const crypto = require("crypto");
const mime = require("mime-types");
const Store = require("electron-store");
const os = require("os");
const child_process = require("child_process");
const util = require("util");
function getLimboDir() {
  const dir = path.join(electron.app.getPath("userData"), "limbo-files");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}
function getRegistryPath() {
  return path.join(electron.app.getPath("userData"), "limbo-registry.json");
}
async function moveFile(src, dest) {
  try {
    await fs.promises.rename(src, dest);
  } catch (err) {
    if (err.code === "EXDEV") {
      await fs.promises.copyFile(src, dest);
      await fs.promises.unlink(src);
    } else {
      throw err;
    }
  }
}
const files = /* @__PURE__ */ new Map();
function load() {
  const registryPath = getRegistryPath();
  if (!fs.existsSync(registryPath)) return;
  try {
    const raw = fs.readFileSync(registryPath, "utf-8");
    const entries = JSON.parse(raw);
    const now = Date.now();
    for (const entry of entries) {
      if (!fs.existsSync(entry.limboPath)) continue;
      if (!entry.isPinned && entry.expiresAt <= now) {
        try {
          fs.unlinkSync(entry.limboPath);
        } catch {
        }
        continue;
      }
      files.set(entry.id, entry);
    }
  } catch {
  }
}
function persist() {
  try {
    fs.writeFileSync(getRegistryPath(), JSON.stringify([...files.values()], null, 2));
  } catch {
  }
}
const limboStore = {
  init() {
    load();
  },
  add(file) {
    files.set(file.id, file);
    persist();
  },
  get(id) {
    return files.get(id);
  },
  getAll() {
    return [...files.values()].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return b.addedAt - a.addedAt;
    });
  },
  delete(id) {
    const file = files.get(id);
    if (!file) return void 0;
    files.delete(id);
    persist();
    return file;
  },
  update(id, partial) {
    const file = files.get(id);
    if (!file) return void 0;
    const updated = { ...file, ...partial };
    files.set(id, updated);
    persist();
    return updated;
  },
  getLimboDir
};
let interval = null;
let win$2 = null;
function tick() {
  const now = Date.now();
  const files2 = limboStore.getAll();
  for (const file of files2) {
    if (file.isPinned) continue;
    const remaining = Math.ceil((file.expiresAt - now) / 1e3);
    if (remaining <= 0) {
      limboStore.delete(file.id);
      try {
        fs.unlinkSync(file.limboPath);
      } catch {
      }
      win$2 == null ? void 0 : win$2.webContents.send("file:expired", file.id);
      win$2 == null ? void 0 : win$2.webContents.send("file:deleted", file.id);
    } else {
      win$2 == null ? void 0 : win$2.webContents.send("file:countdown", { id: file.id, secondsRemaining: remaining });
    }
  }
}
const expiryManager = {
  start(window) {
    win$2 = window;
    interval = setInterval(tick, 1e3);
  },
  stop() {
    if (interval) clearInterval(interval);
    interval = null;
  },
  setWindow(window) {
    win$2 = window;
  }
};
const defaults = {
  watchedFolders: [path.join(os.homedir(), "Downloads")],
  defaultExpirySecs: 600,
  fileTypeFilter: { mode: "all", extensions: [] },
  soundEnabled: false,
  autoLaunch: false,
  showNotifications: true
};
const store = new Store({ defaults });
const settingsService = {
  get() {
    return store.store;
  },
  set(partial) {
    Object.entries(partial).forEach(([k, v]) => store.set(k, v));
    return store.store;
  }
};
const notificationService = {
  notify(title, body) {
    if (!electron.Notification.isSupported()) return;
    new electron.Notification({ title, body, silent: true }).show();
  }
};
let watchers = [];
let win$1 = null;
function shouldIntercept(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if ([".crdownload", ".part", ".download", ".tmp"].includes(ext)) return false;
  const settings = settingsService.get();
  const { mode, extensions } = settings.fileTypeFilter;
  if (mode === "all") return true;
  const clean = ext.replace(".", "");
  if (mode === "include") return extensions.includes(clean);
  if (mode === "exclude") return !extensions.includes(clean);
  return true;
}
async function onFileAdded(filePath) {
  if (!shouldIntercept(filePath)) return;
  try {
    const stat = await fs.promises.stat(filePath);
    const id = crypto.randomUUID();
    const ext = path.extname(filePath);
    const limboPath = path.join(getLimboDir(), `${id}${ext}`);
    await moveFile(filePath, limboPath);
    const settings = settingsService.get();
    const file = {
      id,
      originalPath: filePath,
      limboPath,
      filename: path.basename(filePath),
      size: stat.size,
      mimeType: mime.lookup(filePath) || "application/octet-stream",
      addedAt: Date.now(),
      expiresAt: Date.now() + settings.defaultExpirySecs * 1e3,
      isPinned: false
    };
    limboStore.add(file);
    win$1 == null ? void 0 : win$1.webContents.send("file:added", file);
    notificationService.notify(`"${file.filename}" is in Limbo`, `Expires in ${Math.round(settings.defaultExpirySecs / 60)} min`);
  } catch {
  }
}
const watcherService = {
  start(window) {
    win$1 = window;
    this.restart();
  },
  restart() {
    watchers.forEach((w) => w.close());
    watchers = [];
    const { watchedFolders } = settingsService.get();
    for (const folder of watchedFolders) {
      if (!fs.existsSync(folder)) continue;
      const w = chokidar.watch(folder, {
        ignoreInitial: true,
        awaitWriteFinish: { stabilityThreshold: 1500, pollInterval: 200 },
        ignored: /(^|[\/\\])\../,
        persistent: true,
        depth: 0
      });
      w.on("add", onFileAdded);
      watchers.push(w);
    }
  },
  stop() {
    watchers.forEach((w) => w.close());
    watchers = [];
  },
  setWindow(window) {
    win$1 = window;
  }
};
const execAsync = util.promisify(child_process.exec);
async function copyFileToClipboard(filePath) {
  const escaped = filePath.replace(/'/g, "''");
  const script = [
    "Add-Type -AssemblyName System.Windows.Forms;",
    "$files = New-Object System.Collections.Specialized.StringCollection;",
    `$files.Add('${escaped}');`,
    "[System.Windows.Forms.Clipboard]::SetFileDropList($files);"
  ].join(" ");
  await execAsync(`powershell -NonInteractive -Command "${script}"`);
}
function registerFileHandlers(getWindow) {
  electron.ipcMain.handle("files:getAll", () => limboStore.getAll());
  electron.ipcMain.handle("files:delete", async (_, id) => {
    var _a;
    const file = limboStore.delete(id);
    if (file) {
      try {
        await fs.promises.unlink(file.limboPath);
      } catch {
      }
    }
    (_a = getWindow()) == null ? void 0 : _a.webContents.send("file:deleted", id);
    return { ok: true };
  });
  electron.ipcMain.handle("files:savePermanently", async (_, id) => {
    var _a;
    const file = limboStore.get(id);
    if (!file) return { ok: false };
    const { filePath } = await electron.dialog.showSaveDialog({
      defaultPath: path.join(require("os").homedir(), "Documents", file.filename),
      title: "Save File Permanently"
    });
    if (!filePath) return { ok: false, cancelled: true };
    await fs.promises.copyFile(file.limboPath, filePath);
    limboStore.delete(id);
    try {
      await fs.promises.unlink(file.limboPath);
    } catch {
    }
    (_a = getWindow()) == null ? void 0 : _a.webContents.send("file:deleted", id);
    return { ok: true };
  });
  electron.ipcMain.handle("files:copyToClipboard", async (_, id) => {
    const file = limboStore.get(id);
    if (!file) return { ok: false };
    await copyFileToClipboard(file.limboPath);
    return { ok: true };
  });
  electron.ipcMain.handle("files:openInExplorer", async (_, id) => {
    const file = limboStore.get(id);
    if (!file) return { ok: false };
    electron.shell.showItemInFolder(file.limboPath);
    return { ok: true };
  });
  electron.ipcMain.handle("files:pinToggle", (_, id) => {
    const file = limboStore.get(id);
    if (!file) return { ok: false };
    limboStore.update(id, { isPinned: !file.isPinned });
    return { ok: true, isPinned: !file.isPinned };
  });
  electron.ipcMain.on("files:startDrag", (event, id) => {
    const file = limboStore.get(id);
    if (!file || !fs.existsSync(file.limboPath)) return;
    event.sender.startDrag({ file: file.limboPath, icon: file.limboPath });
  });
}
function registerSettingsHandlers() {
  electron.ipcMain.handle("settings:get", () => settingsService.get());
  electron.ipcMain.handle("settings:set", (_, partial) => {
    const updated = settingsService.set(partial);
    watcherService.restart();
    return updated;
  });
  electron.ipcMain.handle("settings:pickFolder", async () => {
    const { filePaths } = await electron.dialog.showOpenDialog({
      properties: ["openDirectory"],
      title: "Select folder to watch"
    });
    return filePaths[0] ?? null;
  });
}
if (!electron.app.requestSingleInstanceLock()) {
  electron.app.quit();
  process.exit(0);
}
let win = null;
let tray = null;
const isDev = process.env.NODE_ENV === "development" || !electron.app.isPackaged;
function getWindowPosition() {
  if (!tray || !win) return { x: 0, y: 0 };
  const trayBounds = tray.getBounds();
  const windowBounds = win.getBounds();
  const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
  const y = Math.round(trayBounds.y - windowBounds.height - 4);
  return { x, y };
}
function createWindow() {
  win = new electron.BrowserWindow({
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
      nodeIntegration: false
    }
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
  const iconPath = isDev ? path.join(process.cwd(), "resources/icons/tray-default.png") : path.join(process.resourcesPath, "icons/tray-default.png");
  const icon = electron.nativeImage.createFromPath(iconPath);
  tray = new electron.Tray(icon.isEmpty() ? electron.nativeImage.createEmpty() : icon);
  tray.setToolTip("Limbo — 0 files waiting");
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
    const menu = electron.Menu.buildFromTemplate([
      { label: "Open Limbo", click: () => {
        win == null ? void 0 : win.show();
        win == null ? void 0 : win.focus();
      } },
      { type: "separator" },
      { label: "Quit Limbo", click: () => electron.app.quit() }
    ]);
    tray == null ? void 0 : tray.popUpContextMenu(menu);
  });
}
function updateTrayBadge() {
  const count = limboStore.getAll().length;
  tray == null ? void 0 : tray.setToolTip(`Limbo — ${count} file${count !== 1 ? "s" : ""} waiting`);
}
electron.app.whenReady().then(() => {
  limboStore.init();
  createWindow();
  createTray();
  registerFileHandlers(() => win);
  registerSettingsHandlers();
  electron.ipcMain.on("window:minimize", () => win == null ? void 0 : win.minimize());
  electron.ipcMain.on("window:close", () => win == null ? void 0 : win.hide());
  if (win) {
    expiryManager.start(win);
    watcherService.start(win);
  }
  win == null ? void 0 : win.webContents.on("did-finish-load", updateTrayBadge);
});
electron.app.on("window-all-closed", () => {
});
electron.app.on("second-instance", () => {
  win == null ? void 0 : win.show();
  win == null ? void 0 : win.focus();
});
