import { blockFromRpc } from '@ethereumjs/block/dist/from-rpc'
import { Trie } from '@ethereumjs/trie'
import {
  Account,
  arrToBufArr,
  bigIntToHex,
  bufferToBigInt,
  bufferToHex,
  intToHex,
  isHexPrefixed,
  toBuffer,
} from '@ethereumjs/util'
import { debug } from 'debug'
import { keccak256 } from 'ethereum-cryptography/keccak'

import { Cache } from './cache'

import { BaseStateManager } from '.'

import type { Proof, StateManager } from '.'
import type { StorageDump } from './interface'
import type { StorageProof } from './stateManager'
import type { Common } from '@ethereumjs/common'
import type { Address, PrefixedHexString } from '@ethereumjs/util'
import type { JsonRpcProvider } from '@ethersproject/providers'

const log = debug('statemanager')
export interface EthersStateManagerOpts {
  provider: JsonRpcProvider
  blockTag?: bigint | string
}

export class EthersStateManager extends BaseStateManager implements StateManager {
  private provider: JsonRpcProvider
  private contractCache: Map<string, Buffer>
  private storageCache: Map<string, Buffer>
  private blockTag: string
  private root: Buffer | undefined
  private trie: Trie

  constructor(opts: EthersStateManagerOpts) {
    super({})
    this.trie = new Trie({ useKeyHashing: true })
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
      putCb: async (keyBuf, accountRlp) => {
        await this.trie.put(keyBuf, accountRlp)
      },
      deleteCb: async (keyBuf) => {
        await this.trie.del(keyBuf)
      },
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
    storage = await this.provider.getStorageAt(
      address.toString(),
      bufferToBigInt(key),
      this.blockTag
    )
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
    return new EthersStateManager({ provider: this.provider })
  }

  dumpStorage(_address: Address): Promise<StorageDump> {
    throw new Error('Method not implemented.')
  }

  async accountExists(address: Address): Promise<boolean> {
    log(`Verify if ${address.toString()} exists`)
    const account = this._cache.get(address)
    if (account.isEmpty()) {
      // Get latest block (or block specified in `this.blockTag`)
      const block = await this.provider.send('eth_getBlockByNumber', [this.blockTag, false])
      // Get merkle proof for `address` from provider
      const proof = await this.provider.send('eth_getProof', [address.toString(), [], block.number])
      const proofBuf = proof.accountProof.map((proofNode: string) => toBuffer(proofNode))
      const trie = new Trie({ useKeyHashing: true })
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
    log(`Retrieving account data for ${address.toString()} from provider`)

    const accountData = await this.provider.send('eth_getProof', [
      address.toString(),
      [],
      this.blockTag,
    ])
    const rawData = accountData.accountProof
    for (const proofItem of rawData) {
      // Dump raw proof nodes to DB under their hashed keys
      const dataBuffer = Buffer.from(proofItem.slice(2), 'hex')
      const hash = keccak256(dataBuffer)
      await (this.trie as any)._db.put(arrToBufArr(hash), dataBuffer)
    }

    const account = Account.fromAccountData({
      balance: BigInt(accountData.balance),
      nonce: BigInt(accountData.nonce),
      codeHash: toBuffer(accountData.codeHash),
      storageRoot: accountData.storageHash,
    })
    return account
  }

  async putAccount(address: Address, account: Account): Promise<void> {
    this._cache.put(address, account, false)
  }

  async getContractCode(address: Address): Promise<Buffer> {
    const code = await this.provider.getCode(address.toString(), this.blockTag)
    const codeBuffer = toBuffer(code)
    this.contractCache.set(address.toString(), codeBuffer)
    return codeBuffer
  }

  clearContractStorage(_address: Address): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async getStateRoot(): Promise<Buffer> {
    await this._cache.flush()
    return this.trie.root()
  }

  async setStateRoot(_stateRoot: Buffer): Promise<void> {
    this._cache.flush
    this.trie.root(_stateRoot)
  }
  hasStateRoot(_root: Buffer): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  async getProof(address: Address, storageSlots: Buffer[] = []): Promise<Proof> {
    const account = await this.getAccount(address)
    const accountProof: PrefixedHexString[] = (await this.trie.createProof(address.buf)).map((p) =>
      bufferToHex(p)
    )
    const storageProof: StorageProof[] = []
    const storageTrie = await this._lookupStorageTrie(address)

    for (const storageKey of storageSlots) {
      const proof = (await storageTrie.createProof(storageKey)).map((p) => bufferToHex(p))
      let value = bufferToHex(await this.getContractStorage(address, storageKey))
      if (value === '0x') {
        value = '0x0'
      }
      const proofItem: StorageProof = {
        key: bufferToHex(storageKey),
        value,
        proof,
      }
      storageProof.push(proofItem)
    }

    const returnValue: Proof = {
      address: address.toString(),
      balance: bigIntToHex(account.balance),
      codeHash: bufferToHex(account.codeHash),
      nonce: bigIntToHex(account.nonce),
      storageHash: bufferToHex(account.storageRoot),
      accountProof,
      storageProof: [],
    }
    return returnValue
  }

  /**
   * Retrieves a block from the provider to use in the VM
   * @param blockTag block hash or block number to be run
   * @param common Common instance used in VM
   * @returns the block specified by `blockTag`
   */
  getBlockFromProvider = async (blockTag: string | bigint, common: Common) => {
    let blockData
    if (typeof blockTag === 'bigint') {
      blockData = await this.provider.send('eth_getBlockByNumber', [bigIntToHex(blockTag), true])
    } else if (isHexPrefixed(blockTag)) {
      blockData = await this.provider.send('eth_getBlockByHash', [blockTag, true])
    }
    const uncleHeaders = []
    if (blockData.uncles.length > 0) {
      for (let x = 0; x < blockData.uncles.length; x++) {
        const headerData = await this.provider.send('eth_getUncleByBlockHashAndIndex', [
          blockData.hash,
          intToHex(x),
        ])
        uncleHeaders.push(headerData)
      }
    }

    return blockFromRpc(blockData, uncleHeaders, { common, hardforkByBlockNumber: true })
  }

  /**
   * Creates a storage trie from the primary storage trie
   * for an account and saves this in the storage cache.
   * @private
   */
  async _lookupStorageTrie(address: Address): Promise<Trie> {
    // from state trie
    const account = await this.getAccount(address)
    const storageTrie = this.trie.copy(false)
    storageTrie.root(account.storageRoot)
    storageTrie.flushCheckpoints()
    return storageTrie
  }
}
