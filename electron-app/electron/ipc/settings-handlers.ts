import { ipcMain, dialog, app } from 'electron'
import { settingsService } from '../services/settings-service'
import { watcherService } from '../services/watcher'

export function registerSettingsHandlers() {
  ipcMain.handle('settings:get', () => settingsService.get())

  ipcMain.handle('settings:set', (_, partial) => {
    const updated = settingsService.set(partial)
    watcherService.restart()
    if (typeof partial.autoLaunch === 'boolean' && app.isPackaged) {
      try {
        app.setLoginItemSettings({ openAtLogin: partial.autoLaunch })
      } catch {
        // macOS rejects login item registration for unsigned builds
      }
    }
    return updated
  })

  ipcMain.handle('settings:pickFolder', async () => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select folder to watch',
    })
    return filePaths[0] ?? null
  })
}
