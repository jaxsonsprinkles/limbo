import { useState, useEffect } from 'react'
import { Download, Github } from 'lucide-react'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream/90 backdrop-blur-md border-b border-limbo-border/50 shadow-sm' : ''}`}>
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <img src="/logo.png" alt="Limbo" className="w-8 h-8 rounded-xl shadow-primary shrink-0" />
          <span className="font-bold text-[#111] tracking-tight text-lg">Limbo</span>
        </a>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-limbo-text">
          <a href="#how-it-works" className="hover:text-[#111] transition-colors duration-150">How it works</a>
          <a href="#features" className="hover:text-[#111] transition-colors duration-150">Features</a>
          <a href="#download" className="hover:text-[#111] transition-colors duration-150">Download</a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
        <a
          href="https://github.com/jaxsonsprinkles/limbo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-limbo-text hover:text-[#111] transition-colors duration-150"
          aria-label="GitHub repository"
        >
          <Github size={20} />
        </a>
        <a
          href="#download"
          className="gradient-btn flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-pill shadow-primary"
        >
          <Download size={14} />
          Download
        </a>
        </div>
      </div>
    </nav>
  )
}
