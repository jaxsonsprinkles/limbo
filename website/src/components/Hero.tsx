import { Download, ArrowDown } from 'lucide-react'
import { AppMockup } from './AppMockup'

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/6 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/4 blur-[80px]" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] rounded-full bg-limbo-warning/5 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text side */}
          <div className="flex-1 text-center lg:text-left max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 text-primary text-xs font-semibold px-3.5 py-1.5 rounded-pill mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Windows · Free · No account needed
            </div>

            <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-[#111] leading-[1.05] mb-5">
              Your downloads,{' '}
              <span className="gradient-text">on a leash.</span>
            </h1>

            <p className="text-lg text-limbo-text leading-relaxed mb-8 max-w-lg lg:max-w-none">
              Limbo sits quietly in your tray and intercepts every file you download —
              holding it temporarily so you can act on it, then deleting it automatically
              when the timer runs out.{' '}
              <span className="text-[#111] font-medium">No more digital clutter. Ever.</span>
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3">
              <a
                href="#download"
                className="gradient-btn w-full sm:w-auto flex items-center justify-center gap-2.5 text-white font-semibold px-7 py-3.5 rounded-pill shadow-primary text-[15px]"
              >
                <Download size={16} />
                Download for Windows
              </a>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-limbo-text hover:text-[#111] font-medium px-6 py-3.5 rounded-pill border border-limbo-border hover:border-limbo-border/80 bg-white hover:bg-limbo-muted transition-all duration-200 text-[15px]"
              >
                See how it works
                <ArrowDown size={14} />
              </a>
            </div>

            {/* Social proof / stats */}
            <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
              <Stat value="5 min" label="default expiry" />
              <div className="w-px h-8 bg-limbo-border" />
              <Stat value="0 clicks" label="to get started" />
              <div className="w-px h-8 bg-limbo-border" />
              <Stat value="100%" label="private & local" />
            </div>
          </div>

          {/* App mockup */}
          <div className="flex-shrink-0 w-full max-w-[340px] lg:max-w-[380px] animate-float">
            <AppMockup />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a href="#how-it-works" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-limbo-text/60 hover:text-limbo-text transition-colors duration-200">
        <span className="text-[11px] font-medium tracking-widest uppercase">Scroll</span>
        <ArrowDown size={14} className="animate-bounce" />
      </a>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center lg:text-left">
      <div className="text-lg font-black text-[#111] tracking-tight">{value}</div>
      <div className="text-[11px] text-limbo-text font-medium">{label}</div>
    </div>
  )
}
