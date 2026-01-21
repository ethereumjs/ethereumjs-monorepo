import type { ChainConfig } from '@ethereumjs/common'

/**
 * Chain config for testing merge scenarios with most hardforks at block 0 and Paris at block 3.
 * Used for testing merge-related functionality in the client package.
 */
export const mergeTestnetChainConfig: ChainConfig = {
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
      '0xcc000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  },
  hardforks: [
    {
      name: 'chainstart',
      block: 0,
    },
    {
      name: 'homestead',
      block: 0,
    },
    {
      name: 'tangerineWhistle',
      block: 0,
    },
    {
      name: 'spuriousDragon',
      block: 0,
    },
    {
      name: 'byzantium',
      block: 0,
    },
    {
      name: 'constantinople',
      block: 0,
    },
    {
      name: 'berlin',
      block: 0,
    },
    {
      name: 'london',
      block: 0,
    },
    {
      name: 'paris',
      block: 3,
    },
    {
      name: 'mergeNetsplitBlock',
      block: 3,
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
