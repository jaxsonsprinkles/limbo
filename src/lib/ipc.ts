import type { LimboFile, Settings } from '../store/types'

declare global {
  interface Window {
    electronAPI: {
      files: {
        getAll: () => Promise<LimboFile[]>
        delete: (id: string) => Promise<{ ok: boolean }>
        savePermanently: (id: string) => Promise<{ ok: boolean; cancelled?: boolean; savedPath?: string }>
        copyToClipboard: (id: string) => Promise<{ ok: boolean }>
        openInExplorer: (id: string) => Promise<{ ok: boolean }>
        pinToggle: (id: string) => Promise<{ ok: boolean; isPinned: boolean }>
        startDrag: (id: string) => void
        updateExpiry: (id: string, expiresAt: number) => Promise<{ ok: boolean }>
      }
      settings: {
        get: () => Promise<Settings>
        set: (s: Partial<Settings>) => Promise<Settings>
        pickFolder: () => Promise<string | null>
      }
      on: {
        fileAdded: (cb: (file: LimboFile) => void) => () => void
        fileExpired: (cb: (id: string) => void) => () => void
        fileDeleted: (cb: (id: string) => void) => () => void
        fileCountdown: (cb: (data: { id: string; secondsRemaining: number }) => void) => () => void
      }
      window: {
        minimize: () => void
        close: () => void
      }
    }
  }
}

export const api = window.electronAPI
