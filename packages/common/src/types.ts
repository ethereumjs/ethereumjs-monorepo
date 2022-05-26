import { PrefixedHexString } from 'ethereumjs-util'
import { ConsensusAlgorithm, ConsensusType, HardforkName, ChainId } from './enums'

export interface genesisStatesType {
  names: {
    [key: string]: string
  }
  [key: string]: {}
}

export interface ChainName {
  [chainId: string]: string
}
export interface ChainsType {
  [key: string]: Chain | ChainName
}

export type CliqueConfig = {
  period: number
  epoch: number
}

export type EthashConfig = {}

export type CasperConfig = {}
export interface Chain {
  name: string
  chainId: number | bigint
  networkId: number | bigint
  // TODO: make mandatory in next breaking release
  defaultHardfork?: string
  comment: string
  url: string
  genesis: GenesisBlock
  hardforks: Hardfork[]
  bootstrapNodes: BootstrapNode[]
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

export interface eipsType {
  [key: number]: any
}

export interface GenesisBlock {
  hash: string
  timestamp: string | null
  gasLimit: number
  difficulty: number
  nonce: string
  extraData: string
  stateRoot: string
  baseFeePerGas?: string
}

export interface Hardfork {
  name: HardforkName | string
  block: number | null
  td?: number
  forkHash?: string | null
}

export interface BootstrapNode {
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
  hardfork?: string | HardforkName
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
  customChains?: Chain[] | [Chain, GenesisState][]
}

/**
 * Options to be used with the {@link Common.custom} static constructor.
 */
export interface CustomCommonOpts extends BaseOpts {
  /**
   * The name (`mainnet`), id (`1`), or {@link Chain} enum of
   * a standard chain used to base the custom chain params on.
   */
  baseChain?: string | number | ChainId | bigint
}

export enum CustomChain {
  /**
   * Polygon (Matic) Mainnet
   *
   * - [Documentation](https://docs.matic.network/docs/develop/network-details/network)
   */
  PolygonMainnet = 'polygon-mainnet',

  /**
   * Polygon (Matic) Mumbai Testnet
   *
   * - [Documentation](https://docs.matic.network/docs/develop/network-details/network)
   */
  PolygonMumbai = 'polygon-mumbai',

  /**
   * Arbitrum Rinkeby Testnet
   *
   * - [Documentation](https://developer.offchainlabs.com/docs/public_testnet)
   */
  ArbitrumRinkebyTestnet = 'arbitrum-rinkeby-testnet',

  /**
   * xDai EVM sidechain with a native stable token
   *
   * - [Documentation](https://www.xdaichain.com/)
   */
  xDaiChain = 'x-dai-chain',

  /**
   * Optimistic Kovan - testnet for Optimism roll-up
   *
   * - [Documentation](https://community.optimism.io/docs/developers/tutorials.html)
   */
  OptimisticKovan = 'optimistic-kovan',

  /**
   * Optimistic Ethereum - mainnet for Optimism roll-up
   *
   * - [Documentation](https://community.optimism.io/docs/developers/tutorials.html)
   */
  OptimisticEthereum = 'optimistic-ethereum',
}
