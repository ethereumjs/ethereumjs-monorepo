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
    this.ethersStateManager = new EthersStateManager({ blockTag: 1n, provider })
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
  async getStorageAt(
    addressOrName: string | Promise<string>,
    position: string | number | bigint | Buffer
  ): Promise<string> {
    const address = new Address(toBuffer(await addressOrName))
    const key = toBuffer(position)
    const result = await this.ethersStateManager.getContractStorage(address, key)
    if (result.length > 0) {
      return bufferToHex(result)
    } else {
      return this.fallbackProvider.getStorageAt(addressOrName, position)
    }
  }

  async getAccount(address: Address | string): Promise<string> {
    const _address = typeof address === 'string' ? new Address(toBuffer(address)) : address
    const result = await this.ethersStateManager.getAccount(_address)
    return bufferToHex(result.serialize())
  }
}
