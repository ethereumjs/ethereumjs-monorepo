import { readdirSync } from 'fs'
import { extname, join } from 'path'

const pkg = process.argv[3]
if (!pkg) {
  throw new Error('Package argument must be passed')
}

const examplesPath = `../packages/${pkg}/examples/`
const path = join(__dirname, examplesPath)

const getTsFiles = (fileName: string): Promise<NodeModule> | undefined => {
  if (extname(fileName) === '.cts' || extname(fileName) === '.ts') {
    return import(examplesPath + fileName)
  }
}

const main = async () => {
  const files = readdirSync(path)
  const importedFiles = files.map(getTsFiles).filter((file) => file)
  await Promise.all(importedFiles)
}

main()
