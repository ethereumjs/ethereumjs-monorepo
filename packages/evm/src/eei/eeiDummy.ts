import { Address, bigIntToBuffer, setLengthLeft } from '@ethereumjs/util'

import { StateDummy } from './stateDummy'

import type { EEIInterface } from '../types'

function bigIntToAddress(address: bigint): Address {
  return new Address(setLengthLeft(bigIntToBuffer(address), 20))
}

export class EEIDummy extends StateDummy implements EEIInterface {
  constructor() {
    super()
  }

  async getExternalBalance(address: Address): Promise<bigint> {
    const account = await this.getAccount(address)
    return account.balance
  }
  async getExternalCodeSize(address: bigint): Promise<bigint> {
    const code = await this.getContractCode(bigIntToAddress(address))
    return BigInt(code.length)
  }
  async getExternalCode(address: bigint): Promise<Buffer> {
    return await this.getContractCode(bigIntToAddress(address))
  }
  async getBlockHash(_num: bigint): Promise<bigint> {
    return BigInt(0)
  }
  async storageStore(address: Address, key: Buffer, value: Buffer): Promise<void> {
    await this.putContractStorage(address, key, value)
  }
  async storageLoad(address: Address, key: Buffer, original: boolean): Promise<Buffer> {
    if (original) {
      return await this.getOriginalContractStorage(address, key)
    } else {
      return await this.getContractStorage(address, key)
    }
  }
  async isAccountEmpty(address: Address): Promise<boolean> {
    return await this.accountIsEmpty(address)
  }
  copy(): EEIInterface {
    return new EEIDummy()
  }
}
