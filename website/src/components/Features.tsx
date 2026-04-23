import {
  Clock, Shield, Bell, LayoutGrid, Search, ClipboardCopy,
  Pin, Undo2, SlidersHorizontal, Volume2, MousePointerClick, Zap
} from 'lucide-react'

const FEATURES = [
  {
    icon: Clock,
    title: 'Per-file timers',
    description: 'Every file gets its own countdown. Extend by +10 min or +1 hour with one click if you need more time.',
    color: '#6C5CE7',
    bg: '#EDE9FF',
    size: 'lg',
  },
  {
    icon: Pin,
    title: 'Pin to keep forever',
    description: 'Important file? Pin it. Pinned files never expire and sit above the rest until you let them go.',
    color: '#E17055',
    bg: '#FFF3EE',
    size: 'sm',
  },
  {
    icon: ClipboardCopy,
    title: 'Clipboard on arrival',
    description: 'File path is copied automatically the moment a file lands. Just paste where you need it.',
    color: '#00B894',
    bg: '#E8FFF5',
    size: 'sm',
  },
  {
    icon: Search,
    title: 'Instant search',
    description: 'Filter by filename across all files in Limbo. Find anything in under a second.',
    color: '#F59E0B',
    bg: '#FFF8E6',
    size: 'sm',
  },
  {
    icon: LayoutGrid,
    title: 'Grid & list views',
    description: 'Switch between a compact grid for quick scanning or a dense list view for power users.',
    color: '#6C5CE7',
    bg: '#EDE9FF',
    size: 'sm',
  },
  {
    icon: Undo2,
    title: 'Undo delete',
    description: 'Deleted something by accident? You have 5 seconds to undo before it\'s gone for good.',
    color: '#FF6B6B',
    bg: '#FFF1F1',
    size: 'lg',
  },
  {
    icon: SlidersHorizontal,
    title: 'Extension filters',
    description: 'Only intercept PDFs and ZIPs. Or intercept everything except executables. Your call.',
    color: '#A78BFA',
    bg: '#F3F0FF',
    size: 'sm',
  },
  {
    icon: Bell,
    title: 'Smart notifications',
    description: 'Get a system notification every time a file lands in Limbo — or silence them in one toggle.',
    color: '#F59E0B',
    bg: '#FFF8E6',
    size: 'sm',
  },
  {
    icon: Volume2,
    title: 'Arrival chime',
    description: 'A subtle sound plays when a new file is intercepted. A gentle nudge without looking at the screen.',
    color: '#00CEC9',
    bg: '#E6FFFE',
    size: 'sm',
  },
  {
    icon: Shield,
    title: '100% local & private',
    description: 'No cloud. No account. No telemetry. Files never leave your machine. Limbo is purely local.',
    color: '#22C55E',
    bg: '#E8FFF5',
    size: 'lg',
  },
  {
    icon: MousePointerClick,
    title: 'Bulk actions',
    description: 'Select multiple files and delete, save, or unpin them all at once. Great for batch cleanup.',
    color: '#6C5CE7',
    bg: '#EDE9FF',
    size: 'sm',
  },
  {
    icon: Zap,
    title: 'Instant startup',
    description: 'Limbo starts with Windows in under a second. It\'s ready before you even open your browser.',
    color: '#F59E0B',
    bg: '#FFF8E6',
    size: 'sm',
  },
]

export function Features() {
  return (
    <section id="features" className="py-28 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-3">Features</p>
          <h2 className="text-4xl lg:text-5xl font-black text-[#111] tracking-tight mb-4">
            Everything you need,{' '}
            <span className="gradient-text">nothing you don't</span>
          </h2>
          <p className="text-lg text-limbo-text max-w-xl mx-auto leading-relaxed">
            Limbo is focused and fast. No bloat, no subscriptions, no settings maze.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            const isWide = i === 0 || i === 5 || i === 9
            return (
              <div
                key={feature.title}
                className={`group bg-cream rounded-2xl p-5 border border-limbo-border/60 hover:border-primary/20 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 ${isWide ? 'col-span-2' : 'col-span-1'}`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: feature.bg, color: feature.color }}
                >
                  <Icon size={18} />
                </div>
                <h3 className="text-sm font-bold text-[#111] mb-1.5 tracking-tight">{feature.title}</h3>
                <p className="text-[13px] text-limbo-text leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
