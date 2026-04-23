import { useEffect, useCallback, useState } from 'react'
import { useLimboStore } from '../store/limbo-store'
import { api } from '../lib/ipc'
import { FileGrid } from '../components/files/FileGrid'
import type { LimboFile } from '../store/types'
import type { ToastData } from '../components/ui/Toast'
import { ToastContainer } from '../components/ui/Toast'

export function LimboView() {
  const { files, countdowns, setFiles, addFile, removeFile, updateFile, setCountdown } = useLimboStore()
  const [toasts, setToasts] = useState<ToastData[]>([])

  useEffect(() => {
    api.files.getAll().then(setFiles)
  }, [setFiles])

  useEffect(() => {
    const offAdded = api.on.fileAdded((file) => addFile(file as LimboFile))
    const offDeleted = api.on.fileDeleted((id) => removeFile(id))
    const offExpired = api.on.fileExpired((id) => removeFile(id))
    const offCountdown = api.on.fileCountdown(({ id, secondsRemaining }) => setCountdown(id, secondsRemaining))
    return () => { offAdded(); offDeleted(); offExpired(); offCountdown() }
  }, [addFile, removeFile, setCountdown])

  const addToast = useCallback((message: string, type: ToastData['type']) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const handleUpdate = useCallback((id: string, partial: Partial<LimboFile>) => {
    updateFile(id, partial)
  }, [updateFile])

  return (
    <div className="flex flex-col flex-1 overflow-hidden relative">
      <FileGrid
        files={files}
        countdowns={countdowns}
        onRemove={removeFile}
        onUpdate={handleUpdate}
        onToast={addToast}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
