import { RPCStateManager, RPCBlockChain } from '@ethereumjs/statemanager'
import { EVM } from '@ethereumjs/evm'

const main = async () => {
  const provider = 'https://path.to.my.provider.com'
  const blockchain = new RPCBlockChain(provider)
  const blockTag = 1n
  const state = new RPCStateManager({ provider, blockTag })
  const evm = new EVM({ blockchain, stateManager: state })
}
main()
