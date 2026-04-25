import { app } from 'electron'
import fs from 'fs'
import path from 'path'

export function getLimboDir(): string {
  const dir = path.join(app.getPath('userData'), 'limbo-files')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return dir
}

export function getRegistryPath(): string {
  return path.join(app.getPath('userData'), 'limbo-registry.json')
}

export async function moveFile(src: string, dest: string): Promise<void> {
  try {
    await fs.promises.rename(src, dest)
  } catch (err: any) {
    if (err.code === 'EXDEV') {
      await fs.promises.copyFile(src, dest)
      await fs.promises.unlink(src)
    } else {
      throw err
    }
  }
}
