import { PrefixedHexString } from 'ethereumjs-util'
import { ConsensusAlgorithm, ConsensusType, Hardfork as HardforkName } from '.'

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
