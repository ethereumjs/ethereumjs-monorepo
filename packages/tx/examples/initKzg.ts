import * as kzg from 'c-kzg'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { initKZG } from '@ethereumjs/util'

// Instantiate KZG
try {
  initKZG(kzg, __dirname + '/../../client/src/trustedSetups/official.txt')
} catch {
  // no-op if already loaded
}
// Instantiate `common`
const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.Cancun,
  customCrypto: { kzg },
})

console.log(common.customCrypto.kzg) // should output the KZG API as an object
