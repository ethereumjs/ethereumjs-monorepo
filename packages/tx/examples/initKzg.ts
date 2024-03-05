import { createKZG } from 'kzg-wasm'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { initKZG } from '@ethereumjs/util'

const main = async () => {
  const kzg = await createKZG()
  initKZG(kzg)

  // Instantiate `common`
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg },
  })

  console.log(common.customCrypto.kzg) // should output the KZG API as an object
}

main()
