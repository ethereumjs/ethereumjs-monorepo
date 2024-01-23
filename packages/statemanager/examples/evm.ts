import { RPCStateManager, RPCBlockChain } from '@ethereumjs/statemanager'
import { EVM } from '@ethereumjs/evm'

const main = async () => {
  try {
    const provider = 'https://path.to.my.provider.com'
    const blockchain = new RPCBlockChain(provider)
    const blockTag = 1n
    const state = new RPCStateManager({ provider, blockTag })
    const evm = new EVM({ blockchain, stateManager: state })
  } catch (e) {
    console.log(e.message) // fetch would fail because provider url is not real. please replace provider with a valid rpc url string.
  }
}
main()
