import { Download as DownloadIcon, CheckCircle } from 'lucide-react'

const CHECKS = [
  'Windows 10 / 11',
  'No installation required (portable)',
  'No account or login',
  'No telemetry or tracking',
  'Free, forever',
]

export function Download() {
  return (
    <section id="download" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #7B6CF6 0%, #6C5CE7 50%, #5A4BD1 100%)',
            }}
          />
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 60%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`
          }} />

          {/* Floating shapes */}
          <div className="absolute top-8 right-12 w-32 h-32 rounded-full border border-white/10" />
          <div className="absolute bottom-8 right-32 w-16 h-16 rounded-full border border-white/10" />
          <div className="absolute top-1/2 right-8 w-8 h-8 rounded-full bg-white/5" />

          <div className="relative z-10 px-10 py-16 lg:py-20 flex flex-col lg:flex-row items-center lg:items-start gap-12">
            {/* Left: text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/15 text-white/90 text-xs font-semibold px-3 py-1.5 rounded-pill mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Latest version · Free
              </div>

              <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Ready to stop managing
                your Downloads?
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-md">
                Download Limbo and never think about file cleanup again.
                Drop it in your system tray and walk away.
              </p>

              {/* Main download button */}
              <a
                href="#"
                className="inline-flex items-center gap-3 bg-white text-primary font-bold px-8 py-4 rounded-pill shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-[15px]"
              >
                <DownloadIcon size={18} />
                Download Limbo for Windows
              </a>

              <p className="text-white/40 text-xs mt-4">
                .exe · ~12 MB · Windows 10 or later
              </p>
            </div>

            {/* Right: checklist */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-7 min-w-[240px]">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-5">What's included</p>
              <ul className="space-y-3.5">
                {CHECKS.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white text-[14px] font-medium">
                    <CheckCircle size={16} className="text-green-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
