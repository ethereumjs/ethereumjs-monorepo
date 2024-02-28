import { createKZG } from 'kzg-wasm'
import { Common, Chain, Hardfork } from '@ethereumjs/common'
import { createKZG } from '@ethereumjs/util'

const main = async () => {
  const kzg = await createKZG()
  createKZG(kzg, '')
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg: kzg },
  })
  console.log(common.customCrypto.kzg) // Should print the initialized KZG interface
}

main()
