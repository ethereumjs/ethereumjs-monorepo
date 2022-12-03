import { Address, bufferToHex, toBuffer } from '@ethereumjs/util'
import { ethers } from 'ethers'

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
  async getCode(addressOrName: string | Promise<string>): Promise<string> {
    const address = new Address(toBuffer(await addressOrName))
    const result = await this.ethersStateManager.getContractCode(address)
    if (result.length > 0) {
      return bufferToHex(result)
    } else {
      return this.fallbackProvider.getCode(addressOrName)
    }
  }
}
