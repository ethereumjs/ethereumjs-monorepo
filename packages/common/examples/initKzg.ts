import { initKZG } from 'kzg-wasm'
import { Common, Chain, Hardfork } from '@ethereumjs/common'

const main = async () => {
  const kzg = await initKZG()
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg: kzg },
  })
  console.log(common.customCrypto.kzg) // Should print the initialized KZG interface
}

main()
