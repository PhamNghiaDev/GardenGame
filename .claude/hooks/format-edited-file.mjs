import { readFile, realpath, writeFile } from 'node:fs/promises'
import { isAbsolute, join, relative, resolve, sep } from 'node:path'
import { stdin } from 'node:process'
import { fileURLToPath } from 'node:url'
import * as prettier from 'prettier'

async function formatEditedFile() {
  stdin.setEncoding('utf8')
  let input = ''
  for await (const chunk of stdin) input += chunk

  const event = JSON.parse(input)
  const filePath = event.tool_input?.file_path
  if (typeof filePath !== 'string' || filePath.length === 0) return

  const root = await realpath(fileURLToPath(new URL('../../', import.meta.url)))
  const file = await realpath(resolve(event.cwd ?? root, filePath))
  const fromRoot = relative(root, file)
  if (
    !fromRoot ||
    isAbsolute(fromRoot) ||
    fromRoot === '..' ||
    fromRoot.startsWith(`..${sep}`)
  )
    return

  const info = await prettier.getFileInfo(file, {
    ignorePath: [join(root, '.gitignore'), join(root, '.prettierignore')],
  })
  if (info.ignored || info.inferredParser === null) return

  const source = await readFile(file, 'utf8')
  const options = await prettier.resolveConfig(file, { editorconfig: true })
  const formatted = await prettier.format(source, {
    ...options,
    filepath: file,
  })
  if (formatted !== source) await writeFile(file, formatted, 'utf8')
}

try {
  await formatEditedFile()
} catch (error) {
  console.error('Prettier hook gặp lỗi.', error)
  process.exitCode = 1
}
