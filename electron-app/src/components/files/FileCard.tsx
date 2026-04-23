import { useState } from "react";
import {
  Pin,
  PinOff,
  Copy,
  Save,
  Trash2,
  FolderOpen,
  ClockPlus,
} from "lucide-react";
import type { LimboFile } from "../../store/types";
import { FileIcon } from "./FileIcon";
import { CountdownRing } from "./CountdownRing";
import {
  formatSize,
  formatDuration,
  formatDurationLong,
} from "../../lib/format";
import { api } from "../../lib/ipc";

const LONG_EXPIRY_THRESHOLD = 1800; // 30 minutes

interface FileCardProps {
  file: LimboFile;
  secondsRemaining: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, partial: Partial<LimboFile>) => void;
  onToast: (
    msg: string,
    type: "success" | "error" | "info",
    action?: { label: string; onClick: () => void },
    duration?: number,
  ) => void;
  selected?: boolean;
  onSelectToggle?: (id: string) => void;
}

export function FileCard({
  file,
  secondsRemaining,
  onRemove,
  onUpdate,
  onToast,
  selected,
  onSelectToggle,
}: FileCardProps) {
  const [hovered, setHovered] = useState(false);
  const totalSeconds = Math.round((file.expiresAt - file.addedAt) / 1000);
  const nameWithoutExt = file.filename.replace(/\.[^.]+$/, "");
  const ext = file.filename.match(/\.[^.]+$/)?.[0] ?? "";
  const isImage = file.mimeType.startsWith("image/");
  const isLongExpiry =
    !file.isPinned && secondsRemaining > LONG_EXPIRY_THRESHOLD;

  async function handlePin() {
    const res = await api.files.pinToggle(file.id);
    if (res.ok) onUpdate(file.id, { isPinned: res.isPinned });
  }

  async function handleCopy() {
    const res = await api.files.copyToClipboard(file.id);
    if (res.ok) onToast("Copied to clipboard", "success");
    else onToast("Failed to copy", "error");
  }

  async function handleSave() {
    const res = await api.files.savePermanently(file.id);
    if (res.cancelled) return;
    if (res.ok) {
      onRemove(file.id);
      onToast("File saved", "success");
    } else onToast("Failed to save", "error");
  }

  function handleDelete() {
    // Optimistic remove with 5s undo window
    onRemove(file.id);
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) api.files.delete(file.id);
    }, 5000);
    onToast(
      "File deleted",
      "info",
      {
        label: "Undo",
        onClick: () => {
          cancelled = true;
          clearTimeout(timer);
          onUpdate(file.id, {}); // re-add by forcing a re-fetch isn't trivial; instead we re-insert
          // Since the file is gone from the store, we restore it via onUpdate trick:
          // We need to add it back — signal via a special path
          window.dispatchEvent(
            new CustomEvent("limbo:undo-delete", { detail: file }),
          );
        },
      },
      5000,
    );
  }

  async function handleOpen() {
    await api.files.openInExplorer(file.id);
  }

  function handleDragStart() {
    api.files.startDrag(file.id);
  }

  async function handleExtendExpiry(extraMs: number) {
    const newExpiry = file.expiresAt + extraMs;
    const res = await api.files.updateExpiry(file.id, newExpiry);
    if (res.ok) onUpdate(file.id, { expiresAt: newExpiry });
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelectToggle?.(file.id)}
      className={`group relative bg-white rounded-xl border p-3 cursor-grab active:cursor-grabbing transition-[transform,box-shadow,border-color] duration-200 ease-smooth hover:-translate-y-0.5 hover:shadow-card-hover shadow-card ${selected ? "border-primary/60 ring-1 ring-primary/30" : "border-limbo-border/60"}`}
    >
      {/* Selection indicator */}
      {onSelectToggle && (
        <div
          className={`absolute top-2 left-2 w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all duration-150 ${selected ? "bg-primary border-primary" : "border-limbo-border bg-white"} ${hovered || selected ? "opacity-100" : "opacity-0"}`}
        >
          {selected && (
            <div className="w-1.5 h-1 border-b-2 border-r-2 border-white rotate-45 -mt-0.5" />
          )}
        </div>
      )}

      {/* Pin indicator */}
      {file.isPinned && (
        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
      )}

      {/* Image thumbnail */}
      {isImage && (
        <div className="w-full h-16 rounded-lg overflow-hidden mb-2 bg-limbo-muted">
          <img
            src={`limbo://${file.limboPath}`}
            alt={file.filename}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      <div className="flex items-start gap-3">
        {!isImage && <FileIcon mimeType={file.mimeType} size={18} />}

        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-medium text-[#111] leading-tight truncate"
            title={file.filename}
          >
            {nameWithoutExt}
            <span className="text-limbo-text font-normal">{ext}</span>
          </p>
          <p className="text-[10px] text-limbo-text mt-0.5 tabular-nums">
            {formatSize(file.size)}
          </p>
        </div>

        {!file.isPinned && !isLongExpiry && (
          <div className="shrink-0">
            <CountdownRing
              secondsRemaining={secondsRemaining}
              totalSeconds={totalSeconds}
              size={36}
            />
          </div>
        )}
      </div>

      {!file.isPinned && (
        <p className="text-[10px] text-limbo-text mt-2 tabular-nums">
          {isLongExpiry
            ? `Expires in ${formatDurationLong(secondsRemaining)}`
            : secondsRemaining > 0
              ? `${formatDuration(secondsRemaining)} left`
              : "Expiring…"}
        </p>
      )}

      {/* Actions — fade in on hover */}
      <div
        className={`flex items-center gap-1 mt-2.5 transition-[opacity,transform] duration-150 ease-smooth ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-0.5"}`}
      >
        <ActionButton
          icon={file.isPinned ? PinOff : Pin}
          onClick={handlePin}
          title={file.isPinned ? "Unpin" : "Pin"}
        />
        <ActionButton
          icon={Copy}
          onClick={handleCopy}
          title="Copy to clipboard"
        />
        <ActionButton
          icon={Save}
          onClick={handleSave}
          title="Save permanently"
        />
        <ActionButton
          icon={FolderOpen}
          onClick={handleOpen}
          title="Show in Explorer"
        />
        <ActionButton
          icon={Trash2}
          onClick={handleDelete}
          title="Delete"
          danger
        />
        {!file.isPinned && (
          <>
            <div className="w-px h-4 bg-limbo-border mx-0.5" />
            <ActionButton
              icon={ClockPlus}
              onClick={() => handleExtendExpiry(10 * 60 * 1000)}
              title="+10 min"
            />
            <ActionButton
              icon={ClockPlus}
              onClick={() => handleExtendExpiry(60 * 60 * 1000)}
              title="+1 hour"
            />
          </>
        )}
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  onClick,
  title,
  danger,
}: {
  icon: typeof Pin;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={title}
      className={`flex items-center justify-center w-7 h-7 rounded-lg transition-[background,color,transform] duration-150 active:scale-[0.96] ${danger ? "text-limbo-text hover:text-limbo-danger hover:bg-limbo-danger/10" : "text-limbo-text hover:text-[#111] hover:bg-limbo-muted"}`}
    >
      <Icon size={13} />
    </button>
  );
}
