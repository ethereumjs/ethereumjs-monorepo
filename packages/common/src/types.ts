import type { Chain, ConsensusAlgorithm, ConsensusType, Hardfork } from './enums.js'
import type { BigIntLike, ECDSASignature, Kzg, PrefixedHexString } from '@ethereumjs/util'

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

type ConsensusConfig = {
  type: ConsensusType | string
  algorithm: ConsensusAlgorithm | string
  clique?: CliqueConfig
  ethash?: EthashConfig
  casper?: CasperConfig
}

export interface ChainConfig {
  name: string
  chainId: number | bigint
  defaultHardfork?: string
  comment?: string
  url?: string
  genesis: GenesisBlockConfig
  hardforks: HardforkTransitionConfig[]
  customHardforks?: HardforksDict
  bootstrapNodes: BootstrapNodeConfig[]
  dnsNetworks?: string[]
  consensus: ConsensusConfig
  depositContractAddress?: PrefixedHexString
}

export interface GenesisBlockConfig {
  timestamp?: PrefixedHexString
  gasLimit: number | PrefixedHexString
  difficulty: number | PrefixedHexString
  nonce: PrefixedHexString
  extraData: PrefixedHexString
  baseFeePerGas?: PrefixedHexString
  excessBlobGas?: PrefixedHexString
}

export interface HardforkTransitionConfig {
  name: Hardfork | string
  block: number | null // null is used for hardforks that should not be applied -- since `undefined` isn't a valid value in JSON
  ttd?: bigint | string
  timestamp?: number | string
  forkHash?: PrefixedHexString | null
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

export interface CustomCrypto {
  /**
   * Interface for providing custom cryptographic primitives in place of `ethereum-cryptography` variants
   */
  keccak256?: (msg: Uint8Array) => Uint8Array
  ecrecover?: (
    msgHash: Uint8Array,
    v: bigint,
    r: Uint8Array,
    s: Uint8Array,
    chainId?: bigint,
  ) => Uint8Array
  sha256?: (msg: Uint8Array) => Uint8Array
  ecsign?: (msg: Uint8Array, pk: Uint8Array, chainId?: bigint) => ECDSASignature
  ecdsaSign?: (msg: Uint8Array, pk: Uint8Array) => { signature: Uint8Array; recid: number }
  ecdsaRecover?: (sig: Uint8Array, recId: number, hash: Uint8Array) => Uint8Array
  kzg?: Kzg
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
  /**
   * Optionally pass in an EIP params dictionary, see one of the
   * EthereumJS library `params.ts` files for an example (e.g. tx, evm).
   * By default parameters are set by the respective library, so this
   * is only relevant if you want to use EthereumJS libraries with a
   * custom parameter set.
   *
   * Example Format:
   *
   * ```ts
   * {
   *   1559: {
   *     initialBaseFee: 1000000000,
   *   }
   * }
   * ```
   */
  params?: ParamsDict
  /**
   * This option can be used to replace the most common crypto primitives
   * (keccak256 hashing e.g.) within the EthereumJS ecosystem libraries
   * with alternative implementations (e.g. more performant WASM libraries).
   *
   * Note: please be aware that this is adding new dependencies for your
   * system setup to be used for sensitive/core parts of the functionality
   * and a choice on the libraries to add should be handled with care
   * and be made with eventual security implications considered.
   */
  customCrypto?: CustomCrypto
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

export interface HardforkByOpts {
  blockNumber?: BigIntLike
  timestamp?: BigIntLike
  td?: BigIntLike
}

export type EIPConfig = {
  minimumHardfork: Hardfork
  requiredEIPs?: number[]
}

export type ParamsConfig = {
  [key: string]: number | string | null
}

export type HardforkConfig = {
  eips?: number[]
  consensus?: ConsensusConfig
  params?: ParamsConfig
}

export type EIPsDict = {
  [key: string]: EIPConfig
}

export type ParamsDict = {
  [key: string]: ParamsConfig
}

export type HardforksDict = {
  [key: string]: HardforkConfig
}
