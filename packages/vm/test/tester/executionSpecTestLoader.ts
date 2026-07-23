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

import type {
  BlockchainTestFixtureData,
  ExecutionSpecFixture,
  ExecutionSpecFixtureType,
  FixtureConfig,
  ParsedStateTest,
  StateTestFixtureData,
} from './executionSpecTypes.ts'

export type {
  ExecutionSpecFixture,
  ExecutionSpecFixtureType,
} from './executionSpecTypes.ts'

// ---------------------------------------------------------------------------
// Fixture discovery / loading
// ---------------------------------------------------------------------------

/**
 * Recursively collects `.json` fixture files under `root` that belong to the
 * given fixture type. A file qualifies if its path contains a
 * `/<fixtureType>/` segment or its immediate parent directory is `fixtureType`.
 */
function findJSONFiles(root: string, fixtureType: ExecutionSpecFixtureType): string[] {
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
  fixtureType: 'state_tests',
): ExecutionSpecFixture<StateTestFixtureData>[]
export function loadExecutionSpecFixtures(
  root: string,
  fixtureType: 'blockchain_tests',
): ExecutionSpecFixture<BlockchainTestFixtureData>[]
/**
 * Loads and flattens every fixture of `fixtureType` found under `root`.
 *
 * A single JSON file holds multiple named tests. Each test expands into one
 * fixture entry per fork it targets:
 * - state tests: one entry per key of the test's `post` object;
 * - blockchain tests: a single entry, using the test's `network` field.
 */
export function loadExecutionSpecFixtures(
  root: string,
  fixtureType: ExecutionSpecFixtureType,
): ExecutionSpecFixture[] {
  const files = findJSONFiles(root, fixtureType)
  const fixtures: ExecutionSpecFixture[] = []

  for (const filePath of files) {
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch {
      continue
    }

    for (const [id, data] of Object.entries(parsed)) {
      if (fixtureType === 'state_tests') {
        const test = data as StateTestFixtureData
        for (const fork of Object.keys(test.post ?? {})) {
          fixtures.push({ id, fork, filePath, data: test })
        }
      } else {
        const test = data as BlockchainTestFixtureData
        const fork = test.network ?? test.config?.network
        if (fork !== undefined) {
          fixtures.push({ id, fork, filePath, data: test })
        }
      }
    }
  }

  return fixtures
}

/**
 * Resolves a state-test fixture for a single fork into an executable case.
 *
 * State-test transactions store `data`, `gasLimit` and `value` as parallel
 * arrays; the post entry's `indexes` pick one element from each to form the
 * concrete transaction this case should run.
 */
export function parseStateTest(fork: string, testData: StateTestFixtureData): ParsedStateTest {
  const testCase = testData.post[fork][0]
  const indexes = testCase.indexes
  const tx: Record<string, unknown> = { ...testData.transaction }

  tx.data = testData.transaction.data[indexes.data]
  tx.gasLimit = testData.transaction.gasLimit[indexes.gas]
  tx.value = testData.transaction.value[indexes.value]

  if (testData.transaction.accessLists !== undefined) {
    tx.accessList = testData.transaction.accessLists[indexes.data]
    if (tx.chainId === undefined) {
      tx.chainId = 1
    }
  }

  return {
    transaction: tx,
    postStateRoot: testCase.hash,
    logs: testCase.logs,
    env: testData.env,
    pre: testData.pre,
    expectException: testCase.expectException,
  }
}

// ---------------------------------------------------------------------------
// Common construction
// ---------------------------------------------------------------------------

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

/** Matches transition-fork names, e.g. `OsakaToBPO1AtTime15k`. */
const TRANSITION_FORK_REGEX = /^([A-Za-z0-9]+)To([A-Za-z0-9]+)AtTime(\d+)([Kk])?$/

/**
 * Maps a fixture fork name to the hardfork name used by `@ethereumjs/common`.
 * Fixtures use a few historical aliases that differ from our internal names.
 */
export function normalizeForkName(fork: string): string {
  const lower = fork.toLowerCase()
  if (lower === 'frontier') return 'chainstart'
  if (lower === 'constantinoplefix') return 'petersburg'
  return lower
}

