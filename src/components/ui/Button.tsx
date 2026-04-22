import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  static?: boolean
}

export function Button({ variant = 'primary', size = 'md', static: isStatic, className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-semibold rounded-pill select-none outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none transition-[transform,box-shadow,filter] duration-200'
  const press = isStatic ? '' : 'active:scale-[0.99] active:brightness-[0.96]'

  const sizes = {
    sm: 'px-4 py-2 text-xs min-h-[34px]',
    md: 'px-7 py-3.5 text-sm min-h-[44px]',
  }

  const variants = {
    primary: [
      '[background:linear-gradient(135deg,#7B6CF6,#6C5CE7)_padding-box,linear-gradient(135deg,#9B8CFF,#7B6CF6)_border-box]',
      'border-2 border-transparent',
      'text-white',
      '[text-shadow:0px_1px_3px_rgba(108,80,224,0.4)]',
      'shadow-[0_6px_16px_rgba(108,92,231,0.25)]',
      'hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(108,92,231,0.35)] hover:brightness-[1.06]',
    ].join(' '),
    secondary: [
      'bg-white border border-[#E5E5E5] text-[#111111]',
      'hover:bg-gray-50 hover:-translate-y-px',
      'shadow-[0_1px_4px_rgba(0,0,0,0.06)]',
    ].join(' '),
    ghost: 'text-limbo-text hover:text-[#111] hover:bg-limbo-muted',
    danger: 'bg-limbo-danger/10 text-limbo-danger hover:bg-limbo-danger/20 border border-limbo-danger/20',
  }

  return (
    <button className={`${base} ${press} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
