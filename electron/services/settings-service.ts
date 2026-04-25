import Store from 'electron-store'
import os from 'os'
import path from 'path'

export interface Settings {
  watchedFolders: string[]
  defaultExpirySecs: number
  fileTypeFilter: { mode: 'all' | 'include' | 'exclude'; extensions: string[] }
  soundEnabled: boolean
  autoLaunch: boolean
  showNotifications: boolean
  autoClipboard: boolean
}

const defaults: Settings = {
  watchedFolders: [path.join(os.homedir(), 'Downloads')],
  defaultExpirySecs: 300,
  fileTypeFilter: { mode: 'all', extensions: [] },
  soundEnabled: false,
  autoLaunch: false,
  showNotifications: true,
  autoClipboard: true,
}

const store = new Store<Settings>({ defaults })

export const settingsService = {
  get(): Settings {
    return store.store
  },
  set(partial: Partial<Settings>): Settings {
    Object.entries(partial).forEach(([k, v]) => store.set(k as keyof Settings, v))
    return store.store
  },
}
