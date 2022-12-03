import ethers from 'ethers'
import { EthersStateManager } from '.'
class EthersForkedStateProvider extends ethers.providers.JsonRpcProvider {
  private ethersStateManager: EthersStateManager
  constructor(provider: string | ethers.providers.JsonRpcProvider) {
    super(typeof provider === 'string' ? provider : provider.connection)
    this.ethersStateManager = new EthersStateManager({ blockTag: 'earliest', provider: provider })
  }
}
