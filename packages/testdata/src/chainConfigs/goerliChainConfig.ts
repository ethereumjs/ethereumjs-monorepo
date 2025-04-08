import type { ChainConfig } from '@ethereumjs/common'

export const goerliChainConfig: ChainConfig = {
  name: 'goerli',
  chainId: 5,
  defaultHardfork: 'cancun',
  consensus: {
    type: 'poa',
    algorithm: 'clique',
    clique: {
      period: 15,
      epoch: 30000,
    },
  },
  comment: 'Cross-client PoA test network',
  url: 'https://github.com/goerli/testnet',
  genesis: {
    timestamp: '0x5c51a607',
    gasLimit: 10485760,
    difficulty: 1,
    nonce: '0x0000000000000000',
    extraData:
      '0x22466c6578692069732061207468696e6722202d204166726900000000000000e0a2bd4258d2768837baa26a28fe71dc079f84c70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  },
  hardforks: [
    {
      name: 'chainstart',
      block: 0,
      forkHash: '0xa3f5ab08',
    },
    {
      name: 'homestead',
      block: 0,
      forkHash: '0xa3f5ab08',
    },
    {
      name: 'tangerineWhistle',
      block: 0,
      forkHash: '0xa3f5ab08',
    },
    {
      name: 'spuriousDragon',
      block: 0,
      forkHash: '0xa3f5ab08',
    },
    {
      name: 'byzantium',
      block: 0,
      forkHash: '0xa3f5ab08',
    },
    {
      name: 'constantinople',
      block: 0,
      forkHash: '0xa3f5ab08',
    },
    {
      name: 'petersburg',
      block: 0,
      forkHash: '0xa3f5ab08',
    },
    {
      name: 'istanbul',
      block: 1561651,
      forkHash: '0xc25efa5c',
    },
    {
      name: 'berlin',
      block: 4460644,
      forkHash: '0x757a1c47',
    },
    {
      name: 'london',
      block: 5062605,
      forkHash: '0xb8c6299d',
    },
    {
      // The forkHash will remain same as mergeNetsplitBlock is post merge,
      // terminal block: https://goerli.etherscan.io/block/7382818
      name: 'paris',
      block: 7382819,
      forkHash: '0xb8c6299d',
    },
    {
      name: 'mergeNetsplitBlock',
      block: null,
      forkHash: null,
    },
    {
      name: 'shanghai',
      block: null,
      timestamp: '1678832736',
      forkHash: '0xf9843abf',
    },
    {
      name: 'cancun',
      block: null,
      timestamp: '1705473120',
      forkHash: '0x70cc14e2',
    },
  ],
  bootstrapNodes: [
    {
      ip: '51.141.78.53',
      port: 30303,
      id: '011f758e6552d105183b1761c5e2dea0111bc20fd5f6422bc7f91e0fabbec9a6595caf6239b37feb773dddd3f87240d99d859431891e4a642cf2a0a9e6cbb98a',
      location: '',
      comment: 'Upstream bootnode 1',
    },
    {
      ip: '13.93.54.137',
      port: 30303,
      id: '176b9417f511d05b6b2cf3e34b756cf0a7096b3094572a8f6ef4cdcb9d1f9d00683bf0f83347eebdf3b81c3521c2332086d9592802230bf528eaf606a1d9677b',
      location: '',
      comment: 'Upstream bootnode 2',
    },
    {
      ip: '94.237.54.114',
      port: 30313,
      id: '46add44b9f13965f7b9875ac6b85f016f341012d84f975377573800a863526f4da19ae2c620ec73d11591fa9510e992ecc03ad0751f53cc02f7c7ed6d55c7291',
      location: '',
      comment: 'Upstream bootnode 3',
    },
    {
      ip: '18.218.250.66',
      port: 30313,
      id: 'b5948a2d3e9d486c4d75bf32713221c2bd6cf86463302339299bd227dc2e276cd5a1c7ca4f43a0e9122fe9af884efed563bd2a1fd28661f3b5f5ad7bf1de5949',
      location: '',
      comment: 'Upstream bootnode 4',
    },
    {
      ip: '3.11.147.67',
      port: 30303,
      id: 'a61215641fb8714a373c80edbfa0ea8878243193f57c96eeb44d0bc019ef295abd4e044fd619bfc4c59731a73fb79afe84e9ab6da0c743ceb479cbb6d263fa91',
      location: '',
      comment: 'Ethereum Foundation bootnode',
    },
    {
      ip: '51.15.116.226',
      port: 30303,
      id: 'a869b02cec167211fb4815a82941db2e7ed2936fd90e78619c53eb17753fcf0207463e3419c264e2a1dd8786de0df7e68cf99571ab8aeb7c4e51367ef186b1dd',
      location: '',
      comment: 'Goerli Initiative bootnode',
    },
    {
      ip: '51.15.119.157',
      port: 30303,
      id: '807b37ee4816ecf407e9112224494b74dd5933625f655962d892f2f0f02d7fbbb3e2a94cf87a96609526f30c998fd71e93e2f53015c558ffc8b03eceaf30ee33',
      location: '',
      comment: 'Goerli Initiative bootnode',
    },
    {
      ip: '51.15.119.157',
      port: 40303,
      id: 'a59e33ccd2b3e52d578f1fbd70c6f9babda2650f0760d6ff3b37742fdcdfdb3defba5d56d315b40c46b70198c7621e63ffa3f987389c7118634b0fefbbdfa7fd',
      location: '',
      comment: 'Goerli Initiative bootnode',
    },
  ],
  dnsNetworks: [
    'enrtree://AKA3AM6LPBYEUDMVNU3BSVQJ5AD45Y7YPOHJLEF6W26QOE4VTUDPE@all.goerli.ethdisco.net',
  ],
}
