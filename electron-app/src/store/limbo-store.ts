import { create } from 'zustand'
import type { LimboFile } from './types'

interface Countdown {
  [id: string]: number
}

interface LimboState {
  files: LimboFile[]
  countdowns: Countdown
  view: 'grid' | 'list'
  setFiles: (files: LimboFile[]) => void
  addFile: (file: LimboFile) => void
  removeFile: (id: string) => void
  updateFile: (id: string, partial: Partial<LimboFile>) => void
  setCountdown: (id: string, seconds: number) => void
  setView: (v: 'grid' | 'list') => void
}

export const useLimboStore = create<LimboState>((set) => ({
  files: [],
  countdowns: {},
  view: 'grid',
  setFiles: (files) => set({ files }),
  addFile: (file) => set((s) => ({ files: [file, ...s.files] })),
  removeFile: (id) => set((s) => ({
    files: s.files.filter((f) => f.id !== id),
    countdowns: Object.fromEntries(Object.entries(s.countdowns).filter(([k]) => k !== id)),
  })),
  updateFile: (id, partial) => set((s) => ({
    files: s.files.map((f) => f.id === id ? { ...f, ...partial } : f),
  })),
  setCountdown: (id, seconds) => set((s) => ({
    countdowns: { ...s.countdowns, [id]: seconds },
  })),
  setView: (view) => set({ view }),
}))
