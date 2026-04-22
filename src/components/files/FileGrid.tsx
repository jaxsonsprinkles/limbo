import type { LimboFile } from '../../store/types'
import { FileCard } from './FileCard'
import { EmptyState } from './EmptyState'

interface FileGridProps {
  files: LimboFile[]
  countdowns: Record<string, number>
  onRemove: (id: string) => void
  onUpdate: (id: string, partial: Partial<LimboFile>) => void
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void
}

export function FileGrid({ files, countdowns, onRemove, onUpdate, onToast }: FileGridProps) {
  if (files.length === 0) return <EmptyState />

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
          />
        ))}
      </div>
    </div>
  )
}
