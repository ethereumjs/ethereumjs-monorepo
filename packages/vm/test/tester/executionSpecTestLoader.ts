import fs from 'fs'
import path from 'path'
import {
  type ChainConfig,
  Common,
  ConsensusType,
  type HardforkTransitionConfig,
  type HardforksDict,
  Mainnet,
} from '@ethereumjs/common'
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

function findJSONFiles(root: string, fixtureType: ExecutionSpecFixtureType) {
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
  const files = findJSONFiles(root, fixtureType)
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

function customHardforkHistory(fork: string): HardforkTransitionConfig[] {
  // Include all hardforks from Mainnet up to and including the "from" hardfork
  // This is necessary for gteHardfork() to work correctly
  const mainnetHardforks = Mainnet.hardforks
  const hardforks: HardforkTransitionConfig[] = []
  let foundFrom = false
  for (const hf of mainnetHardforks) {
    if (hf.name === fork) {
      foundFrom = true
      // Add the "from" hardfork at block 0
      hardforks.push({
        name: fork,
        block: 0,
        timestamp: 0,
      })
      break
    } else {
      // Include all previous hardforks at block 0
      hardforks.push({
        name: hf.name,
        block: null,
        timestamp: 0,
      })
    }
  }
  if (!foundFrom) {
    // If "from" hardfork not found in Mainnet hardforks, just add it
    hardforks.push({
      name: fork,
      block: 0,
      timestamp: 0,
    })
  }
  return hardforks
}

function buildTransitionChainConfig(
  blobSchedule: any,
  from: string,
  to: string,
  timestamp: number,
): ChainConfig {
  const hardforks: HardforkTransitionConfig[] = customHardforkHistory(from)
  // Add the "to" hardfork at the specified timestamp
  hardforks.push({
    name: to,
    block: null,
    timestamp,
  })

  const customHardforks: HardforksDict = {}
  // Extract BPO parameters from blobSchedule
  if (blobSchedule !== undefined) {
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
      }
    }
  }

  // Build chain config with custom hardforks and additional hardforks in the hardforks list
  const chainConfig: ChainConfig = {
    ...Mainnet,
    customHardforks,
    defaultHardfork: from,
    hardforks,
    consensus: preMergeForks.includes(from)
      ? {
          type: ConsensusType.ProofOfStake,
          algorithm: 'casper',
        }
      : {
          type: ConsensusType.ProofOfWork,
          algorithm: 'ethash',
        },
  }

  return chainConfig
}

const preMergeForks = [
  'chainstart',
  'homestead',
  'dao',
  'tangerineWhistle',
  'spuriousDragon',
  'byzantium',
  'constantinople',
  'petersburg',
  'istanbul',
  'muirGlacier',
  'berlin',
  'london',
  'arrowGlacier',
  'grayGlacier',
]

export function createCommonForFork(fork: string, testData?: any, kzg?: microEthKZG) {
  const kzgInstance = kzg ?? new microEthKZG(trustedSetup)

  try {
    let forkLower = fork.toLowerCase()
    if (forkLower === 'frontier') {
      forkLower = 'chainstart'
    } else if (forkLower === 'constantinoplefix') {
      forkLower = 'petersburg'
    }
    const hardforks: HardforkTransitionConfig[] = customHardforkHistory(forkLower)

    const chainConfig: ChainConfig = {
      ...Mainnet,
      hardforks,
      consensus: preMergeForks.includes(forkLower)
        ? {
            type: ConsensusType.ProofOfWork,
            algorithm: 'ethash',
          }
        : {
            type: ConsensusType.ProofOfStake,
            algorithm: 'casper',
          },
      defaultHardfork: forkLower,
    }
    // Only set chainId if it's provided in testData, otherwise use Mainnet's chainId
    if (testData?.config?.chainId !== undefined) {
      chainConfig.chainId = testData.config.chainId
    }
    return new Common({
      chain: chainConfig,
      hardfork: forkLower,
      customCrypto: { kzg: kzgInstance },
    })
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

    const blobSchedule = testData.config.blobSchedule

    // Build chain config with custom hardforks and blob schedule
    const chainConfig = buildTransitionChainConfig(blobSchedule, from, to, timestamp)

    return new Common({ chain: chainConfig, hardfork: from, customCrypto: { kzg: kzgInstance } })
  }
}
