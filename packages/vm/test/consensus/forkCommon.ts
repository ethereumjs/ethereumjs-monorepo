import { paramsBlock } from '@ethereumjs/block'
import {
  type ChainConfig,
  Common,
  ConsensusType,
  type HardforkTransitionConfig,
  type HardforksDict,
  Mainnet,
  type ParamsDict,
} from '@ethereumjs/common'
import { paramsTx } from '@ethereumjs/tx'
import { TypeOutput, toType } from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

import { estForkToCommonHardfork } from './forks.ts'
import type { FixtureConfig } from './types.ts'

function consensusFixtureParams(): ParamsDict {
  return {
    ...JSON.parse(JSON.stringify(paramsBlock)),
    ...JSON.parse(JSON.stringify(paramsTx)),
  }
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

export const TRANSITION_FORK_REGEX = /^([A-Za-z0-9]+)To([A-Za-z0-9]+)AtTime(\d+)([Kk])?$/

function consensusForFork(fork: string): ChainConfig['consensus'] {
  return preMergeForks.includes(fork)
    ? { type: ConsensusType.ProofOfWork, algorithm: 'ethash' }
    : { type: ConsensusType.ProofOfStake, algorithm: 'casper' }
}

function hardforkHistoryUpTo(fork: string): HardforkTransitionConfig[] {
  const hardforks: HardforkTransitionConfig[] = []
  for (const hf of Mainnet.hardforks) {
    if (hf.name === fork) {
      hardforks.push({ name: fork, block: 0, timestamp: 0 })
      return hardforks
    }
    hardforks.push({ name: hf.name, block: null, timestamp: 0 })
  }
  hardforks.push({ name: fork, block: 0, timestamp: 0 })
  return hardforks
}

function createSingleForkCommon(
  fork: string,
  testData: { config?: FixtureConfig } | undefined,
  kzg: microEthKZG,
): Common {
  const forkName = estForkToCommonHardfork(fork)
  const chainConfig: ChainConfig = {
    ...Mainnet,
    hardforks: hardforkHistoryUpTo(forkName),
    consensus: consensusForFork(forkName),
    defaultHardfork: forkName,
  }
  if (testData?.config?.chainId !== undefined) {
    chainConfig.chainId = testData.config.chainId
  }
  return new Common({
    chain: chainConfig,
    hardfork: forkName,
    customCrypto: { kzg },
    params: consensusFixtureParams(),
  })
}

function createTransitionCommon(
  match: RegExpMatchArray,
  testData: { config?: FixtureConfig } | undefined,
  kzg: microEthKZG,
): Common {
  const [, fromFork, toFork, timestampStr, suffix] = match
  const from = estForkToCommonHardfork(fromFork)
  const to = estForkToCommonHardfork(toFork)
  const timestamp = Number(timestampStr) * (suffix?.toLowerCase() === 'k' ? 1000 : 1)

  const hardforks = hardforkHistoryUpTo(from)
  hardforks.push({ name: to, block: null, timestamp })

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
  return new Common({
    chain: chainConfig,
    hardfork: from,
    customCrypto: { kzg },
    params: consensusFixtureParams(),
  })
}

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

export function parseStateTest(fork: string, testData: import('./types.ts').StateTestFixtureData) {
  const testCase = testData.post[fork][0]
  const indexes = testCase.indexes
  const tx: Record<string, unknown> = { ...testData.transaction }

  tx.data = testData.transaction.data[indexes.data]
  tx.gasLimit = testData.transaction.gasLimit[indexes.gas]
  tx.value = testData.transaction.value[indexes.value]

  if (testData.transaction.accessLists !== undefined) {
    tx.accessList = testData.transaction.accessLists[indexes.data]
    if (tx.chainId === undefined) {
      tx.chainId = testData.config?.chainId ?? 1
    }
  }

  return {
    transaction: tx,
    postStateRoot: testCase.hash,
    logs: testCase.logs,
    env: testData.env,
    pre: testData.pre,
    expectException: testCase.expectException,
    txbytes: testCase.txbytes,
  }
}
