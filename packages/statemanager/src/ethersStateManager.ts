import { Account, Address, KECCAK256_NULL, toBuffer, toType, TypeOutput } from '@ethereumjs/util'
import { BaseStateManager, StateManager } from '.'
import { StorageDump } from './interface'
import { JsonRpcProvider } from '@ethersproject/providers'

import { keccak256 } from 'ethereum-cryptography/keccak'
import { Common } from '@ethereumjs/common'

export interface EthersStateManagerOpts {
  common?: Common
  provider: JsonRpcProvider
}

export class EthersStateManager extends BaseStateManager implements StateManager {
  private provider: JsonRpcProvider

  constructor(opts: EthersStateManagerOpts) {
    super({ common: opts.common })
    this.provider = opts.provider
  }

  putContractCode(_address: Address, _value: Buffer): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async getContractStorage(address: Address, key: Buffer): Promise<Buffer> {
    const slot = toType(key, TypeOutput.Number)
    const storage = await this.provider.getStorageAt(address.toString(), slot)
    return toBuffer(storage)
  }

  putContractStorage(_address: Address, _key: Buffer, _value: Buffer): Promise<void> {
    throw new Error('Method not implemented.')
  }

  copy(): EthersStateManager {
    return new EthersStateManager({ common: this._common.copy(), provider: this.provider })
  }

  dumpStorage(_address: Address): Promise<StorageDump> {
    throw new Error('Method not implemented.')
  }
  async accountExists(address: Address): Promise<boolean> {
    const balance = await this.provider.getBalance(address.toString())
    if (balance.gt(0)) {
      // Accounts with a balance must exist
      return true
    }
    const nonce = await this.provider.getTransactionCount(address.toString())
    if (nonce > 0) {
      // Accounts that have sent transactions must exist
      return true
    }
    const code = await this.provider.getCode(address.toString())
    if (!toBuffer(keccak256(toBuffer(code))).equals(KECCAK256_NULL)) {
      // Accounts that have a non-null codeHash must exist
      return true
    }
    const storage = await this.provider.getStorageAt(address.toString(), 0)
    if (parseInt(storage) !== 0) {
      // Accounts that have non-zero storage must exist
      return true
    }

    return false
  }

  async getAccount(address: Address): Promise<Account> {
    const balance = await this.provider.getBalance(address.toString())
    const nonce = await this.provider.getTransactionCount(address.toString())
    const codeHash = keccak256(toBuffer(await this.provider.getCode(address.toString())))
    return Account.fromAccountData({
      balance: balance.toBigInt(),
      nonce: nonce,
      codeHash: codeHash,
    })
  }

  async getContractCode(address: Address): Promise<Buffer> {
    const code = await this.provider.getCode(address.toString())
    return toBuffer(code)
  }

  clearContractStorage(_address: Address): Promise<void> {
    throw new Error('Method not implemented.')
  }
  getStateRoot(): Promise<Buffer> {
    throw new Error('Method not implemented.')
  }
  setStateRoot(_stateRoot: Buffer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  hasStateRoot(_root: Buffer): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
