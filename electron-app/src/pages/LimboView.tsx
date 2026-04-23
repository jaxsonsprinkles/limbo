import { useEffect, useCallback, useState, useRef } from 'react'
import { LayoutGrid, List, Search, Trash2, Save } from 'lucide-react'
import { useLimboStore } from '../store/limbo-store'
import { api } from '../lib/ipc'
import { FileGrid } from '../components/files/FileGrid'
import { formatSize } from '../lib/format'
import type { LimboFile, Settings } from '../store/types'
import type { ToastData } from '../components/ui/Toast'
import { ToastContainer } from '../components/ui/Toast'

export function LimboView() {
  const { files, countdowns, view, setFiles, addFile, removeFile, updateFile, setCountdown, setView } = useLimboStore()
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [settings, setSettings] = useState<Settings | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    api.files.getAll().then(setFiles)
    api.settings.get().then(setSettings)
  }, [setFiles])

  // Undo-delete: re-add file to store
  useEffect(() => {
    function onUndo(e: Event) {
      const file = (e as CustomEvent<LimboFile>).detail
      addFile(file)
    }
    window.addEventListener('limbo:undo-delete', onUndo)
    return () => window.removeEventListener('limbo:undo-delete', onUndo)
  }, [addFile])

  useEffect(() => {
    const offAdded = api.on.fileAdded((file) => {
      addFile(file as LimboFile)
      if (settings?.soundEnabled) playArrivalSound()
    })
    const offDeleted = api.on.fileDeleted((id) => removeFile(id))
    const offExpired = api.on.fileExpired((id) => removeFile(id))
    const offCountdown = api.on.fileCountdown(({ id, secondsRemaining }) => setCountdown(id, secondsRemaining))
    return () => { offAdded(); offDeleted(); offExpired(); offCountdown() }
  }, [addFile, removeFile, setCountdown, settings])

  function playArrivalSound() {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext()
      const ctx = audioCtxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
      osc.start()
      osc.stop(ctx.currentTime + 0.25)
    } catch {}
  }

  const addToast = useCallback((message: string, type: ToastData['type'], action?: ToastData['action'], duration?: number) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type, action, duration }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const handleUpdate = useCallback((id: string, partial: Partial<LimboFile>) => {
    updateFile(id, partial)
  }, [updateFile])

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleBulkDelete() {
    const ids = [...selectedIds]
    setSelectedIds(new Set())
    ids.forEach((id) => removeFile(id))
    let cancelled = false
    const timer = setTimeout(() => {
      if (!cancelled) ids.forEach((id) => api.files.delete(id))
    }, 5000)
    addToast(`${ids.length} file${ids.length !== 1 ? 's' : ''} deleted`, 'info', {
      label: 'Undo',
      onClick: () => {
        cancelled = true
        clearTimeout(timer)
        // Re-fetch to restore — simplest approach
        api.files.getAll().then(setFiles)
      },
    }, 5000)
  }

  async function handleBulkSave() {
    for (const id of selectedIds) {
      const res = await api.files.savePermanently(id)
      if (res.ok) removeFile(id)
      if (res.cancelled) break
    }
    setSelectedIds(new Set())
  }

  async function handleUnpinAll() {
    const pinned = files.filter((f) => f.isPinned)
    for (const f of pinned) {
      const res = await api.files.pinToggle(f.id)
      if (res.ok) updateFile(f.id, { isPinned: false })
    }
  }

  async function handleDeleteAllUnpinned() {
    const unpinned = files.filter((f) => !f.isPinned)
    unpinned.forEach((f) => removeFile(f.id))
    let cancelled = false
    const timer = setTimeout(() => {
      if (!cancelled) unpinned.forEach((f) => api.files.delete(f.id))
    }, 5000)
    addToast(`${unpinned.length} file${unpinned.length !== 1 ? 's' : ''} deleted`, 'info', {
      label: 'Undo',
      onClick: () => {
        cancelled = true
        clearTimeout(timer)
        api.files.getAll().then(setFiles)
      },
    }, 5000)
  }

  const filteredFiles = search
    ? files.filter((f) => f.filename.toLowerCase().includes(search.toLowerCase()))
    : files

  const pinnedCount = files.filter((f) => f.isPinned).length
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0)
  const hasFiles = files.length > 0
  const hasSelected = selectedIds.size > 0

  return (
    <div className="flex flex-col flex-1 overflow-hidden relative">
      {/* Toolbar */}
      {hasFiles && (
        <div className="flex items-center gap-2 px-3 pt-2 pb-1.5 shrink-0">
          {/* Search */}
          <div className="flex-1 flex items-center gap-1.5 bg-limbo-muted rounded-lg px-2.5 py-1.5">
            <Search size={11} className="text-limbo-text shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files…"
              className="flex-1 bg-transparent text-xs text-[#111] placeholder:text-limbo-text outline-none min-w-0"
            />
          </div>

          {/* Disk usage */}
          <span className="text-[10px] text-limbo-text tabular-nums shrink-0">{formatSize(totalBytes)}</span>

          {/* View toggle */}
          <div className="flex items-center bg-limbo-muted rounded-lg p-0.5 gap-0.5 shrink-0">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-md transition-colors duration-150 ${view === 'grid' ? 'bg-white shadow-sm text-[#111]' : 'text-limbo-text hover:text-[#111]'}`}
              title="Grid view"
            >
              <LayoutGrid size={12} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-md transition-colors duration-150 ${view === 'list' ? 'bg-white shadow-sm text-[#111]' : 'text-limbo-text hover:text-[#111]'}`}
              title="List view"
            >
              <List size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Secondary toolbar: pinned info + bulk actions */}
      {hasFiles && (
        <div className="flex items-center gap-1.5 px-3 pb-1 shrink-0">
          {pinnedCount > 0 && (
            <>
              <span className="text-[10px] text-limbo-text">{pinnedCount} pinned</span>
              <button
                onClick={handleUnpinAll}
                className="text-[10px] text-primary hover:underline"
              >
                Unpin all
              </button>
              <span className="text-[10px] text-limbo-border">·</span>
            </>
          )}
          {hasSelected ? (
            <>
              <span className="text-[10px] text-limbo-text">{selectedIds.size} selected</span>
              <button onClick={handleBulkDelete} className="flex items-center gap-0.5 text-[10px] text-limbo-danger hover:underline">
                <Trash2 size={9} /> Delete
              </button>
              <button onClick={handleBulkSave} className="flex items-center gap-0.5 text-[10px] text-primary hover:underline">
                <Save size={9} /> Save
              </button>
              <button onClick={() => setSelectedIds(new Set())} className="text-[10px] text-limbo-text hover:underline ml-auto">
                Clear
              </button>
            </>
          ) : (
            <button
              onClick={handleDeleteAllUnpinned}
              className="flex items-center gap-0.5 text-[10px] text-limbo-text hover:text-limbo-danger transition-colors duration-150 ml-auto"
              title="Delete all unpinned files"
            >
              <Trash2 size={9} /> Delete unpinned
            </button>
          )}
        </div>
      )}

      <FileGrid
        files={filteredFiles}
        countdowns={countdowns}
        onRemove={removeFile}
        onUpdate={handleUpdate}
        onToast={addToast}
        selectedIds={selectedIds}
        onSelectToggle={toggleSelect}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
