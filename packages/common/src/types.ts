import { PrefixedHexString } from 'ethereumjs-util'
import { ConsensusAlgorithm, ConsensusType, Hardfork, Chain } from './enums'

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
  // TODO: make mandatory in next breaking release
  defaultHardfork?: string
  comment: string
  url: string
  genesis: GenesisBlockConfig
  hardforks: HardforkConfig[]
  bootstrapNodes: BootstrapNodeConfig[]
  dnsNetworks?: string[]
  // TODO: make mandatory in next breaking release
  consensus?: {
    type: ConsensusType | string
    algorithm: ConsensusAlgorithm | string
    clique?: CliqueConfig
    ethash?: EthashConfig
    casper?: CasperConfig
  }
}

type StoragePair = [key: PrefixedHexString, value: PrefixedHexString]

export type AccountState = [
  balance: PrefixedHexString,
  code: PrefixedHexString,
  storage: Array<StoragePair>
]

export interface GenesisState {
  [key: PrefixedHexString]: PrefixedHexString | AccountState
}

export interface GenesisBlockConfig {
  hash: string
  timestamp: string | null
  gasLimit: number
  difficulty: number
  nonce: string
  extraData: string
  stateRoot: string
  baseFeePerGas?: string
}

export interface HardforkConfig {
  name: Hardfork | string
  block: number | null
  td?: number
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
   * custom chains
   *
   * Usage (directly with the respective chain intialization via the {@link CommonOpts.chain} option):
   *
   * Pattern 1 (without genesis state):
   *
   * ```javascript
   * import myCustomChain1 from '[PATH_TO_MY_CHAINS]/myCustomChain1.json'
   * const common = new Common({ chain: 'myCustomChain1', customChains: [ myCustomChain1 ]})
   * ```
   *
   * Pattern 2 (with genesis state see {@link GenesisState} for format):
   *
   * ```javascript
   * const simpleState = {
   *   '0x0...01': '0x100', // For EoA
   * }
   * import myCustomChain1 from '[PATH_TO_MY_CHAINS]/myCustomChain1.json'
   * import chain1GenesisState from '[PATH_TO_GENESIS_STATES]/chain1GenesisState.json'
   * const common = new Common({ chain: 'myCustomChain1', customChains: [ [ myCustomChain1, simpleState ] ]})
   * ```
   *
   * Pattern 3 (with complex genesis state, containing contract accounts and storage).
   * Note that in {@link AccountState} there are two
   * accepted types. This allows to easily insert accounts in the genesis state:
   *
   * A complex genesis state with Contract and EoA states would have the following format:
   *
   * ```javascript
   * const complexState = {
   *   '0x0...01': '0x100', // For EoA
   *   '0x0...02': ['0x1', '0xRUNTIME_BYTECODE', [[ keyOne, valueOne ], [ keyTwo, valueTwo ]]] // For contracts
   * }
   * import myCustomChain1 from '[PATH_TO_MY_CHAINS]/myCustomChain1.json'
   * const common = new Common({ chain: 'myCustomChain1', customChains: [ [ myCustomChain1, complexState ] ]})
   * ```
   */
  customChains?: ChainConfig[] | [ChainConfig, GenesisState][]
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
