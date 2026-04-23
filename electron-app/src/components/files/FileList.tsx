import { useState } from 'react'
import { Pin, PinOff, Copy, Save, Trash2, FolderOpen, ClockPlus } from 'lucide-react'
import type { LimboFile } from '../../store/types'
import { FileIcon } from './FileIcon'
import { formatSize, formatDuration, formatDurationLong } from '../../lib/format'
import { api } from '../../lib/ipc'

const LONG_EXPIRY_THRESHOLD = 1800

interface FileListRowProps {
  file: LimboFile
  secondsRemaining: number
  onRemove: (id: string) => void
  onUpdate: (id: string, partial: Partial<LimboFile>) => void
  onToast: (msg: string, type: 'success' | 'error' | 'info', action?: { label: string; onClick: () => void }, duration?: number) => void
  selected?: boolean
  onSelectToggle?: (id: string) => void
}

export function FileListRow({ file, secondsRemaining, onRemove, onUpdate, onToast, selected, onSelectToggle }: FileListRowProps) {
  const [hovered, setHovered] = useState(false)
  const isLongExpiry = !file.isPinned && secondsRemaining > LONG_EXPIRY_THRESHOLD

  async function handlePin() {
    const res = await api.files.pinToggle(file.id)
    if (res.ok) onUpdate(file.id, { isPinned: res.isPinned })
  }

  async function handleCopy() {
    const res = await api.files.copyToClipboard(file.id)
    if (res.ok) onToast('Copied to clipboard', 'success')
    else onToast('Failed to copy', 'error')
  }

  async function handleSave() {
    const res = await api.files.savePermanently(file.id)
    if (res.cancelled) return
    if (res.ok) { onRemove(file.id); onToast('File saved', 'success') }
    else onToast('Failed to save', 'error')
  }

  function handleDelete() {
    onRemove(file.id)
    let cancelled = false
    const timer = setTimeout(() => { if (!cancelled) api.files.delete(file.id) }, 5000)
    onToast('File deleted', 'info', {
      label: 'Undo',
      onClick: () => {
        cancelled = true
        clearTimeout(timer)
        window.dispatchEvent(new CustomEvent('limbo:undo-delete', { detail: file }))
      },
    }, 5000)
  }

  async function handleOpen() {
    await api.files.openInExplorer(file.id)
  }

  function handleDragStart() {
    api.files.startDrag(file.id)
  }

  async function handleExtendExpiry(extraMs: number) {
    const newExpiry = file.expiresAt + extraMs
    const res = await api.files.updateExpiry(file.id, newExpiry)
    if (res.ok) onUpdate(file.id, { expiresAt: newExpiry })
  }

  const timeLabel = file.isPinned
    ? 'Pinned'
    : isLongExpiry
      ? `${formatDurationLong(secondsRemaining)}`
      : secondsRemaining > 0 ? `${formatDuration(secondsRemaining)}` : 'Expiring…'

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelectToggle?.(file.id)}
      className={`flex items-center gap-2.5 bg-white rounded-xl border px-3 py-2.5 cursor-grab active:cursor-grabbing transition-[box-shadow,border-color] duration-150 shadow-card hover:shadow-card-hover ${selected ? 'border-primary/60 ring-1 ring-primary/30' : 'border-limbo-border/60'}`}
    >
      {onSelectToggle && (
        <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${selected ? 'bg-primary border-primary' : 'border-limbo-border bg-white'} ${hovered || selected ? 'opacity-100' : 'opacity-0'}`}>
          {selected && <div className="w-1.5 h-1 border-b-2 border-r-2 border-white rotate-45 -mt-0.5" />}
        </div>
      )}

      <FileIcon mimeType={file.mimeType} size={16} />

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[#111] truncate" title={file.filename}>{file.filename}</p>
        <p className="text-[10px] text-limbo-text tabular-nums">{formatSize(file.size)}</p>
      </div>

      <span className={`text-[10px] tabular-nums shrink-0 ${secondsRemaining <= 60 && !file.isPinned ? 'text-limbo-danger' : 'text-limbo-text'}`}>
        {timeLabel}
      </span>

      <div className={`flex items-center gap-0.5 transition-opacity duration-150 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
        <ListAction icon={file.isPinned ? PinOff : Pin} onClick={handlePin} title={file.isPinned ? 'Unpin' : 'Pin'} />
        <ListAction icon={Copy} onClick={handleCopy} title="Copy" />
        <ListAction icon={Save} onClick={handleSave} title="Save" />
        <ListAction icon={FolderOpen} onClick={handleOpen} title="Open" />
        {!file.isPinned && <ListAction icon={ClockPlus} onClick={() => handleExtendExpiry(10 * 60 * 1000)} title="+10m" />}
        <ListAction icon={Trash2} onClick={handleDelete} title="Delete" danger />
      </div>
    </div>
  )
}

function ListAction({ icon: Icon, onClick, title, danger }: { icon: typeof Pin; onClick: () => void; title: string; danger?: boolean }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick() }}
      title={title}
      className={`flex items-center justify-center w-6 h-6 rounded-md transition-[background,color] duration-100 active:scale-[0.96] ${danger ? 'text-limbo-text hover:text-limbo-danger hover:bg-limbo-danger/10' : 'text-limbo-text hover:text-[#111] hover:bg-limbo-muted'}`}
    >
      <Icon size={12} />
    </button>
  )
}
