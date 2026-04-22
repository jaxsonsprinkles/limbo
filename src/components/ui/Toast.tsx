import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

export interface ToastData {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastProps {
  toast: ToastData
  onDismiss: (id: string) => void
}

function Toast({ toast, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10)
    const hide = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(toast.id), 200)
    }, 3000)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [toast.id, onDismiss])

  const icons = {
    success: <CheckCircle size={14} className="text-limbo-success shrink-0" />,
    error: <AlertCircle size={14} className="text-limbo-danger shrink-0" />,
    info: <Info size={14} className="text-primary shrink-0" />,
  }

  return (
    <div className={`flex items-center gap-2 bg-white rounded-xl shadow-card border border-limbo-border px-3 py-2.5 text-sm text-[#111] transition-[opacity,transform] duration-200 ease-smooth ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
      {icons[toast.type]}
      <span>{toast.message}</span>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastData[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2 z-50 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  )
}
