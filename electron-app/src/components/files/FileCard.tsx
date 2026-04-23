import { useState } from 'react'
import { Pin, PinOff, Copy, Save, Trash2, FolderOpen } from 'lucide-react'
import type { LimboFile } from '../../store/types'
import { FileIcon } from './FileIcon'
import { CountdownRing } from './CountdownRing'
import { formatSize, formatDuration } from '../../lib/format'
import { api } from '../../lib/ipc'

interface FileCardProps {
  file: LimboFile
  secondsRemaining: number
  onRemove: (id: string) => void
  onUpdate: (id: string, partial: Partial<LimboFile>) => void
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void
}

export function FileCard({ file, secondsRemaining, onRemove, onUpdate, onToast }: FileCardProps) {
  const [hovered, setHovered] = useState(false)
  const totalSeconds = Math.round((file.expiresAt - file.addedAt) / 1000)
  const nameWithoutExt = file.filename.replace(/\.[^.]+$/, '')
  const ext = file.filename.match(/\.[^.]+$/)?.[0] ?? ''

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

  async function handleDelete() {
    await api.files.delete(file.id)
    onRemove(file.id)
  }

  async function handleOpen() {
    await api.files.openInExplorer(file.id)
  }

  function handleDragStart() {
    api.files.startDrag(file.id)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-white rounded-xl border border-limbo-border/60 p-3 cursor-grab active:cursor-grabbing transition-[transform,box-shadow] duration-200 ease-smooth hover:-translate-y-0.5 hover:shadow-card-hover shadow-card"
    >
      {/* Pin indicator */}
      {file.isPinned && (
        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
      )}

      <div className="flex items-start gap-3">
        <FileIcon mimeType={file.mimeType} size={18} />

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[#111] leading-tight truncate" title={file.filename}>
            {nameWithoutExt}
            <span className="text-limbo-text font-normal">{ext}</span>
          </p>
          <p className="text-[10px] text-limbo-text mt-0.5 tabular-nums">{formatSize(file.size)}</p>
        </div>

        {!file.isPinned && (
          <div className="shrink-0">
            <CountdownRing secondsRemaining={secondsRemaining} totalSeconds={totalSeconds} size={36} />
          </div>
        )}
      </div>

      {!file.isPinned && (
        <p className="text-[10px] text-limbo-text mt-2 tabular-nums">
          {secondsRemaining > 0 ? `${formatDuration(secondsRemaining)} left` : 'Expiring…'}
        </p>
      )}

      {/* Actions — fade in on hover */}
      <div className={`flex items-center gap-1 mt-2.5 transition-[opacity,transform] duration-150 ease-smooth ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-0.5'}`}>
        <ActionButton icon={file.isPinned ? PinOff : Pin} onClick={handlePin} title={file.isPinned ? 'Unpin' : 'Pin'} />
        <ActionButton icon={Copy} onClick={handleCopy} title="Copy to clipboard" />
        <ActionButton icon={Save} onClick={handleSave} title="Save permanently" />
        <ActionButton icon={FolderOpen} onClick={handleOpen} title="Show in Explorer" />
        <ActionButton icon={Trash2} onClick={handleDelete} title="Delete" danger />
      </div>
    </div>
  )
}

function ActionButton({ icon: Icon, onClick, title, danger }: { icon: typeof Pin; onClick: () => void; title: string; danger?: boolean }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick() }}
      title={title}
      className={`flex items-center justify-center w-7 h-7 rounded-lg transition-[background,color,transform] duration-150 active:scale-[0.96] ${danger ? 'text-limbo-text hover:text-limbo-danger hover:bg-limbo-danger/10' : 'text-limbo-text hover:text-[#111] hover:bg-limbo-muted'}`}
    >
      <Icon size={13} />
    </button>
  )
}
