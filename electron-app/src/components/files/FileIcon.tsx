import {
  FileText, FileImage, FileVideo, FileAudio, FileCode,
  FileArchive, FileSpreadsheet, File, FileType,
} from 'lucide-react'

const mimeMap: { match: RegExp; icon: typeof File; color: string }[] = [
  { match: /^image\//, icon: FileImage, color: '#6C5CE7' },
  { match: /^video\//, icon: FileVideo, color: '#E17055' },
  { match: /^audio\//, icon: FileAudio, color: '#00CEC9' },
  { match: /pdf/, icon: FileType, color: '#FF6B6B' },
  { match: /spreadsheet|excel|csv/, icon: FileSpreadsheet, color: '#00B894' },
  { match: /zip|rar|tar|gz|7z|archive/, icon: FileArchive, color: '#FDCB6E' },
  { match: /javascript|typescript|json|html|css|python|java|c\+\+|ruby|go/, icon: FileCode, color: '#74B9FF' },
  { match: /text|word|document|msword/, icon: FileText, color: '#A29BFE' },
]

interface FileIconProps {
  mimeType: string
  size?: number
}

export function FileIcon({ mimeType, size = 20 }: FileIconProps) {
  const match = mimeMap.find((m) => m.match.test(mimeType))
  const Icon = match?.icon ?? File
  const color = match?.color ?? '#9CA3AF'

  return (
    <div
      className="flex items-center justify-center rounded-lg shrink-0"
      style={{
        width: size + 16,
        height: size + 16,
        background: `${color}18`,
      }}
    >
      <Icon size={size} style={{ color }} />
    </div>
  )
}
