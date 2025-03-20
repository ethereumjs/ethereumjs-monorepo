import type { ChainConfig } from '../../src/types.ts'

export const testnetData: ChainConfig = {
  name: 'testnet',
  chainId: 12345,
  defaultHardfork: 'byzantium',
  consensus: {
    type: 'pow',
    algorithm: 'ethash',
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
      name: 'byzantium',
      block: 4,
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
