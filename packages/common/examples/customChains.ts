import { Common } from '@ethereumjs/common'

import myCustomChain1 from './genesisData/testnet.json'
import myCustomChain2 from './genesisData/testnet2.json'
// Add two custom chains, initial mainnet activation
const common1 = new Common({ chain: 'mainnet', customChains: [myCustomChain1, myCustomChain2] })
console.log(`Common is instantiated with mainnet parameters - ${common1.chainName()}`)
common1.setChain('testnet1')
console.log(`Common is set to use testnet parameters - ${common1.chainName()}`)
// Add two custom chains, activate customChain1
const common2 = new Common({
  chain: 'testnet2',
  customChains: [myCustomChain1, myCustomChain2],
})

console.log(`Common is instantiated with testnet2 parameters - ${common1.chainName()}`)
