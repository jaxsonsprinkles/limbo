import type { LimboFile } from '../../store/types'
import { useLimboStore } from '../../store/limbo-store'
import { FileCard } from './FileCard'
import { FileListRow } from './FileList'
import { EmptyState } from './EmptyState'

type ToastFn = (msg: string, type: 'success' | 'error' | 'info', action?: { label: string; onClick: () => void }, duration?: number) => void

interface FileGridProps {
  files: LimboFile[]
  countdowns: Record<string, number>
  onRemove: (id: string) => void
  onUpdate: (id: string, partial: Partial<LimboFile>) => void
  onToast: ToastFn
  selectedIds: Set<string>
  onSelectToggle: (id: string) => void
}

export function FileGrid({ files, countdowns, onRemove, onUpdate, onToast, selectedIds, onSelectToggle }: FileGridProps) {
  const view = useLimboStore((s) => s.view)

  if (files.length === 0) return <EmptyState />

  if (view === 'list') {
    return (
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="flex flex-col gap-1.5">
          {files.map((file) => (
            <FileListRow
              key={file.id}
              file={file}
              secondsRemaining={countdowns[file.id] ?? Math.ceil((file.expiresAt - Date.now()) / 1000)}
              onRemove={onRemove}
              onUpdate={onUpdate}
              onToast={onToast}
              selected={selectedIds.has(file.id)}
              onSelectToggle={onSelectToggle}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 pb-3">
      <div className="grid grid-cols-2 gap-2">
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            secondsRemaining={countdowns[file.id] ?? Math.ceil((file.expiresAt - Date.now()) / 1000)}
            onRemove={onRemove}
            onUpdate={onUpdate}
            onToast={onToast}
            selected={selectedIds.has(file.id)}
            onSelectToggle={onSelectToggle}
          />
        ))}
      </div>
    </div>
  )
}
