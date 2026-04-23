# Contributing to Limbo

Thanks for your interest in contributing. Limbo is a focused tool — the goal is to keep it fast, local, and simple. Before writing code, please read this document.

## Before you open a PR

- **For bug fixes** — open an issue first if the bug isn't obvious. Describe what happens vs. what's expected, and how to reproduce it.
- **For new features** — open an issue to discuss the idea before building it. Features that add complexity without clear user value will likely be declined.
- **For the website** — typos, copy improvements, and visual fixes are always welcome without an issue.

## Getting set up

### App (`electron-app/`)

```bash
cd electron-app
npm install
npm run dev
```

Requires **Windows** and **Node.js 18+**. The app will not run on macOS or Linux — the clipboard service and system tray behavior are Windows-specific.

### Website (`website/`)

```bash
cd website
npm install
npm run dev
```

Runs anywhere Node.js is available.

## Project layout

```
electron-app/
├── electron/
│   ├── main.ts               # App lifecycle, tray, window, protocol
│   ├── preload.ts            # Context bridge (IPC surface for renderer)
│   ├── ipc/
│   │   ├── file-handlers.ts  # File operation IPC handlers
│   │   └── settings-handlers.ts
│   ├── services/
│   │   ├── clipboard-service.ts   # PowerShell clipboard integration
│   │   ├── expiry-manager.ts      # Per-second expiry tick
│   │   ├── limbo-store.ts         # File registry (JSON persistence)
│   │   ├── notification-service.ts
│   │   ├── settings-service.ts    # electron-store settings
│   │   └── watcher.ts             # chokidar folder watcher
│   └── utils/
│       └── path-utils.ts
└── src/
    ├── components/
    │   ├── files/      # FileCard, FileGrid, FileList, CountdownRing, etc.
    │   ├── layout/     # TitleBar, NavBar
    │   └── ui/         # Button, Toggle, Toast
    ├── lib/
    │   ├── format.ts   # formatSize, formatDuration, formatDurationLong
    │   └── ipc.ts      # Type-safe window.electronAPI wrapper
    ├── pages/
    │   ├── LimboView.tsx
    │   └── SettingsView.tsx
    └── store/
        ├── limbo-store.ts  # Zustand store
        └── types.ts        # Shared interfaces
```

## Code style

- **TypeScript** everywhere — no `any` unless absolutely necessary
- **No comments** explaining what code does — code should be self-explanatory; comments are only for non-obvious *why*
- **No new dependencies** without discussion — the current dependency count is intentionally small
- **No abstractions for one use case** — duplication is preferred over premature generalization
- Match the existing Tailwind class patterns; avoid arbitrary values unless the design system doesn't cover it

## IPC conventions

Every new renderer → main communication needs three things:

1. A handler registered in `electron/ipc/file-handlers.ts` or `settings-handlers.ts`
2. A binding in `electron/preload.ts` inside `contextBridge.exposeInMainWorld`
3. A typed declaration in `src/lib/ipc.ts`

Never access `ipcRenderer` directly from a component — always go through the `api` export from `src/lib/ipc.ts`.

## Settings

New settings require changes in four places:

1. `electron/services/settings-service.ts` — interface + default value
2. `src/store/types.ts` — frontend `Settings` interface
3. `src/pages/SettingsView.tsx` — UI control
4. Wherever the setting is consumed (watcher, main process, renderer)

## Submitting a pull request

1. Fork the repo and create a branch: `git checkout -b fix/your-bug-name`
2. Make your changes in the appropriate subfolder (`electron-app/` or `website/`)
3. Run `npm run build` in the changed subfolder and confirm it builds clean
4. Open a PR with a clear title and a description of *why* the change is needed, not just what it does
5. Link any related issue

## What won't be merged

- macOS / Linux support — the app is intentionally Windows-only for now
- Cloud sync, accounts, or any network features
- Features that require new native modules without strong justification
- UI changes that break the compact tray-window form factor (420×580px)
- Breaking changes to the IPC surface without a migration path
