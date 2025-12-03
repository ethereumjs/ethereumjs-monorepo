import fs from 'fs'
import path from 'path'
import { Common, Mainnet, createCustomCommon } from '@ethereumjs/common'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

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

export function loadExecutionSpecFixtures(
  root: string,
  fixtureType: ExecutionSpecFixtureType,
): ExecutionSpecFixture[] {
  const files = findJsonFiles(root, fixtureType)
  const fixtures: ExecutionSpecFixture[] = []

  for (const filePath of files) {
    let parsed: Record<string, any>
    try {
      parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch {
      continue
    }

    for (const [id, data] of Object.entries(parsed)) {
      if (fixtureType === 'state_tests') {
        const forks = Object.keys((data as any).post ?? {})
        for (const fork of forks) {
          fixtures.push({ id, fork, filePath, data })
        }
      } else {
        const fork = (data as any).network ?? (data as any).config?.network
        if (fork !== undefined) {
          fixtures.push({ id, fork, filePath, data })
        }
      }
    }
  }

  return fixtures
}

export function parseTest(fork: string, testData: any) {
  const postState = testData['post']?.[fork]
  const testCase = postState[0]
  const testIndexes = testCase['indexes']
  const tx = { ...testData.transaction }

  tx.data = testData.transaction.data[testIndexes['data']]
  tx.gasLimit = testData.transaction.gasLimit[testIndexes['gas']]
  tx.value = testData.transaction.value[testIndexes['value']]

  if (tx.accessLists !== undefined) {
    tx.accessList = testData.transaction.accessLists[testIndexes['data']]
    if (tx.chainId === undefined) {
      tx.chainId = 1
    }
  }

  return {
    transaction: tx,
    postStateRoot: testCase['hash'],
    logs: testCase['logs'],
    env: testData['env'],
    pre: testData['pre'],
    expectException: testCase['expectException'],
  }
}

export function createCommonForFork(fork: string) {
  const kzg = new microEthKZG(trustedSetup)
  try {
    // Single Fork
    return new Common({ chain: Mainnet, hardfork: fork.toLowerCase(), customCrypto: { kzg } })
  } catch {
    // Transition Fork (e.g. OsakaToBPO1AtTime15K)
    const match = fork.match(/^([A-Za-z0-9]+)To([A-Za-z0-9]+)AtTime(\d+)$/)
    if (match === null) {
      throw new Error(`unsupported fork ${fork}`)
    }
    const [, fromFork, toFork, timestampStr, suffix] = match
    const from = fromFork.charAt(0).toLowerCase() + fromFork.substring(1)
    const to = toFork.charAt(0).toLowerCase() + toFork.substring(1)
    let timestamp = Number(timestampStr)
    if (suffix && suffix === 'k') {
      timestamp *= 1000
    }
    const hardforks = [
      {
        name: from,
        block: null,
        timestamp: 0,
      },
      {
        name: to,
        block: null,
        timestamp,
      },
    ]

    return createCustomCommon(
      {
        hardforks,
        defaultHardfork: from,
      },
      Mainnet,
      { customCrypto: { kzg } },
    )
  }
}
