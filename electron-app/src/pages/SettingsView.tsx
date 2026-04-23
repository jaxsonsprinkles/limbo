import { useEffect, useState, useRef } from 'react'
import { Plus, Trash2, FolderOpen, Clock, Filter, Bell, X } from 'lucide-react'
import type { Settings } from '../store/types'
import { api } from '../lib/ipc'
import { Button } from '../components/ui/Button'
import { Toggle } from '../components/ui/Toggle'

const EXPIRY_OPTIONS = [
  { label: '5 min', secs: 300 },
  { label: '10 min', secs: 600 },
  { label: '30 min', secs: 1800 },
  { label: '1 hour', secs: 3600 },
  { label: '4 hours', secs: 14400 },
  { label: '24 hours', secs: 86400 },
]

export function SettingsView() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [saving, setSaving] = useState(false)
  const [extInput, setExtInput] = useState('')
  const extInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    api.settings.get().then(setSettings)
  }, [])

  async function update(partial: Partial<Settings>) {
    if (!settings) return
    const next = { ...settings, ...partial }
    setSettings(next)
    setSaving(true)
    await api.settings.set(partial)
    setSaving(false)
  }

  async function addFolder() {
    const folder = await api.settings.pickFolder()
    if (!folder || !settings) return
    if (settings.watchedFolders.includes(folder)) return
    await update({ watchedFolders: [...settings.watchedFolders, folder] })
  }

  async function removeFolder(folder: string) {
    if (!settings) return
    await update({ watchedFolders: settings.watchedFolders.filter((f) => f !== folder) })
  }

  function addExtension(raw: string) {
    if (!settings) return
    const ext = raw.replace(/^\./, '').toLowerCase().trim()
    if (!ext) return
    const extensions = settings.fileTypeFilter.extensions
    if (extensions.includes(ext)) return
    update({ fileTypeFilter: { ...settings.fileTypeFilter, extensions: [...extensions, ext] } })
    setExtInput('')
  }

  function removeExtension(ext: string) {
    if (!settings) return
    update({
      fileTypeFilter: {
        ...settings.fileTypeFilter,
        extensions: settings.fileTypeFilter.extensions.filter((e) => e !== ext),
      },
    })
  }

  function handleExtKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addExtension(extInput)
    }
  }

  if (!settings) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  const showExtensions = settings.fileTypeFilter.mode !== 'all'

  return (
    <div className="flex-1 overflow-y-auto px-3 pb-4">
      <div className="space-y-3">

        {/* Watched Folders */}
        <Section icon={FolderOpen} title="Watched Folders">
          <div className="space-y-1.5">
            {settings.watchedFolders.map((folder) => (
              <div key={folder} className="flex items-center gap-2 bg-limbo-muted rounded-lg px-3 py-2">
                <span className="flex-1 text-xs text-[#111] truncate font-mono">{folder}</span>
                <button
                  onClick={() => removeFolder(folder)}
                  className="w-6 h-6 flex items-center justify-center text-limbo-text hover:text-limbo-danger rounded-md transition-colors duration-150 active:scale-[0.96] shrink-0"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={addFolder} className="mt-2 w-full">
            <Plus size={13} />
            Add folder
          </Button>
        </Section>

        {/* Expiry */}
        <Section icon={Clock} title="Default Expiry">
          <div className="grid grid-cols-3 gap-1.5">
            {EXPIRY_OPTIONS.map(({ label, secs }) => {
              const active = settings.defaultExpirySecs === secs
              return (
                <button
                  key={secs}
                  onClick={() => update({ defaultExpirySecs: secs })}
                  className={[
                    'py-2 px-3 rounded-pill text-xs font-semibold transition-[transform,box-shadow,filter] duration-200 active:scale-[0.99] active:brightness-[0.96] whitespace-nowrap',
                    active
                      ? '[background:linear-gradient(135deg,#7B6CF6,#6C5CE7)_padding-box,linear-gradient(135deg,#9B8CFF,#7B6CF6)_border-box] border-2 border-transparent text-white shadow-[0_4px_12px_rgba(108,92,231,0.25)] hover:brightness-[1.06]'
                      : 'bg-white border border-[#E5E5E5] text-[#111] hover:bg-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.06)]',
                  ].join(' ')}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </Section>

        {/* File Filters */}
        <Section icon={Filter} title="File Filter">
          <div className="space-y-2">
            {(['all', 'include', 'exclude'] as const).map((mode) => (
              <label key={mode} className="flex items-center gap-2.5 cursor-pointer">
                <div
                  onClick={() => update({ fileTypeFilter: { ...settings.fileTypeFilter, mode } })}
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-150 ${settings.fileTypeFilter.mode === mode ? 'border-primary' : 'border-limbo-border'}`}
                >
                  {settings.fileTypeFilter.mode === mode && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </div>
                <span className="text-xs text-[#111] capitalize">
                  {mode === 'all' ? 'Intercept all files' : mode === 'include' ? 'Only listed types' : 'Exclude listed types'}
                </span>
              </label>
            ))}
          </div>

          {/* Extension tag editor */}
          {showExtensions && (
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-1">
                {settings.fileTypeFilter.extensions.map((ext) => (
                  <span key={ext} className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-mono px-2 py-0.5 rounded-full">
                    .{ext}
                    <button onClick={() => removeExtension(ext)} className="hover:text-limbo-danger transition-colors">
                      <X size={9} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  ref={extInputRef}
                  type="text"
                  value={extInput}
                  onChange={(e) => setExtInput(e.target.value)}
                  onKeyDown={handleExtKeyDown}
                  placeholder="Add extension (e.g. pdf)"
                  className="flex-1 bg-limbo-muted rounded-lg px-2.5 py-1.5 text-xs text-[#111] placeholder:text-limbo-text outline-none border border-transparent focus:border-primary/40 transition-colors"
                />
                <button
                  onClick={() => addExtension(extInput)}
                  className="px-2.5 py-1.5 bg-primary/10 text-primary rounded-lg text-xs hover:bg-primary/20 transition-colors"
                >
                  <Plus size={11} />
                </button>
              </div>
            </div>
          )}
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Notifications">
          <div className="space-y-3">
            <Toggle
              checked={settings.autoClipboard}
              onChange={(v) => update({ autoClipboard: v })}
              label="Copy to clipboard on arrival"
            />
            <Toggle
              checked={settings.showNotifications}
              onChange={(v) => update({ showNotifications: v })}
              label="Show system notifications"
            />
            <Toggle
              checked={settings.soundEnabled}
              onChange={(v) => update({ soundEnabled: v })}
              label="Play sound on file arrival"
            />
            <Toggle
              checked={settings.autoLaunch}
              onChange={(v) => update({ autoLaunch: v })}
              label="Launch at startup"
            />
          </div>
        </Section>

      </div>

      {saving && (
        <p className="text-center text-[10px] text-limbo-text mt-3">Saving…</p>
      )}
    </div>
  )
}

function Section({ icon: Icon, title, children }: { icon: typeof Clock; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-limbo-border/60 p-3 shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={13} className="text-primary" />
        <span className="text-xs font-semibold text-[#111]">{title}</span>
      </div>
      {children}
    </div>
  )
}
