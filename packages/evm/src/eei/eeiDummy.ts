import { Address, bigIntToBuffer, setLengthLeft } from '@ethereumjs/util'
import { EEIInterface, VmStateAccess } from '../types'
import { StateDummy } from './stateDummy'

function bigIntToAddress(address: bigint): Address {
  return new Address(setLengthLeft(bigIntToBuffer(address), 20))
}

export class EEIDummy implements EEIInterface {
  state: VmStateAccess

  constructor(state?: VmStateAccess) {
    this.state = state ?? new StateDummy()
  }

  async getExternalBalance(address: Address): Promise<bigint> {
    const account = await this.state.getAccount(address)
    return account.balance
  }
  async getExternalCodeSize(address: bigint): Promise<bigint> {
    const code = await this.state.getContractCode(bigIntToAddress(address))
    return BigInt(code.length)
  }
  async getExternalCode(address: bigint): Promise<Buffer> {
    return await this.state.getContractCode(bigIntToAddress(address))
  }
  async getBlockHash(_num: bigint): Promise<bigint> {
    return BigInt(0)
  }
  async storageStore(address: Address, key: Buffer, value: Buffer): Promise<void> {
    await this.state.putContractStorage(address, key, value)
  }
  async storageLoad(address: Address, key: Buffer, original: boolean): Promise<Buffer> {
    if (original) {
      return await this.state.getOriginalContractStorage(address, key)
    } else {
      return await this.state.getContractStorage(address, key)
    }
  }
  async isAccountEmpty(address: Address): Promise<boolean> {
    return await this.state.accountIsEmpty(address)
  }
  async accountExists(address: Address): Promise<boolean> {
    return await this.state.accountExists(address)
  }
  copy(): EEIInterface {
    return new EEIDummy(this.state)
  }
}
