import fs from 'node:fs'
import path from 'node:path'

import { type Shard, fileBelongsToShard, parseShard } from '../tester/util/shard.ts'

import type {
  BlockchainTestFixtureData,
  ConsensusFixtureFormat,
  ConsensusTestCase,
  StateTestFixtureData,
} from './types.ts'

function findJSONFiles(root: string, fixtureType: ConsensusFixtureFormat): string[] {
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
      if (!entry.isFile() || !entry.name.endsWith('.json')) continue

      const parentDir = path.basename(path.dirname(fullPath))
      const includesTypeSegment = fullPath.includes(`${path.sep}${fixtureType}${path.sep}`)
      if (includesTypeSegment || parentDir === fixtureType) {
        files.push(fullPath)
      }
    }
  }

  return files.sort()
}

export function loadEstFixtures(
  root: string,
  format: ConsensusFixtureFormat,
  shard?: Shard,
): ConsensusTestCase[] {
  const typeRoot = path.join(root, format)
  const searchRoot = fs.existsSync(typeRoot) ? typeRoot : root
  const files = findJSONFiles(searchRoot, format).filter((filePath) => {
    if (shard === undefined) return true
    const rel = path.relative(searchRoot, filePath).split(path.sep).join('/')
    return fileBelongsToShard(rel, shard)
  })

  const cases: ConsensusTestCase[] = []
  for (const filePath of files) {
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch {
      continue
    }

    for (const [id, data] of Object.entries(parsed)) {
      if (format === 'state_tests') {
        const test = data as StateTestFixtureData
        for (const fork of Object.keys(test.post ?? {})) {
          cases.push({ id, fork, format, filePath, data: test, legacy: false })
        }
      } else {
        const test = data as BlockchainTestFixtureData
        const fork = test.network ?? test.config?.network
        if (fork !== undefined) {
          cases.push({ id, fork, format, filePath, data: test, legacy: false })
        }
      }
    }
  }
  return cases
}

export function loadLegacyBlockchainFixtures(
  roots: string[],
  network: string,
  shard?: Shard,
): ConsensusTestCase[] {
  const cases: ConsensusTestCase[] = []
  for (const root of roots) {
    if (!fs.existsSync(root)) continue
    const files = findJSONFiles(root, 'blockchain_tests').filter((filePath) => {
      if (shard === undefined) return true
      const rel = path.relative(root, filePath).split(path.sep).join('/')
      return fileBelongsToShard(rel, shard)
    })

    for (const filePath of files) {
      let parsed: Record<string, BlockchainTestFixtureData>
      try {
        parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      } catch {
        continue
      }
      for (const [id, data] of Object.entries(parsed)) {
        if (data.network !== network) continue
        cases.push({
          id,
          fork: data.network,
          format: 'blockchain_tests',
          filePath,
          data,
          legacy: true,
        })
      }
    }
  }
  return cases
}

export { parseShard }
