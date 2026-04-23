export function Footer() {
  return (
    <footer className="border-t border-limbo-border/60 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg gradient-btn flex items-center justify-center">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L13 5.5V10.5L8 14L3 10.5V5.5L8 2Z" fill="white" fillOpacity="0.9" />
              <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" fillOpacity="0.4" />
            </svg>
          </div>
          <span className="font-bold text-[#111] text-sm">Limbo</span>
        </div>

        <p className="text-xs text-limbo-text text-center">
          Built for people who download things and immediately forget about them.
        </p>

        <p className="text-xs text-limbo-text/50">
          © {new Date().getFullYear()} Limbo
        </p>
      </div>
    </footer>
  )
}
