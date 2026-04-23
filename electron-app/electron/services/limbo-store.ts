import fs from 'fs'
import path from 'path'
import { getRegistryPath, getLimboDir } from '../utils/path-utils'

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

const files = new Map<string, LimboFile>()

function load(): void {
  const registryPath = getRegistryPath()
  if (!fs.existsSync(registryPath)) return
  try {
    const raw = fs.readFileSync(registryPath, 'utf-8')
    const entries: LimboFile[] = JSON.parse(raw)
    const now = Date.now()
    for (const entry of entries) {
      if (!fs.existsSync(entry.limboPath)) continue
      if (!entry.isPinned && entry.expiresAt <= now) {
        try { fs.unlinkSync(entry.limboPath) } catch {}
        continue
      }
      files.set(entry.id, entry)
    }
  } catch {}
}

function persist(): void {
  try {
    fs.writeFileSync(getRegistryPath(), JSON.stringify([...files.values()], null, 2))
  } catch {}
}

export const limboStore = {
  init() { load() },
  add(file: LimboFile) {
    files.set(file.id, file)
    persist()
  },
  get(id: string): LimboFile | undefined {
    return files.get(id)
  },
  getAll(): LimboFile[] {
    return [...files.values()].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
      return b.addedAt - a.addedAt
    })
  },
  delete(id: string): LimboFile | undefined {
    const file = files.get(id)
    if (!file) return undefined
    files.delete(id)
    persist()
    return file
  },
  update(id: string, partial: Partial<LimboFile>): LimboFile | undefined {
    const file = files.get(id)
    if (!file) return undefined
    const updated = { ...file, ...partial }
    files.set(id, updated)
    persist()
    return updated
  },
  getLimboDir,
}
