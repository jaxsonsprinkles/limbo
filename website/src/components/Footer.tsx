export function Footer() {
  return (
    <footer className="border-t border-limbo-border/60 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Limbo" className="w-6 h-6 rounded-lg" />
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
