import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function copyFileToClipboard(filePath: string): Promise<void> {
  const script = [
    'Add-Type -AssemblyName System.Windows.Forms;',
    '$files = New-Object System.Collections.Specialized.StringCollection;',
    `$files.Add(${JSON.stringify(filePath)});`,
    '[System.Windows.Forms.Clipboard]::SetFileDropList($files);',
  ].join(' ')
  // Use EncodedCommand (UTF-16LE base64) to avoid any shell escaping issues
  const encoded = Buffer.from(script, 'utf16le').toString('base64')
  await execAsync(`powershell -NonInteractive -EncodedCommand ${encoded}`)
}
