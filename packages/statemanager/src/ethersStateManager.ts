import { Account, Address, toBuffer, toType, TypeOutput } from '@ethereumjs/util'
import { BaseStateManager, StateManager } from '.'
import { StorageDump } from './interface'
import { JsonRpcProvider } from '@ethersproject/providers'

import { keccak256 } from 'ethereum-cryptography/keccak'
import { Common } from '@ethereumjs/common'
import { Cache } from './cache'

export interface EthersStateManagerOpts {
  common?: Common
  provider: JsonRpcProvider
}

export class EthersStateManager extends BaseStateManager implements StateManager {
  private provider: JsonRpcProvider
  private contractCache: Map<string, Buffer>
  private storageCache: Map<string, string>

  constructor(opts: EthersStateManagerOpts) {
    super({ common: opts.common })
    this.provider = opts.provider
    this.contractCache = new Map()
    this.storageCache = new Map()
    this._cache = new Cache({
      getCb: (address) => this.getAccountFromProvider(address),
      putCb: (_address, _account) => Promise.resolve(),
      deleteCb: (_address) => Promise.resolve(),
    })
  }

  async putContractCode(address: Address, value: Buffer): Promise<void> {
    // Store contract code in the cache
    this.contractCache.set(address.toString(), value)
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
    let account = this._cache.get(address)
    if (account.isEmpty()) {
      account = await this.getAccountFromProvider(address)
      if (account.isEmpty()) return false
    }
    return true
  }

  async getAccount(address: Address): Promise<Account> {
    const account = await this._cache.getOrLoad(address)
    return account
  }
  async getAccountFromProvider(address: Address): Promise<Account> {
    const balance = await this.provider.getBalance(address.toString())
    const nonce = await this.provider.getTransactionCount(address.toString())
    const codeHash = keccak256(toBuffer(await this.provider.getCode(address.toString())))
    const account = Account.fromAccountData({
      balance: balance.toBigInt(),
      nonce: nonce,
      codeHash: codeHash,
    })
    return account
  }

  async putAccount(address: Address, account: Account): Promise<void> {
    this._cache.put(address, account, false)
  }

  async getContractCode(address: Address): Promise<Buffer> {
    const code = await this.provider.getCode(address.toString())
    const codeBuffer = toBuffer(code)
    this.contractCache.set(address.toString(), codeBuffer)
    return codeBuffer
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
