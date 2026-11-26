import { spawnSync } from 'node:child_process'
import { readFile, realpath, stat } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'
import { stdin } from 'node:process'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)

async function formatEditedFile() {
  stdin.setEncoding('utf8')
  let input = ''
  for await (const chunk of stdin) input += chunk

  const event = JSON.parse(input)
  const filePath = event.tool_input?.file_path
  if (typeof filePath !== 'string' || !filePath) return

  const root = await realpath(fileURLToPath(new URL('../../', import.meta.url)))
  const file = await realpath(resolve(event.cwd ?? root, filePath))
  const path = relative(root, file)
  if (!path || isAbsolute(path) || path === '..' || path.startsWith(`..${sep}`))
    return
  if (!(await stat(file)).isFile()) return

  const manifestPath = require.resolve('prettier/package.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  const prettier = resolve(dirname(manifestPath), manifest.bin)

  spawnSync(
    process.execPath,
    [
      prettier,
      '--write',
      '--ignore-unknown',
      '--ignore-path',
      '.gitignore',
      '--ignore-path',
      '.prettierignore',
      '--',
      file,
    ],
    { cwd: root, timeout: 10_000, windowsHide: true, stdio: 'ignore' },
  )
}

try {
  await formatEditedFile()
} catch {
  // A missing file, dependency or invalid hook input never blocks an edit.
}
