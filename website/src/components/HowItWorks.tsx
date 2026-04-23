import { Eye, Timer, Sparkles } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Eye,
    title: "Limbo watches your folders",
    description:
      "The moment a file lands in your Downloads folder (or anywhere you choose), Limbo intercepts it — before you even look away from your browser.",
    detail: "Zero config. It just works.",
    color: "#6C5CE7",
    bg: "#EDE9FF",
  },
  {
    number: "02",
    icon: Timer,
    title: "A countdown begins",
    description:
      "Every intercepted file gets a timer — 5 minutes by default. It appears in the Limbo tray window alongside a one-click action bar: save, copy, open, or just let it go.",
    detail: "You stay in control.",
    color: "#F59E0B",
    bg: "#FFF8E6",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Gone when you're done",
    description:
      'When the timer hits zero, Limbo deletes the file automatically. No manual cleanup. No "Downloads" folder with 1,400 files. Just clean.',
    detail: "Like it never happened.",
    color: "#22C55E",
    bg: "#E8FFF5",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-3">
            How it works
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-[#111] tracking-tight mb-4">
            Three steps to a{" "}
            <span className="gradient-text">cleaner machine</span>
          </h2>
          <p className="text-lg text-limbo-text max-w-xl mx-auto leading-relaxed">
            Limbo runs silently in the background. You only notice it when you
            need it.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-[calc(16.666%-1px)] right-[calc(16.666%-1px)] h-px bg-gradient-to-r from-transparent via-limbo-border to-transparent" />

          <div className="grid lg:grid-cols-3 gap-10">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center lg:items-start text-center lg:text-left group"
                >
                  {/* Icon circle */}
                  <div className="relative mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1 transition-transform duration-300 group-hover:-translate-y-1"
                      style={{ background: step.bg, color: step.color }}
                    >
                      <Icon size={22} />
                    </div>
                    {/* Step number badge */}
                  </div>

                  <h3 className="text-xl font-bold text-[#111] mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-limbo-text leading-relaxed mb-3 text-[15px]">
                    {step.description}
                  </p>
                  <span
                    className="inline-block text-sm font-semibold px-3 py-1 rounded-pill"
                    style={{ background: step.bg, color: step.color }}
                  >
                    {step.detail}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
