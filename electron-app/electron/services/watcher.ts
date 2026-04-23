import chokidar, { FSWatcher } from 'chokidar'
import path from 'path'
import crypto from 'crypto'
import mime from 'mime-types'
import fs from 'fs'
import { BrowserWindow } from 'electron'
import { limboStore, LimboFile } from './limbo-store'
import { getLimboDir, moveFile } from '../utils/path-utils'
import { settingsService } from './settings-service'
import { notificationService } from './notification-service'
import { copyFileToClipboard } from './clipboard-service'

let watchers: FSWatcher[] = []
let win: BrowserWindow | null = null
const inFlight = new Set<string>()

function shouldIntercept(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase()
  if (['.crdownload', '.part', '.download', '.tmp'].includes(ext)) return false
  const settings = settingsService.get()
  const { mode, extensions } = settings.fileTypeFilter
  if (mode === 'all') return true
  const clean = ext.replace('.', '')
  if (mode === 'include') return extensions.includes(clean)
  if (mode === 'exclude') return !extensions.includes(clean)
  return true
}

async function onFileAdded(filePath: string): Promise<void> {
  if (!shouldIntercept(filePath)) return
  if (inFlight.has(filePath)) return
  inFlight.add(filePath)
  try {
    const stat = await fs.promises.stat(filePath)
    const id = crypto.randomUUID()
    const ext = path.extname(filePath)
    const limboPath = path.join(getLimboDir(), `${id}${ext}`)
    await moveFile(filePath, limboPath)
    const settings = settingsService.get()
    const file: LimboFile = {
      id,
      originalPath: filePath,
      limboPath,
      filename: path.basename(filePath),
      size: stat.size,
      mimeType: mime.lookup(filePath) || 'application/octet-stream',
      addedAt: Date.now(),
      expiresAt: Date.now() + settings.defaultExpirySecs * 1000,
      isPinned: false,
    }
    limboStore.add(file)
    win?.webContents.send('file:added', file)
    notificationService.notify(`"${file.filename}" is in Limbo`, `Expires in ${Math.round(settings.defaultExpirySecs / 60)} min`)
    if (settings.autoClipboard) {
      copyFileToClipboard(file.limboPath).catch(() => {})
    }
  } catch {} finally {
    inFlight.delete(filePath)
  }
}

export const watcherService = {
  start(window: BrowserWindow) {
    win = window
    this.restart()
  },
  restart() {
    watchers.forEach(w => w.close())
    watchers = []
    const { watchedFolders } = settingsService.get()
    for (const folder of watchedFolders) {
      if (!fs.existsSync(folder)) continue
      const w = chokidar.watch(folder, {
        ignoreInitial: true,
        awaitWriteFinish: { stabilityThreshold: 1500, pollInterval: 200 },
        ignored: [/(^|[\/\\])\.\./, getLimboDir()],
        persistent: true,
        depth: 0,
      })
      w.on('add', onFileAdded)
      watchers.push(w)
    }
  },
  stop() {
    watchers.forEach(w => w.close())
    watchers = []
  },
  setWindow(window: BrowserWindow) {
    win = window
  },
}
