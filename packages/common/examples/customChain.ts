import { Mainnet, createCustomCommon } from '@ethereumjs/common'
import { customChainConfig } from '@ethereumjs/testdata'

// Add custom chain config
const common1 = createCustomCommon(customChainConfig, Mainnet)
console.log(`Common is instantiated with custom chain parameters - ${common1.chainName()}`)
