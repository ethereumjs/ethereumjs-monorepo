/**
 * JSON shapes for execution-spec-tests fixtures consumed by the consensus runner.
 */
import type { BALJSONBlockAccessList, PrefixedHexString } from '@ethereumjs/util'

export type ConsensusFixtureFormat = 'state_tests' | 'blockchain_tests'
/** @deprecated Alias for scripts migrating off the Vitest EST runner. */
export type ExecutionSpecFixtureType = ConsensusFixtureFormat

export interface FixtureAccountState {
  nonce: PrefixedHexString
  balance: PrefixedHexString
  code: PrefixedHexString
  storage: Record<string, PrefixedHexString>
}

export interface FixtureEnv {
  currentCoinbase: PrefixedHexString
  currentGasLimit: PrefixedHexString
  currentNumber: PrefixedHexString
  currentTimestamp: PrefixedHexString
  currentRandom?: PrefixedHexString
  currentDifficulty?: PrefixedHexString
  currentBaseFee?: PrefixedHexString
  currentExcessBlobGas?: PrefixedHexString
  [key: string]: unknown
}

export interface FixtureBlobScheduleEntry {
  target: PrefixedHexString | number
  max: PrefixedHexString | number
  baseFeeUpdateFraction: PrefixedHexString | number
}

export interface FixtureConfig {
  network?: string
  chainId?: number
  chainid?: number
  blobSchedule?: Record<string, FixtureBlobScheduleEntry>
  [key: string]: unknown
}

export interface StateTestTransaction {
  data: PrefixedHexString[]
  gasLimit: PrefixedHexString[]
  value: PrefixedHexString[]
  accessLists?: unknown[]
  nonce?: PrefixedHexString
  gasPrice?: PrefixedHexString
  to?: PrefixedHexString
  sender?: PrefixedHexString
  secretKey?: PrefixedHexString
  chainId?: number
  [key: string]: unknown
}

export interface StateTestIndexes {
  data: number
  gas: number
  value: number
}

export interface StateTestPostEntry {
  hash: PrefixedHexString
  logs: PrefixedHexString
  txbytes?: PrefixedHexString
  indexes: StateTestIndexes
  state?: Record<string, FixtureAccountState>
  expectException?: string
}

export interface StateTestFixtureData {
  env: FixtureEnv
  pre: Record<string, FixtureAccountState>
  transaction: StateTestTransaction
  post: Record<string, StateTestPostEntry[]>
  config?: FixtureConfig
}

export interface ParsedStateTest {
  transaction: Record<string, unknown>
  postStateRoot: PrefixedHexString
  logs: PrefixedHexString
  env: FixtureEnv
  pre: Record<string, FixtureAccountState>
  expectException?: string
  /** Canonical signed tx from the fixture post entry (exception / invalid-signature cases). */
  txbytes?: PrefixedHexString
}

export interface FixtureBlockHeader {
  hash?: PrefixedHexString
  stateRoot?: PrefixedHexString
  [key: string]: unknown
}

export interface BlockchainTestBlock {
  rlp: PrefixedHexString
  blockHeader?: FixtureBlockHeader
  rlp_decoded?: {
    blockHeader?: FixtureBlockHeader
    blockAccessList?: BALJSONBlockAccessList
  }
  blockAccessList?: BALJSONBlockAccessList
  expectException?: string
  transactions?: unknown[]
}

export interface BlockchainTestFixtureData {
  network: string
  genesisBlockHeader: FixtureBlockHeader & { hash: PrefixedHexString }
  genesisRLP?: PrefixedHexString
  pre: Record<string, FixtureAccountState>
  postState?: Record<string, FixtureAccountState>
  lastblockhash: PrefixedHexString
  blocks: BlockchainTestBlock[]
  config?: FixtureConfig
  sealEngine?: string
}

export interface ExecutionSpecFixture<TData = StateTestFixtureData | BlockchainTestFixtureData> {
  id: string
  fork: string
  filePath: string
  data: TData
}

export interface ConsensusTestCase {
  id: string
  fork: string
  format: ConsensusFixtureFormat
  filePath: string
  legacy?: boolean
  data: StateTestFixtureData | BlockchainTestFixtureData
}

export type CaseResult = {
  id: string
  fork: string
  format: ConsensusFixtureFormat
  filePath: string
  relPath: string
  pass: boolean
  error?: string
  durationMs: number
}
