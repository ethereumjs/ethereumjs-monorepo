import * as kzg from 'c-kzg'
import { Chain, Common, Hardfork } from '@ethereumjs/common'

// Instantiate `common`
const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.Cancun,
})
common.initializeKZG(kzg, __dirname + '/../../client/src/trustedSetups/official.txt')

console.log(common.customCrypto.kzg) // should output the KZG API as an object
