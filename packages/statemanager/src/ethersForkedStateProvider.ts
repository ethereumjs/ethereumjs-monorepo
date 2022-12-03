import ethers from 'ethers'
import { EthersStateManager } from '.'
export class EthersForkedStateProvider extends ethers.providers.JsonRpcProvider {
  private fallbackProvider: ethers.providers.JsonRpcProvider
  private ethersStateManager: EthersStateManager
  constructor(provider: string | ethers.providers.JsonRpcProvider) {
    super(typeof provider === 'string' ? provider : provider.connection)
    this.fallbackProvider =
      typeof provider === 'string' ? new ethers.providers.JsonRpcProvider(provider) : provider
    this.ethersStateManager = new EthersStateManager({ blockTag: 'earliest', provider })
  }
}
