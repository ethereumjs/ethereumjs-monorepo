import type { Chain, ConsensusAlgorithm, ConsensusType, Hardfork } from './enums'
import type { Account, Address, PrefixedHexString } from '@ethereumjs/util'

export interface ChainName {
  [chainId: string]: string
}
export interface ChainsConfig {
  [key: string]: ChainConfig | ChainName
}

export type CliqueConfig = {
  period: number
  epoch: number
}

export type EthashConfig = {}

export type CasperConfig = {}
export interface ChainConfig {
  name: string
  chainId: number | bigint
  networkId: number | bigint
  defaultHardfork?: string
  comment?: string
  url?: string
  genesis: GenesisBlockConfig
  hardforks: HardforkConfig[]
  bootstrapNodes: BootstrapNodeConfig[]
  dnsNetworks?: string[]
  consensus: {
    type: ConsensusType | string
    algorithm: ConsensusAlgorithm | string
    clique?: CliqueConfig
    ethash?: EthashConfig
    casper?: CasperConfig
  }
}

export interface GenesisBlockConfig {
  timestamp?: string
  gasLimit: number | string
  difficulty: number | string
  nonce: string
  extraData: string
  baseFeePerGas?: string
}

export interface HardforkConfig {
  name: Hardfork | string
  block: number | null // null is used for hardforks that should not be applied -- since `undefined` isn't a valid value in JSON
  ttd?: bigint | string
  timestamp?: number | string
  forkHash?: string | null
}

export interface BootstrapNodeConfig {
  ip: string
  port: number | string
  network?: string
  chainId?: number
  id: string
  location: string
  comment: string
}

interface BaseOpts {
  /**
   * String identifier ('byzantium') for hardfork or {@link Hardfork} enum.
   *
   * Default: Hardfork.London
   */
  hardfork?: string | Hardfork
  /**
   * Selected EIPs which can be activated, please use an array for instantiation
   * (e.g. `eips: [ 2537, ]`)
   *
   * Currently supported:
   *
   * - [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - BLS12-381 precompiles
   */
  eips?: number[]
}

/**
 * Options for instantiating a {@link Common} instance.
 */
export interface CommonOpts extends BaseOpts {
  /**
   * Chain name ('mainnet'), id (1), or {@link Chain} enum,
   * either from a chain directly supported or a custom chain
   * passed in via {@link CommonOpts.customChains}.
   */
  chain: string | number | Chain | bigint | object
  /**
   * Initialize (in addition to the supported chains) with the selected
   * custom chains. Custom genesis state should be passed to the Blockchain class if used.
   *
   * Usage (directly with the respective chain initialization via the {@link CommonOpts.chain} option):
   *
   * ```javascript
   * import myCustomChain1 from '[PATH_TO_MY_CHAINS]/myCustomChain1.json'
   * const common = new Common({ chain: 'myCustomChain1', customChains: [ myCustomChain1 ]})
   * ```
   */
  customChains?: ChainConfig[]
}

/**
 * Options to be used with the {@link Common.custom} static constructor.
 */
export interface CustomCommonOpts extends BaseOpts {
  /**
   * The name (`mainnet`), id (`1`), or {@link Chain} enum of
   * a standard chain used to base the custom chain params on.
   */
  baseChain?: string | number | Chain | bigint
}

export interface GethConfigOpts extends BaseOpts {
  chain?: string
  genesisHash?: Uint8Array
  mergeForkIdPostMerge?: boolean
}

/**
 * Start of exposing interfaces which are used by other packages
 */

export interface StorageDump {
  [key: string]: string
}

export type AccountFields = Partial<Pick<Account, 'nonce' | 'balance' | 'storageRoot' | 'codeHash'>>

export type CacheClearingOpts = {
  /**
   * Full cache clearing
   * (overrides the useThreshold option)
   *
   * default: true
   */
  clear: boolean
  /**
   * Clean up the cache by deleting cache elements
   * where stored comparand is below the given
   * threshold.
   */
  useThreshold?: bigint
  /**
   * Comparand stored along a cache element with a
   * read or write access.
   *
   * This can be a block number, timestamp,
   * consecutive number or any other bigint
   * which makes sense as a comparison value.
   */
  comparand?: bigint
}

export type StorageProof = {
  key: PrefixedHexString
  proof: PrefixedHexString[]
  value: PrefixedHexString
}

export type Proof = {
  address: PrefixedHexString
  balance: PrefixedHexString
  codeHash: PrefixedHexString
  nonce: PrefixedHexString
  storageHash: PrefixedHexString
  accountProof: PrefixedHexString[]
  storageProof: StorageProof[]
}

type Stats = {
  cache: {
    size: number
    reads: number
    hits: number
    writes: number
    dels: number
  }
  trie: {
    reads: number
    writes: number
    dels: number
  }
}

export interface CacheInterface {
  getOrLoad(address: Address): Promise<Account | undefined>
  flush(): Promise<void>
  clear(cacheClearingOpts?: CacheClearingOpts): void
  put(address: Address, account: Account | undefined): void
  del(address: Address): void
  checkpoint(): void
  revert(): void
  commit(): void
  stats(reset?: boolean): Stats
}

export interface StateAccess {
  accountExists(address: Address): Promise<boolean>
  getAccount(address: Address): Promise<Account | undefined>
  putAccount(address: Address, account: Account): Promise<void>
  deleteAccount(address: Address): Promise<void>
  modifyAccountFields(address: Address, accountFields: AccountFields): Promise<void>
  putContractCode(address: Address, value: Uint8Array): Promise<void>
  getContractCode(address: Address): Promise<Uint8Array>
  getContractStorage(address: Address, key: Uint8Array): Promise<Uint8Array>
  putContractStorage(address: Address, key: Uint8Array, value: Uint8Array): Promise<void>
  clearContractStorage(address: Address): Promise<void>
  checkpoint(): Promise<void>
  commit(): Promise<void>
  revert(): Promise<void>
  getStateRoot(): Promise<Uint8Array>
  setStateRoot(stateRoot: Uint8Array, clearCache?: boolean): Promise<void>
  getProof?(address: Address, storageSlots: Uint8Array[]): Promise<Proof>
  verifyProof?(proof: Proof): Promise<boolean>
  hasStateRoot(root: Uint8Array): Promise<boolean>
}

export interface StateManagerInterface extends StateAccess {
  cache?: CacheInterface
  copy(): StateManagerInterface
  flush(): Promise<void>
  dumpStorage(address: Address): Promise<StorageDump>
}
