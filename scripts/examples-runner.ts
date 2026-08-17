import { readdirSync } from 'fs'
import { extname, join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const pkg = process.argv[3]
if (!pkg) {
  throw new Error('Package argument must be passed')
}
const subDir = process.argv[4] ?? ''

const examplesPath = `../packages/${pkg}/examples/${subDir}/`
const path = join(__dirname, examplesPath)

const getExample = (fileName: string): Promise<NodeModule> | undefined => {
  if (extname(fileName) === '.cts' || extname(fileName) === '.ts') {
    return import(examplesPath + fileName)
  }
}

const main = async () => {
  const files = readdirSync(path)
  for (const file of files) {
    const runner = getExample(file)
    if (runner !== undefined) {
      console.log(` ---- Run example: ${file} ----`)
      await runner
    }
  }
}

main()
