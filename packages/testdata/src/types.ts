/**
 * Local type definitions for testdata package
 * These are minimal types that avoid circular dependencies with @ethereumjs/block and @ethereumjs/common
 */

export interface BlockData {
  header?: {
    parentHash?: string
    uncleHash?: string
    coinbase?: string
    stateRoot?: string
    transactionsTrie?: string
    receiptTrie?: string
    logsBloom?: string
    difficulty?: string
    number?: string
    gasLimit?: string
    gasUsed?: string
    timestamp?: string
    extraData?: string
    mixHash?: string
    nonce?: string
    baseFeePerGas?: string
    withdrawalsRoot?: string
    blobGasUsed?: string
    excessBlobGas?: string
    parentBeaconBlockRoot?: string
    requestsHash?: string
  }
  transactions?: any[]
  uncleHeaders?: any[]
  withdrawals?: any[]
  executionWitness?: any
}

export type PrefixedHexString = string

/**
 * Local copy of ChainConfig and related interfaces to avoid circular dependency with @ethereumjs/common
 */
export interface ChainConfig {
  name: string
  chainId: number | string
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
  requestsHash?: PrefixedHexString
}

export interface HardforkTransitionConfig {
  name: string
  block: number | null
  timestamp?: number | string
  forkHash?: PrefixedHexString | null
  ttd?: number | null
}

export interface HardforksDict {
  [key: string]: HardforkTransitionConfig
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

export type ConsensusType = 'pow' | 'poa' | 'casper'
export type ConsensusAlgorithm = 'ethash' | 'clique' | 'casper'

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

/**
 * Local copy of GethGenesis interface to avoid circular dependency with @ethereumjs/common
 */
export interface GethGenesisConfig {
  chainId: number
  depositContractAddress?: string
  homesteadBlock?: number
  daoForkBlock?: number
  daoForkSupport?: boolean
  eip150Block?: number
  eip150Hash?: string
  eip155Block?: number
  eip158Block?: number
  byzantiumBlock?: number
  constantinopleBlock?: number
  petersburgBlock?: number
  istanbulBlock?: number
  muirGlacierBlock?: number
  berlinBlock?: number
  londonBlock?: number
  mergeForkBlock?: number
  cancunBlock?: number
  arrowGlacierBlock?: number
  grayGlacierBlock?: number
  mergeNetsplitBlock?: number
  shanghaiTime?: number
  cancunTime?: number
  pragueTime?: number
  verkleTime?: number
  terminalTotalDifficulty?: number
  terminalTotalDifficultyPassed?: boolean
  ethash?: {}
  clique?: {
    period?: number
    epoch?: number
    blockperiodseconds?: number
    epochlength?: number
  }
  trustedCheckpoint?: {
    sectionIndex: number
    sectionHead: string
    chtRoot: string
    bloomRoot: string
  }
  trustedCheckpointOracle?: {
    address: string
    signers: string[]
    threshold: number
  }
  blobSchedule?: GethGenesisBlobSchedule
  proofInBlocks?: boolean
}

export interface GethGenesisAlloc {
  [address: string]: {
    balance: string
    code?: string
    storage?: { [key: string]: string }
    nonce?: string
  }
}

export interface GethGenesisBlobSchedule {
  [fork: string]: {
    target?: number
    max?: number
    baseFeeUpdateFraction?: number
  }
}

export interface GethGenesis {
  config: GethGenesisConfig
  name?: string
  excessBlobGas?: string
  requestsHash?: string
  nonce: string
  timestamp: string
  extraData?: string
  gasLimit: PrefixedHexString
  difficulty?: PrefixedHexString
  mixHash?: PrefixedHexString
  coinbase?: PrefixedHexString
  alloc: GethGenesisAlloc
  number?: PrefixedHexString
  gasUsed?: PrefixedHexString
  parentHash?: PrefixedHexString
  baseFeePerGas?: PrefixedHexString | number | null
}
