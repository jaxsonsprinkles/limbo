# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

**Limbo** is a Windows and macOS Electron desktop app that sits in the system tray and watches a folder (Downloads by default). New files are intercepted and given a countdown timer; they auto-delete when the timer expires unless the user saves or pins them. No cloud, no accounts, no network — 100% local.

## Commands

### Electron App (the main product)

```bash
cd electron-app
npm install
npm run dev            # Vite dev server + Electron with hot reload
npm run build          # Windows build: tsc + vite build + electron-builder → release/
npm run build:mac      # macOS build (must run on a Mac)
npm run build:renderer # Build just the React UI
npm run build:electron # Compile just the Electron main process
```

### Website (marketing site)

```bash
cd website
npm install
npm run dev            # Dev server
npm run build          # tsc + vite build
npm run preview        # Preview production build
```

### Type Checking

There is no separate lint command. TypeScript strict mode enforces correctness at compile time. Run `npx tsc --noEmit` in either directory to type-check without building.

No test framework is configured.

## Architecture

### Two Separate Projects

- `electron-app/` — the Windows desktop app (ships as an NSIS installer)
- `website/` — the marketing/landing site (standalone Vite/React)

Both use React 18 + TypeScript 5 + Vite 5 + Tailwind CSS 3.

### Electron App Layers

**Main process** (`electron/`):
- `main.ts` — app lifecycle, system tray icon, window positioning, single-instance lock
- `preload.ts` — context bridge; the only way the renderer talks to the main process
- `ipc/` — IPC handler registration (`file-handlers.ts`, `settings-handlers.ts`)
- `services/` — business logic running in the main process:
  - `watcher.ts` (Chokidar file watcher)
  - `expiry-manager.ts` (per-second tick loop for countdowns)
  - `limbo-store.ts` (JSON file registry persisted to disk)
  - `clipboard-service.ts` (clipboard: PowerShell on Windows, osascript on macOS)
  - `notification-service.ts`, `settings-service.ts` (electron-store)

**Renderer** (`src/`):
- `lib/ipc.ts` — typed wrappers around `window.electronAPI` calls; all IPC goes through here
- `store/limbo-store.ts` — Zustand store for UI state
- `pages/LimboView.tsx` — main file list (grid/list toggle, countdown rings, search)
- `pages/SettingsView.tsx` — user preferences
- `components/files/CountdownRing.tsx` — SVG ring animation driven by expiry time

### Data Flow

1. Chokidar detects a new file → main process records it in `limbo-store.ts` (JSON)
2. `expiry-manager.ts` ticks every second → pushes updated file state to renderer via IPC
3. Renderer Zustand store updates → countdown rings re-render
4. User action (save/delete/extend/pin) → IPC call to `file-handlers.ts` → updates JSON store

### Key Constraints

- Windows and macOS: clipboard uses PowerShell on Windows, osascript on macOS; tray window appears above taskbar on Windows and below menu bar on macOS
- Compact window: 420×580px tray popup, no resize
- No external network calls anywhere in the codebase
- Minimal dependencies — add new packages only when genuinely necessary
- TypeScript strict mode: `strict: true`, `noUnusedLocals`, `noUnusedParameters`

## Code Style

- No comments unless explaining *why* something works a specific way (not what it does)
- No premature abstractions — three similar lines beats a helper used twice
- No error handling for impossible cases; trust internal guarantees
- IPC channel names are string literals shared between main and renderer via `src/lib/ipc.ts` — keep them in sync
