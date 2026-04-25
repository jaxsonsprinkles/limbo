import { useLocation, useNavigate } from 'react-router-dom'
import { Layers, Settings } from 'lucide-react'
import { useLimboStore } from '../../store/limbo-store'

export function NavBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const count = useLimboStore((s) => s.files.length)

  const tabs = [
    { path: '/', icon: Layers, label: 'Limbo', badge: count > 0 ? count : null },
    { path: '/settings', icon: Settings, label: 'Settings', badge: null },
  ]

  return (
    <div className="flex items-center gap-1 px-4 pb-3 shrink-0">
      {tabs.map(({ path, icon: Icon, label, badge }) => {
        const active = location.pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-semibold transition-[transform,box-shadow,filter,background,color] duration-200 active:scale-[0.99] active:brightness-[0.96] relative ${active ? '[background:linear-gradient(135deg,#7B6CF6,#6C5CE7)_padding-box,linear-gradient(135deg,#9B8CFF,#7B6CF6)_border-box] border-2 border-transparent text-white shadow-[0_4px_10px_rgba(108,92,231,0.22)]' : 'text-limbo-text hover:text-[#111] hover:bg-limbo-muted border-2 border-transparent'}`}
          >
            <Icon size={13} />
            {label}
            {badge !== null && (
              <span className={`ml-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-pill text-[10px] font-semibold tabular-nums ${active ? 'bg-white/25 text-white' : 'bg-primary text-white'}`}>
                {badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
