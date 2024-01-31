import * as kzg from 'c-kzg'
import { Common, Chain, Hardfork } from '@ethereumjs/common'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Cancun })
common.initializeKZG(kzg)
console.log(common.customCrypto.kzg) // Should print the initialized KZG interface
