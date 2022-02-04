import { Chain } from '@ethereumjs/common'
import { Hardfork as HardforkName } from '@ethereumjs/common/src'

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

const genesis: GenesisBlock = {
  hash: '0x7b66506a9ebdbf30d32b43c5f15a3b1216269a1ec3a75aa3182b86176a2b1ca7',
  timestamp: '0x5ce28211',
  gasLimit: 21_000,
  difficulty: 0,
  nonce: '0x0000000000000000',
  extraData: '0x',
  stateRoot: '0x1784d1c465e9a4c39cc58b1df8d42f2669b00b1badd231a7c4679378b9d91330',
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

const hardfork: Hardfork = {
  name: '',
  block: null,
  forkHash: '',
}
const node: BootstrapNode = {
  ip: '',
  port: '',
  id: '',
  location: '',
  comment: '',
}

export const mumbaiData = {
  name: 'mumbai',
  chainId: 80001,
  networkId: 80001,
  defaultHardfork: 'london',
  comment: '',
  url: '',
  genesis,
  consensus: {
    type: 'pos',
    algorithm: '',
  },
  hardforks: [hardfork],
  bootstrapNodes: [node],
}
