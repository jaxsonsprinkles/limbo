"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  files: {
    getAll: () => electron.ipcRenderer.invoke("files:getAll"),
    delete: (id) => electron.ipcRenderer.invoke("files:delete", id),
    savePermanently: (id) => electron.ipcRenderer.invoke("files:savePermanently", id),
    copyToClipboard: (id) => electron.ipcRenderer.invoke("files:copyToClipboard", id),
    openInExplorer: (id) => electron.ipcRenderer.invoke("files:openInExplorer", id),
    pinToggle: (id) => electron.ipcRenderer.invoke("files:pinToggle", id),
    startDrag: (id) => electron.ipcRenderer.send("files:startDrag", id)
  },
  settings: {
    get: () => electron.ipcRenderer.invoke("settings:get"),
    set: (settings) => electron.ipcRenderer.invoke("settings:set", settings),
    pickFolder: () => electron.ipcRenderer.invoke("settings:pickFolder")
  },
  on: {
    fileAdded: (cb) => {
      const handler = (_, file) => cb(file);
      electron.ipcRenderer.on("file:added", handler);
      return () => electron.ipcRenderer.removeListener("file:added", handler);
    },
    fileExpired: (cb) => {
      const handler = (_, id) => cb(id);
      electron.ipcRenderer.on("file:expired", handler);
      return () => electron.ipcRenderer.removeListener("file:expired", handler);
    },
    fileDeleted: (cb) => {
      const handler = (_, id) => cb(id);
      electron.ipcRenderer.on("file:deleted", handler);
      return () => electron.ipcRenderer.removeListener("file:deleted", handler);
    },
    fileCountdown: (cb) => {
      const handler = (_, data) => cb(data);
      electron.ipcRenderer.on("file:countdown", handler);
      return () => electron.ipcRenderer.removeListener("file:countdown", handler);
    }
  },
  window: {
    minimize: () => electron.ipcRenderer.send("window:minimize"),
    close: () => electron.ipcRenderer.send("window:close")
  }
});
