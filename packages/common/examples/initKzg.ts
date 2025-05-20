import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg'

const main = async () => {
  const kzg = new microEthKZG(trustedSetup)
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg },
  })
  console.log(common.customCrypto.kzg) // Should print the initialized KZG interface
}

void main()
