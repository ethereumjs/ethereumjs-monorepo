import {
  Account,
  Address,
  bigIntToHex,
  bufferToBigInt,
  bufferToHex,
  toBuffer,
} from '@ethereumjs/util'
import { BaseStateManager, StateManager } from '.'
import { StorageDump } from './interface'
import { JsonRpcProvider } from '@ethersproject/providers'

import { Common } from '@ethereumjs/common'
import { Cache } from './cache'
import { SecureTrie } from '@ethereumjs/trie'
import { debug } from 'debug'
import { keccak256 } from 'ethereum-cryptography/keccak'

const log = debug('statemanager')
export interface EthersStateManagerOpts {
  common?: Common
  provider: JsonRpcProvider
  blockTag?: bigint | string
}

export class EthersStateManager extends BaseStateManager implements StateManager {
  private provider: JsonRpcProvider
  private contractCache: Map<string, Buffer>
  private storageCache: Map<string, Buffer>
  private blockTag: string
  private root: Buffer | undefined

  constructor(opts: EthersStateManagerOpts) {
    super({ common: opts.common })
    this.provider = opts.provider
    if (typeof opts.blockTag === 'bigint') {
      this.blockTag = bigIntToHex(opts.blockTag)
    } else {
      this.blockTag = opts.blockTag ?? 'latest'
    }

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
    const slotCacheKey = `${address.toString()}--0x${key.toString('hex')}`
    // Check storage slot in cache
    let storage: Buffer | string | undefined = this.storageCache.get(slotCacheKey)
    if (typeof storage !== 'undefined') return storage
    // Retrieve storage slot from provider if not found in cache
    storage = await this.provider.getStorageAt(address.toString(), bufferToBigInt(key))
    const value = toBuffer(storage)
    // Cache retrieved storage slot
    await this.putContractStorage(address, key, value)
    return value
  }

  async putContractStorage(address: Address, key: Buffer, value: Buffer): Promise<void> {
    // Set value in storageCache with `[address]--[hexKey]` formatted key
    this.storageCache.set(`${address.toString()}--${bufferToHex(key)}`, value)
  }

  copy(): EthersStateManager {
    return new EthersStateManager({ common: this._common.copy(), provider: this.provider })
  }

  dumpStorage(_address: Address): Promise<StorageDump> {
    throw new Error('Method not implemented.')
  }

  async accountExists(address: Address): Promise<boolean> {
    log(`seeing if ${address.toString()} exists`)
    const account = this._cache.get(address)
    if (account.isEmpty()) {
      // Get latest block (or block specified in `this.blockTag`)
      const block = await this.provider.send('eth_getBlockByNumber', [this.blockTag, false])
      // Get merkle proof for `address` from provider
      const proof = await this.provider.send('eth_getProof', [address.toString(), [], block.number])
      const proofBuf = proof.accountProof.map((proofNode: string) => toBuffer(proofNode))
      const trie = new SecureTrie()
      const verified = await trie.verifyProof(toBuffer(block.stateRoot), address.buf, proofBuf)
      // if not verified (i.e. verifyProof returns null), account does not exist
      if (verified === null) return false
    }
    return true
  }

  async getAccount(address: Address): Promise<Account> {
    const account = await this._cache.getOrLoad(address)
    return account
  }
  async getAccountFromProvider(address: Address): Promise<Account> {
    log(`getting account data for ${address.toString()}`)
    let accountData
    try {
      accountData = await this.provider.send('eth_getProof', [
        address.toString(),
        [],
        this.blockTag,
      ])
    } catch (e) {
      accountData.balance = await this.provider.getBalance(address.toString(), this.blockTag)
      accountData.nonce = await this.provider.getTransactionCount(address.toString(), this.blockTag)
      accountData.codeHash = keccak256(
        toBuffer(await this.provider.getCode(address.toString(), this.blockTag))
      )
    }
    const account = Account.fromAccountData({
      balance: BigInt(accountData.balance),
      nonce: BigInt(accountData.nonce),
      codeHash: toBuffer(accountData.codeHash),
      stateRoot: await this.getStateRoot(),
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

  async getStateRoot(): Promise<Buffer> {
    if (this.blockTag === 'latest') {
      const block = await this.provider.send('eth_getBlockByNumber', [this.blockTag, false])
      return toBuffer(block.stateRoot)
    }
    if (typeof this.root === 'undefined') {
      this.root = toBuffer(
        (await this.provider.send('eth_getBlockByNumber', [this.blockTag, false])).stateRoot
      )
    }
    return this.root
  }

  setStateRoot(_stateRoot: Buffer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  hasStateRoot(_root: Buffer): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
