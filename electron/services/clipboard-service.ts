import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function copyFileToClipboard(filePath: string): Promise<void> {
  const escaped = filePath.replace(/'/g, "''")
  const script = [
    "Add-Type -AssemblyName System.Windows.Forms;",
    "$files = New-Object System.Collections.Specialized.StringCollection;",
    `$files.Add('${escaped}');`,
    "[System.Windows.Forms.Clipboard]::SetFileDropList($files);",
  ].join(' ')
  await execAsync(`powershell -NonInteractive -Command "${script}"`)
}
