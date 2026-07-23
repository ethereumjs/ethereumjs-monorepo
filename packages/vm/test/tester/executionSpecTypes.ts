/**
 * Type definitions for execution-spec-tests fixtures.
 *
 * These describe the JSON shape produced by
 * https://github.com/ethereum/execution-spec-tests and consumed by the
 * `executionSpecState.test.ts` / `executionSpecBlockchain.test.ts` runners.
 *
 * The fixtures are external data, so these types are intentionally permissive:
 * every interface carries an index signature (or `unknown` fields) for keys we
 * do not explicitly model, while still typing the fields the runners read.
 */
import type { BALJSONBlockAccessList, PrefixedHexString } from '@ethereumjs/util'

/** Which kind of fixtures to load from a fixtures directory. */
export type ExecutionSpecFixtureType = 'state_tests' | 'blockchain_tests'

/** A single account's pre-/post-state as encoded in a fixture. */
export interface FixtureAccountState {
  nonce: PrefixedHexString
  balance: PrefixedHexString
  code: PrefixedHexString
  storage: Record<string, PrefixedHexString>
}

/** The `env` object describing the execution environment (block context). */
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

/** Per-hardfork blob parameters, present in transition-fork fixtures. */
export interface FixtureBlobScheduleEntry {
  target: PrefixedHexString | number
  max: PrefixedHexString | number
  baseFeeUpdateFraction: PrefixedHexString | number
}

/** Optional `config` block: chain id and (for transition forks) blob schedule. */
export interface FixtureConfig {
  network?: string
  chainId?: number
  /** Lowercase spelling used by some blockchain fixtures. */
  chainid?: number
  blobSchedule?: Record<string, FixtureBlobScheduleEntry>
  [key: string]: unknown
}

// ---------------------------------------------------------------------------
// State tests
// ---------------------------------------------------------------------------

/**
 * A state-test transaction. `data`, `gasLimit` and `value` are parallel arrays;
 * a post entry's {@link StateTestIndexes} selects one element from each.
 */
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

/** Indexes into the transaction's parallel arrays for a single post entry. */
export interface StateTestIndexes {
  data: number
  gas: number
  value: number
}

/** One expected result of a state test (one data/gas/value combination). */
export interface StateTestPostEntry {
  hash: PrefixedHexString
  logs: PrefixedHexString
  txbytes?: PrefixedHexString
  indexes: StateTestIndexes
  state?: Record<string, FixtureAccountState>
  expectException?: string
}

/** A full state-test fixture body (`post` is keyed by fork name). */
export interface StateTestFixtureData {
  env: FixtureEnv
  pre: Record<string, FixtureAccountState>
  transaction: StateTestTransaction
  post: Record<string, StateTestPostEntry[]>
  config?: FixtureConfig
}

/**
 * A single state-test case resolved for one fork and one index combination,
 * ready to be executed. Produced by `parseStateTest`.
 */
export interface ParsedStateTest {
  /** Transaction with `data`/`gasLimit`/`value` collapsed to single values. */
  transaction: Record<string, unknown>
  postStateRoot: PrefixedHexString
  logs: PrefixedHexString
  env: FixtureEnv
  pre: Record<string, FixtureAccountState>
  expectException?: string
}

// ---------------------------------------------------------------------------
// Blockchain tests
// ---------------------------------------------------------------------------

/** A block header as embedded in a blockchain fixture. */
export interface FixtureBlockHeader {
  hash?: PrefixedHexString
  stateRoot?: PrefixedHexString
  [key: string]: unknown
}

/** One block within a blockchain test. */
export interface BlockchainTestBlock {
  rlp: PrefixedHexString
  blockHeader?: FixtureBlockHeader
  /** Present on fixtures that also ship a decoded form of the block. */
  rlp_decoded?: {
    blockHeader?: FixtureBlockHeader
    blockAccessList?: BALJSONBlockAccessList
  }
  /** EIP-7928 block-level access list (Amsterdam+), when provided. */
  blockAccessList?: BALJSONBlockAccessList
  /** Set when the block is expected to be rejected; names the exception(s). */
  expectException?: string
  transactions?: unknown[]
}

/** A full blockchain-test fixture body. */
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

/**
 * A loaded fixture entry. One JSON file can expand into several of these: one
 * per (test id, fork) pair for state tests, one per test id for blockchain
 * tests. `TData` is the fixture body, keyed by {@link ExecutionSpecFixtureType}.
 * The type-narrowing overloads of `loadExecutionSpecFixtures` supply a concrete
 * `TData` ({@link StateTestFixtureData} / {@link BlockchainTestFixtureData}); the
 * `any` default only applies to callers that use the bare, untyped form.
 */
export interface ExecutionSpecFixture<TData = any> {
  id: string
  fork: string
  filePath: string
  data: TData
}
