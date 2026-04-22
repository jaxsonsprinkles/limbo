import { Notification } from 'electron'

export const notificationService = {
  notify(title: string, body: string) {
    if (!Notification.isSupported()) return
    new Notification({ title, body, silent: true }).show()
  },
}
