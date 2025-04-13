import type { GethGenesis } from '@ethereumjs/common'

export const invalidSpuriousDragonGethGenesis: GethGenesis = {
  config: {
    chainId: 5,
    homesteadBlock: 0,
    daoForkSupport: true,
    eip150Block: 0,
    eip150Hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    eip155Block: 0,
    eip158Block: 1,
    byzantiumBlock: 2,
    constantinopleBlock: 3,
    petersburgBlock: 4,
    istanbulBlock: 5,
    berlinBlock: 6,
    londonBlock: 7,
    clique: {
      period: 15,
      epoch: 30000,
    },
  },
  nonce: '0x0',
  timestamp: '0x5c51a607',
  extraData:
    '0x22466c6578692069732061207468696e6722202d204166726900000000000000e0a2bd4258d2768837baa26a28fe71dc079f84c70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  gasLimit: '0xa00000',
  difficulty: '0x1',
  mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  coinbase: '0x0000000000000000000000000000000000000000',
  number: '0x0',
  gasUsed: '0x0',
  parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  baseFeePerGas: null,
} as GethGenesis
