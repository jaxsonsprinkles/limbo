export interface LimboFile {
  id: string
  originalPath: string
  limboPath: string
  filename: string
  size: number
  mimeType: string
  addedAt: number
  expiresAt: number
  isPinned: boolean
}

export interface Settings {
  watchedFolders: string[]
  defaultExpirySecs: number
  fileTypeFilter: { mode: 'all' | 'include' | 'exclude'; extensions: string[] }
  soundEnabled: boolean
  autoLaunch: boolean
  showNotifications: boolean
  autoClipboard: boolean
}
