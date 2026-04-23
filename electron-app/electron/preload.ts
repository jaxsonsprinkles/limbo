import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  files: {
    getAll: () => ipcRenderer.invoke('files:getAll'),
    delete: (id: string) => ipcRenderer.invoke('files:delete', id),
    savePermanently: (id: string) => ipcRenderer.invoke('files:savePermanently', id),
    copyToClipboard: (id: string) => ipcRenderer.invoke('files:copyToClipboard', id),
    openInExplorer: (id: string) => ipcRenderer.invoke('files:openInExplorer', id),
    pinToggle: (id: string) => ipcRenderer.invoke('files:pinToggle', id),
    startDrag: (id: string) => ipcRenderer.send('files:startDrag', id),
    updateExpiry: (id: string, expiresAt: number) => ipcRenderer.invoke('files:updateExpiry', id, expiresAt),
  },
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    set: (settings: unknown) => ipcRenderer.invoke('settings:set', settings),
    pickFolder: () => ipcRenderer.invoke('settings:pickFolder'),
  },
  on: {
    fileAdded: (cb: (file: unknown) => void) => {
      const handler = (_: unknown, file: unknown) => cb(file)
      ipcRenderer.on('file:added', handler)
      return () => ipcRenderer.removeListener('file:added', handler)
    },
    fileExpired: (cb: (id: string) => void) => {
      const handler = (_: unknown, id: string) => cb(id)
      ipcRenderer.on('file:expired', handler)
      return () => ipcRenderer.removeListener('file:expired', handler)
    },
    fileDeleted: (cb: (id: string) => void) => {
      const handler = (_: unknown, id: string) => cb(id)
      ipcRenderer.on('file:deleted', handler)
      return () => ipcRenderer.removeListener('file:deleted', handler)
    },
    fileCountdown: (cb: (data: { id: string; secondsRemaining: number }) => void) => {
      const handler = (_: unknown, data: { id: string; secondsRemaining: number }) => cb(data)
      ipcRenderer.on('file:countdown', handler)
      return () => ipcRenderer.removeListener('file:countdown', handler)
    },
  },
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    close: () => ipcRenderer.send('window:close'),
  },
})
