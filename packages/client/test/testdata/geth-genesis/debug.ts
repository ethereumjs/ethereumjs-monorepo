import type { GethGenesis } from '@ethereumjs/common'

export const debugData: GethGenesis = {
  config: {
    chainId: 1,
    homesteadBlock: 0,
    eip150Block: 0,
    eip155Block: 0,
    eip158Block: 0,
    byzantiumBlock: 0,
    constantinopleBlock: 0,
    petersburgBlock: 0,
    istanbulBlock: 0,
    muirGlacierBlock: 0,
    berlinBlock: 0,
    londonBlock: 0,
    clique: {
      period: 5,
      epoch: 30000,
    },
    terminalTotalDifficulty: 0,
    terminalTotalDifficultyPassed: true,
  },
  nonce: '0x42',
  timestamp: '0x0',
  extraData:
    '0x0000000000000000000000000000000000000000000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  gasLimit: '0x1C9C380',
  difficulty: '0x400000000',
  mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  coinbase: '0x0000000000000000000000000000000000000000',
  alloc: {
    '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b': {
      balance: '0x6d6172697573766477000000',
    },
    '0xcde098d93535445768e8a2345a2f869139f45641': {
      balance: '0x6d6172697573766477000000',
    },
  },
  number: '0x0',
  gasUsed: '0x0',
  parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  baseFeePerGas: '0x7',
}
