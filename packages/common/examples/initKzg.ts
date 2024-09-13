import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { loadKZG } from 'kzg-wasm'

const main = async () => {
  const kzg = await loadKZG()
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg },
  })
  console.log(common.customCrypto.kzg) // Should print the initialized KZG interface
}

void main()
