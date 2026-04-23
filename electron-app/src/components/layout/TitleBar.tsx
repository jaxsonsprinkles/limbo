import { Minus, X } from 'lucide-react'
import { api } from '../../lib/ipc'

export function TitleBar() {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 shrink-0"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7B6CF6] to-primary" />
        <span className="text-sm font-semibold text-[#111] tracking-tight">Limbo</span>
      </div>
      <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button
          onClick={() => api.window.minimize()}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-limbo-text hover:text-[#111] hover:bg-limbo-muted transition-[background,color] duration-150 active:scale-[0.96]"
        >
          <Minus size={12} />
        </button>
        <button
          onClick={() => api.window.close()}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-limbo-text hover:text-limbo-danger hover:bg-limbo-danger/10 transition-[background,color] duration-150 active:scale-[0.96]"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}
