import type { ChainConfig } from '@ethereumjs/common'

export const testnetMergeChainConfig: ChainConfig = {
  name: 'testnetMerge',
  chainId: 55555,
  defaultHardfork: 'istanbul',
  consensus: {
    type: 'poa',
    algorithm: 'clique',
    clique: {
      period: 15,
      epoch: 30000,
    },
  },
  comment: 'Private test network',
  url: '[TESTNET_URL]',
  genesis: {
    gasLimit: 1000000,
    difficulty: 1,
    nonce: '0xbb00000000000000',
    extraData:
      '0xcc000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  },
  hardforks: [
    {
      name: 'chainstart',
      block: 0,
    },
    {
      name: 'homestead',
      block: 1,
    },
    {
      name: 'tangerineWhistle',
      block: 2,
    },
    {
      name: 'spuriousDragon',
      block: 3,
    },
    {
      name: 'istanbul',
      block: 8,
    },
    {
      name: 'muirGlacier',
      block: 10,
    },
    {
      name: 'berlin',
      block: 12,
    },
    {
      name: 'london',
      block: 14,
    },
    {
      name: 'paris',
      block: 15,
    },
    {
      name: 'shanghai',
      block: null,
    },
  ],
  bootstrapNodes: [
    {
      ip: '10.0.0.1',
      port: 30303,
      id: '11000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      location: '',
      comment: '',
    },
    {
      ip: '10.0.0.2',
      port: 30303,
      id: '22000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      location: '',
      comment: '',
    },
  ],
}
