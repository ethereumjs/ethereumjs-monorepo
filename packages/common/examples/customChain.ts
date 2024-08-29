import { Common, Mainnet, createCustomCommon } from '@ethereumjs/common'

import myCustomChain1 from './genesisData/testnet.json'

// Add custom chain config
const common1 = createCustomCommon(myCustomChain1, Mainnet)
console.log(`Common is instantiated with custom chain parameters - ${common1.chainName()}`)
