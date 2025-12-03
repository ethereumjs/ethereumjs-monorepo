import fs from 'fs'
import path from 'path'

export type ExecutionSpecFixtureType = 'state_tests' | 'blockchain_tests'

export interface ExecutionSpecFixture {
  id: string
  fork: string
  filePath: string
  data: any
}

function findJsonFiles(root: string, fixtureType: ExecutionSpecFixtureType) {
  const files: string[] = []
  const stack = [root]

  while (stack.length > 0) {
    const current = stack.pop()!
    let entries: fs.Dirent[]
    try {
      entries = fs.readdirSync(current, { withFileTypes: true })
    } catch {
      continue
    }

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(fullPath)
        continue
      }
      if (entry.isFile() === false || entry.name.endsWith('.json') === false) {
        continue
      }

      const parentDir = path.basename(path.dirname(fullPath))
      const includesTypeSegment = fullPath.includes(`${path.sep}${fixtureType}${path.sep}`)
      if (includesTypeSegment || parentDir === fixtureType) {
        files.push(fullPath)
      }
    }
  }

  return files.sort()
}
