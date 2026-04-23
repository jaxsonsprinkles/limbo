export function Problem() {
  const BEFORE = [
    'resume_FINAL.pdf', 'resume_FINAL_v2.pdf', 'resume_FINAL_v2_USE_THIS.pdf',
    'Screen Shot 2024-09-12.png', 'Screen Shot 2024-09-12 (1).png',
    'invoice_sept.pdf', 'invoice_sept (1).pdf',
    'Untitled (3).zip', 'setup.exe', 'setup (1).exe',
    'image.png', 'image (1).png', 'image (2).png',
    'download.crdownload', 'archive.tar.gz',
  ]

  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual: messy Downloads */}
          <div className="relative">
            <div className="bg-white rounded-2xl border border-limbo-border p-5 shadow-card overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-limbo-border/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-limbo-muted rounded-md px-3 py-1 text-[11px] text-limbo-text font-mono">
                    📁 Downloads — 1,247 items
                  </div>
                </div>
              </div>

              {/* Files list */}
              <div className="space-y-1.5 max-h-72 overflow-hidden relative">
                {BEFORE.map((name, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-1 px-2 rounded-lg hover:bg-limbo-muted">
                    <div className="w-6 h-6 flex items-center justify-center text-base">
                      {name.endsWith('.pdf') ? '📄' :
                       name.endsWith('.png') || name.endsWith('.jpg') ? '🖼️' :
                       name.endsWith('.zip') || name.endsWith('.gz') ? '🗜️' :
                       name.endsWith('.exe') ? '⚙️' :
                       name.endsWith('.crdownload') ? '⏳' : '📎'}
                    </div>
                    <span className="text-xs text-[#111] truncate font-mono">{name}</span>
                    <span className="ml-auto text-[10px] text-limbo-text/50 shrink-0">
                      {new Date(Date.now() - Math.random() * 1e10).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {/* Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>

              <div className="mt-3 text-center">
                <span className="text-[11px] text-limbo-text/60 font-mono">... and 1,232 more files</span>
              </div>
            </div>

            {/* Pain label */}
            <div className="absolute -top-3 -right-3 bg-limbo-danger text-white text-xs font-bold px-3 py-1.5 rounded-pill shadow-md rotate-3">
              😩 Sound familiar?
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-4">The problem</p>
            <h2 className="text-4xl font-black text-[#111] tracking-tight leading-tight mb-6">
              Your Downloads folder
              is a{' '}
              <span className="relative inline-block">
                <span className="relative z-10">graveyard.</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-limbo-danger/15 -rotate-1 rounded" />
              </span>
            </h2>
            <div className="space-y-4 text-[15px] text-limbo-text leading-relaxed">
              <p>
                Every file you've ever downloaded is sitting in there — the invoices, the
                screenshots, the <span className="font-mono text-[13px]">setup (3).exe</span> you ran
                once and never needed again.
              </p>
              <p>
                You mean to clean it up. You never do. Months later you have 4,000 files
                and no idea which ones matter.
              </p>
              <p className="text-[#111] font-medium">
                Limbo doesn't make you clean up. It makes cleanup happen automatically —
                the moment you're done with a file.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
