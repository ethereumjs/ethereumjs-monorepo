import { createEVM } from '@ethereumjs/evm'
import { RPCBlockChain, RPCStateManager } from '@ethereumjs/statemanager'

const main = async () => {
  try {
    const provider = 'https://path.to.my.provider.com'
    const blockchain = new RPCBlockChain(provider)
    const blockTag = 1n
    const state = new RPCStateManager({ provider, blockTag })
    const evm = await createEVM({ blockchain, stateManager: state }) // note that evm is ready to run BLOCKHASH opcodes (over RPC)
  } catch (e) {
    console.log(e.message) // fetch would fail because provider url is not real. please replace provider with a valid rpc url string.
  }
}
void main()
