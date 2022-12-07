import { Address, bufferToHex, toBuffer } from '@ethereumjs/util'
import { BigNumber, ethers } from 'ethers'

import { EthersStateManager } from '.'

import type { Account } from '@ethereumjs/util'

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
    try {
      const result = await this.ethersStateManager.getContractCode(address)
      return bufferToHex(result)
    } catch {
      return this.fallbackProvider.getCode(addressOrName)
    }
  }
  async getStorageAt(
    addressOrName: string | Promise<string>,
    position: string | number | bigint | Buffer,
    blockTag?: ethers.providers.BlockTag
  ): Promise<string> {
    const state = this.ethersStateManager.copy()
    blockTag !== undefined && state.setBlockTag(BigInt(blockTag))
    const address = new Address(toBuffer(await addressOrName))
    const key = toBuffer(position)
    try {
      const result = await state.getContractStorage(address, key)
      return bufferToHex(result)
    } catch {
      return this.fallbackProvider.getStorageAt(addressOrName, position, blockTag)
    }
  }

  async getAccount(address: Address): Promise<Account> {
    return this.ethersStateManager.getAccount(address)
  }

  async getBalance(
    addressOrName: string | Promise<string>,
    blockTag?: ethers.providers.BlockTag
  ): Promise<BigNumber> {
    blockTag === undefined
      ? this.ethersStateManager.setBlockTag(BigInt(await this.getBlockNumber()))
      : this.ethersStateManager.setBlockTag(BigInt(blockTag))
    const _address = new Address(toBuffer(await this._getAddress(addressOrName)))
    try {
      const account = await this.ethersStateManager.getAccount(_address)
      const balance = account.balance
      return BigNumber.from(balance)
    } catch {
      return this.fallbackProvider.getBalance(addressOrName, blockTag)
    }
  }

  async getTransactionCount(
    addressOrName: string | Promise<string>,
    blockTag?: ethers.providers.BlockTag
  ): Promise<number> {
    blockTag === undefined
      ? this.ethersStateManager.setBlockTag(BigInt(await this.getBlockNumber()))
      : this.ethersStateManager.setBlockTag(BigInt(blockTag))
    const _address = new Address(toBuffer(await this._getAddress(addressOrName)))
    try {
      const account = await this.ethersStateManager.getAccount(_address)
      const nonce = account.nonce
      return Number(nonce)
    } catch {
      return this.fallbackProvider.getTransactionCount(addressOrName, blockTag)
    }
  }
}
