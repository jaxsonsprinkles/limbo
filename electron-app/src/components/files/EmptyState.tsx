import { Download } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center">
        <Download size={22} className="text-primary/60" />
      </div>
      <div>
        <p className="text-sm font-medium text-[#111]" style={{ textWrap: 'balance' } as React.CSSProperties}>
          Nothing in Limbo yet
        </p>
        <p className="text-xs text-limbo-text mt-1" style={{ textWrap: 'pretty' } as React.CSSProperties}>
          Files you download will appear here automatically
        </p>
      </div>
    </div>
  )
}
