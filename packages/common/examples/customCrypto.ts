import { createBlock } from '@ethereumjs/block'
import { Chain, Common } from '@ethereumjs/common'
import { keccak256, waitReady } from '@polkadot/wasm-crypto'

const main = async () => {
  // @polkadot/wasm-crypto specific initialization
  await waitReady()

  const common = new Common({ chain: Chain.Mainnet, customCrypto: { keccak256 } })
  const block = createBlock({}, { common })

  // Method invocations within EthereumJS library instantiations where the common
  // instance above is passed will now use the custom keccak256 implementation
  console.log(block.hash())
}

void main()
