import { BN } from 'ethereumjs-util'

export interface genesisStatesType {
  names: {
    [key: string]: string
  }
  [key: string]: {}
}

export interface chainsType {
  names: {
    [key: string]: string
  }
  [key: string]: any
}

export interface Chain {
  name: string
  chainId: number | BN
  networkId: number | BN
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
    type: string
    algorithm: string
    clique?: {
      period: number
      epoch: number
    }
    ethash?: any
  }
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
}

export interface Hardfork {
  name: string
  block: number | null
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
