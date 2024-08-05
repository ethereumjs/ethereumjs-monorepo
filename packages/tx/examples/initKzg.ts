import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { loadKZG } from 'kzg-wasm'

const main = async () => {
  const kzg = await loadKZG()

  // Instantiate `common`
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg },
  })

  console.log(common.customCrypto.kzg) // should output the KZG API as an object
}

void main()
