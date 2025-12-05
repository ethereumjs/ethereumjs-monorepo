import fs from 'fs'
import path from 'path'
import { type ChainConfig, Common, Mainnet } from '@ethereumjs/common'
import { TypeOutput, toType } from '@ethereumjs/util'
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

function buildTransitionChainConfig(
  blobSchedule: any,
  transition: { hardfork: string; timestamp: number },
): ChainConfig {
  const customHardforks: any = {}
  const additionalHardforks: any[] = []

  // Extract BPO parameters from blobSchedule
  for (const [hfName, params] of Object.entries(blobSchedule)) {
    const hfNameLower = hfName.toLowerCase()
    if (hfNameLower.startsWith('bpo')) {
      const bpoParams = params as any
      customHardforks[hfNameLower] = {
        params: {
          target: toType(bpoParams.target, TypeOutput.Number),
          max: toType(bpoParams.max, TypeOutput.Number),
          blobGasPriceUpdateFraction: toType(bpoParams.baseFeeUpdateFraction, TypeOutput.Number),
        },
      }
      const timestamp = transition.hardfork === hfNameLower ? transition.timestamp : undefined
      additionalHardforks.push({
        name: hfNameLower,
        block: null,
        timestamp,
      })
    }
  }

  // Build chain config with custom hardforks and additional hardforks in the hardforks list
  const chainConfig = {
    ...Mainnet,
    ...(customHardforks !== undefined ? { customHardforks } : {}),
    hardforks: [...Mainnet.hardforks, ...additionalHardforks],
  }

  return chainConfig
}

export function createCommonForFork(fork: string, testData?: any) {
  const kzg = new microEthKZG(trustedSetup)

  try {
    // Single Fork (will throw if "fork" is transition fork string)
    return {
      from: new Common({ chain: Mainnet, hardfork: fork.toLowerCase(), customCrypto: { kzg } }),
      to: undefined,
      timestamp: undefined,
    }
  } catch {
    // Transition Fork (e.g. OsakaToBPO1AtTime15K)

    // Check if this is a transition fork
    const transitionMatch = fork.match(/^([A-Za-z0-9]+)To([A-Za-z0-9]+)AtTime(\d+)([Kk])?$/)
    if (transitionMatch === null) {
      throw new Error(`Unable to parse transition fork: ${fork}`)
    }

    // extract fork names and timestamp
    const [, fromFork, toFork, timestampStr, suffix] = transitionMatch
    const from = fromFork.toLowerCase()
    const to = toFork.toLowerCase()
    let timestamp = Number(timestampStr)
    if (suffix && suffix.toLowerCase() === 'k') {
      timestamp *= 1000
    }

    const transition = {
      hardfork: toFork.toLowerCase(),
      timestamp,
    }
    const blobSchedule = testData.config.blobSchedule

    // Build chain config with custom hardforks and blob schedule
    const chainConfig = buildTransitionChainConfig(blobSchedule, transition)

    return {
      from: new Common({ chain: chainConfig, hardfork: from, customCrypto: { kzg } }),
      to,
      timestamp,
    }
  }
}
