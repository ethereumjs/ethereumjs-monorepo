import { createKZG } from 'kzg-wasm'
import { Common, Chain, Hardfork } from '@ethereumjs/common'
import { initKZG } from '@ethereumjs/util'

const main = async () => {
  const kzg = await createKZG()
  initKZG(kzg)
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg: kzg },
  })
  console.log(common.customCrypto.kzg) // Should print the initialized KZG interface
}

main()
