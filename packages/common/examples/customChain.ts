import { Common } from '@ethereumjs/common'

import myCustomChain1 from './genesisData/testnet.json'

// Add custom chain config
const common1 = new Common({ chain: myCustomChain1 })
console.log(`Common is instantiated with custom chain parameters - ${common1.chainName()}`)
