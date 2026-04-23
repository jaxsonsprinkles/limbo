/* Pixel-faithful recreation of the Limbo app window for the hero */

import { X, Minus, Pin, Copy, Save, Trash2, FolderOpen } from "lucide-react";

const FILES = [
  {
    name: "Project_Brief",
    ext: ".pdf",
    size: "2.4 MB",
    secondsLeft: 180,
    totalSeconds: 300,
    color: "#FF6B6B",
    bgColor: "#FFF1F1",
  },
  {
    name: "design_mockup",
    ext: ".fig",
    size: "8.1 MB",
    secondsLeft: 240,
    totalSeconds: 300,
    color: "#6C5CE7",
    bgColor: "#EDE9FF",
  },
  {
    name: "onboarding_v3",
    ext: ".mp4",
    size: "42 MB",
    secondsLeft: 60,
    totalSeconds: 300,
    color: "#E17055",
    bgColor: "#FFF3EE",
  },
  {
    name: "spreadsheet_q4",
    ext: ".xlsx",
    size: "512 KB",
    secondsLeft: 300,
    totalSeconds: 300,
    color: "#00B894",
    bgColor: "#E8FFF5",
    pinned: true,
  },
];

function CountdownRing({ pct, color }: { pct: number; color: string }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <svg width="36" height="36" className="-rotate-90">
      <circle
        cx={18}
        cy={18}
        r={r}
        fill="none"
        stroke="#E5E5E5"
        strokeWidth={2.5}
      />
      <circle
        cx={18}
        cy={18}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

function FileCard({
  file,
  hovered,
}: {
  file: (typeof FILES)[0];
  hovered?: boolean;
}) {
  const pct = file.secondsLeft / file.totalSeconds;
  const ringColor = pct > 0.5 ? "#6C5CE7" : pct > 0.2 ? "#F59E0B" : "#FF6B6B";
  const mins = Math.floor(file.secondsLeft / 60);
  const secs = file.secondsLeft % 60;

  return (
    <div
      className="bg-white rounded-xl border border-limbo-border/60 p-3 transition-all duration-200"
      style={
        hovered
          ? {
              boxShadow:
                "0 8px 32px rgba(108,92,231,0.12), 0 2px 8px rgba(0,0,0,0.06)",
              transform: "translateY(-2px)",
            }
          : { boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }
      }
    >
      {file.pinned && (
        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
      )}

      <div className="flex items-start gap-2.5 relative">
        {/* File icon */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: file.bgColor }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 2h7l3 3v9H3V2z"
              fill={file.color}
              fillOpacity="0.25"
              stroke={file.color}
              strokeWidth="0.8"
            />
            <path
              d="M10 2v3h3"
              fill="none"
              stroke={file.color}
              strokeWidth="0.8"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-[#111] truncate leading-tight">
            {file.name}
            <span className="text-limbo-text font-normal">{file.ext}</span>
          </p>
          <p className="text-[10px] text-limbo-text mt-0.5 tabular-nums">
            {file.size}
          </p>
        </div>

        {!file.pinned && <CountdownRing pct={pct} color={ringColor} />}
      </div>

      {!file.pinned && (
        <p className="text-[10px] text-limbo-text mt-1.5 tabular-nums">
          {mins}m {secs}s left
        </p>
      )}

      {hovered && (
        <div className="flex items-center gap-0.5 mt-2">
          {[Pin, Copy, Save, FolderOpen, Trash2].map((Icon, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-md flex items-center justify-center text-limbo-text/70 bg-limbo-muted"
            >
              <Icon size={11} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AppMockup() {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden select-none"
      style={{
        background: "#F5F3EF",
        boxShadow:
          "0 32px 80px rgba(108,92,231,0.2), 0 8px 24px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.6)",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 h-11 border-b border-limbo-border/40"
        style={{ background: "#F5F3EF", cursor: "default" }}
      >
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Limbo"
            className="w-6 h-6 rounded-lg shadow-primary shrink-0"
          />
          <span className="text-xs font-bold text-[#111]">Limbo</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-limbo-text/50 hover:bg-limbo-muted">
            <Minus size={11} />
          </div>
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-limbo-text/50 hover:bg-limbo-danger/10 hover:text-limbo-danger">
            <X size={11} />
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-limbo-border/30">
        {["Limbo", "Settings"].map((tab, i) => (
          <div
            key={tab}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${i === 0 ? "text-white shadow-sm" : "text-limbo-text"}`}
            style={
              i === 0
                ? {
                    background: "linear-gradient(135deg, #7B6CF6, #6C5CE7)",
                    boxShadow: "0 2px 8px rgba(108,92,231,0.3)",
                  }
                : {}
            }
          >
            {tab}
            {i === 0 && (
              <span className="bg-white/25 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                4
              </span>
            )}
          </div>
        ))}
      </div>

      {/* File grid */}
      <div className="p-3 grid grid-cols-2 gap-2 relative">
        {FILES.map((file, i) => (
          <div key={file.name} className="relative">
            <FileCard file={file} hovered={i === 0} />
          </div>
        ))}
      </div>

      {/* Subtle bottom gradient to fade out */}
      <div
        className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, #F5F3EF, transparent)" }}
      />
    </div>
  );
}
