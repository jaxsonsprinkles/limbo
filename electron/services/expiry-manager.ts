import fs from 'fs'
import { BrowserWindow } from 'electron'
import { limboStore } from './limbo-store'

let interval: ReturnType<typeof setInterval> | null = null
let win: BrowserWindow | null = null

function tick() {
  const now = Date.now()
  const files = limboStore.getAll()
  for (const file of files) {
    if (file.isPinned) continue
    const remaining = Math.ceil((file.expiresAt - now) / 1000)
    if (remaining <= 0) {
      limboStore.delete(file.id)
      try { fs.unlinkSync(file.limboPath) } catch {}
      win?.webContents.send('file:expired', file.id)
      win?.webContents.send('file:deleted', file.id)
    } else {
      win?.webContents.send('file:countdown', { id: file.id, secondsRemaining: remaining })
    }
  }
}

export const expiryManager = {
  start(window: BrowserWindow) {
    win = window
    interval = setInterval(tick, 1000)
  },
  stop() {
    if (interval) clearInterval(interval)
    interval = null
  },
  setWindow(window: BrowserWindow) {
    win = window
  },
}
