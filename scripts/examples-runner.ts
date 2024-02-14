import { extname, join } from 'path'
import { readdir } from 'fs'

const pkg = process.argv[3]
if (!pkg) {
  throw new Error('Package argument must be passed')
}

const examplesPath = `../packages/${pkg}/examples/`
const path = join(__dirname, examplesPath)

readdir(path, async (err, files) => {
  if (err) {
    throw new Error('Error loading examples directory: ' + err.message)
  }

  const getTsFiles = (fileName: string): Promise<NodeModule> | undefined => {
    if (extname(fileName) === '.cts' || extname(fileName) === '.ts') {
      return import(examplesPath + fileName)
    }
  }

  const importedFiles = files.map(getTsFiles).filter((file) => file)
  await Promise.all(importedFiles)
})
