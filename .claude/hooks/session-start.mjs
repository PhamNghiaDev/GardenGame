import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))

function readCurrentWork() {
  try {
    const markdown = readFileSync(
      new URL('../../docs/PROGRESS.md', import.meta.url),
      'utf8',
    )
    const lines = markdown.split(/\r?\n/)
    const heading = lines.findIndex((line) => /^##\s+Đang làm\s*$/.test(line))
    if (heading === -1) return 'Chưa có mục Đang làm trong docs/PROGRESS.md.'

    const end = lines.findIndex(
      (line, index) => index > heading && /^#{1,2}\s/.test(line),
    )
    return (
      lines
        .slice(heading + 1, end === -1 ? undefined : end)
        .join('\n')
        .trim() || 'Chưa có mục đang làm.'
    )
  } catch {
    return 'Chưa đọc được docs/PROGRESS.md.'
  }
}

const git = spawnSync('git', ['status', '--short', '--branch'], {
  cwd: root,
  encoding: 'utf8',
  timeout: 5_000,
  windowsHide: true,
})

console.log(
  `## Đang làm\n${readCurrentWork()}\n\n## Git status\n${git.status === 0 ? git.stdout.trim() : 'Chưa đọc được git status.'}`,
)