function consensusForFork(fork: string): ChainConfig['consensus'] {
  return preMergeForks.includes(fork)
    ? { type: ConsensusType.ProofOfWork, algorithm: 'ethash' }
    : { type: ConsensusType.ProofOfStake, algorithm: 'casper' }
}

/**
 * Builds the mainnet hardfork history with every fork up to and including
 * `fork` present (so `gteHardfork()` resolves correctly), `fork` activated at
 * block 0 and all earlier forks disabled.
 */
function hardforkHistoryUpTo(fork: string): HardforkTransitionConfig[] {
  const hardforks: HardforkTransitionConfig[] = []
  for (const hf of Mainnet.hardforks) {
    if (hf.name === fork) {
      hardforks.push({ name: fork, block: 0, timestamp: 0 })
      return hardforks
    }
    hardforks.push({ name: hf.name, block: null, timestamp: 0 })
  }
  // `fork` is not a known mainnet hardfork (e.g. a devnet fork): add it anyway.
  hardforks.push({ name: fork, block: 0, timestamp: 0 })
  return hardforks
}

/** Common for a single (non-transition) fork. */
function createSingleForkCommon(
  fork: string,
  testData: { config?: FixtureConfig } | undefined,
  kzg: microEthKZG,
): Common {
  const forkName = normalizeForkName(fork)
  const chainConfig: ChainConfig = {
    ...Mainnet,
    hardforks: hardforkHistoryUpTo(forkName),
    consensus: consensusForFork(forkName),
    defaultHardfork: forkName,
  }
  // Only override chainId when the fixture specifies one; otherwise keep Mainnet's.
  if (testData?.config?.chainId !== undefined) {
    chainConfig.chainId = testData.config.chainId
  }
  return new Common({ chain: chainConfig, hardfork: forkName, customCrypto: { kzg } })
}

/** Common for a `<from>To<to>AtTime<n>` transition fork. */
function createTransitionCommon(
  match: RegExpMatchArray,
  testData: { config?: FixtureConfig } | undefined,
  kzg: microEthKZG,
): Common {
  const [, fromFork, toFork, timestampStr, suffix] = match
  const from = fromFork.toLowerCase()
  const to = toFork.toLowerCase()
  const timestamp = Number(timestampStr) * (suffix?.toLowerCase() === 'k' ? 1000 : 1)

  const hardforks = hardforkHistoryUpTo(from)
  // The "to" fork activates at the transition timestamp.
  hardforks.push({ name: to, block: null, timestamp })

  // Extract BPO (blob parameter only) fork params from the fixture's blob schedule.
  const customHardforks: HardforksDict = {}
  const blobSchedule = testData?.config?.blobSchedule
  if (blobSchedule !== undefined) {
    for (const [hfName, params] of Object.entries(blobSchedule)) {
      if (hfName.toLowerCase().startsWith('bpo')) {
        customHardforks[hfName.toLowerCase()] = {
          params: {
            target: toType(params.target, TypeOutput.Number),
            max: toType(params.max, TypeOutput.Number),
            blobGasPriceUpdateFraction: toType(params.baseFeeUpdateFraction, TypeOutput.Number),
          },
        }
      }
    }
  }

  const chainConfig: ChainConfig = {
    ...Mainnet,
    customHardforks,
    defaultHardfork: from,
    hardforks,
    consensus: consensusForFork(from),
  }
  return new Common({ chain: chainConfig, hardfork: from, customCrypto: { kzg } })
}

/**
 * Returns the `Common` to run a fixture against. Handles both single forks
 * (e.g. `Prague`) and transition forks (e.g. `OsakaToBPO1AtTime15k`).
 */
export function createCommonForFork(
  fork: string,
  testData?: { config?: FixtureConfig },
  kzg?: microEthKZG,
): Common {
  const kzgInstance = kzg ?? new microEthKZG(trustedSetup)
  const transitionMatch = fork.match(TRANSITION_FORK_REGEX)
  return transitionMatch !== null
    ? createTransitionCommon(transitionMatch, testData, kzgInstance)
    : createSingleForkCommon(fork, testData, kzgInstance)
}
