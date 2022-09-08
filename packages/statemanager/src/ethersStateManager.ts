import { blockFromRpc } from '@ethereumjs/block/dist/from-rpc'
import { RLP } from '@ethereumjs/rlp'
import { Trie } from '@ethereumjs/trie'
import {
  Account,
  arrToBufArr,
  bigIntToHex,
  bufferToHex,
  intToHex,
  isHexPrefixed,
  toBuffer,
} from '@ethereumjs/util'
import { JsonRpcProvider } from '@ethersproject/providers'
import { debug } from 'debug'
import { hexToBytes } from 'ethereum-cryptography/utils'

import { Cache } from './cache'

import { BaseStateManager } from '.'

import type { Proof, StateManager } from '.'
import type { StorageDump } from './interface'
import type { StorageProof } from './stateManager'
import type { Common } from '@ethereumjs/common'
import type { Address, PrefixedHexString } from '@ethereumjs/util'

const log = debug('statemanager')

type blockTagType = bigint | 'latest' | 'earliest'
export interface EthersStateManagerOpts {
  provider: string | JsonRpcProvider
  blockTag?: blockTagType
}

export class EthersStateManager extends BaseStateManager implements StateManager {
  private provider: JsonRpcProvider
  private contractCache: Map<string, Buffer>
  private storageTries: { [key: string]: Trie }
  // This map tracks which storage slots for each account have been retrieved from the provider.
  // This ensures that slots retrieved from the provider aren't pulled again and overwrite updates
  // that occur during the course of running EVM message calls.
  private externallyRetrievedStorageKeys: Map<string, Map<string, boolean>>
  private blockTag: string
  private trie: Trie

  constructor(opts: EthersStateManagerOpts) {
    super({})
    // useKeyHashing = true since the web3 api provides proof nodes which are hashed
    // If there were direct api access to devp2p stack, a normal Trie could have been constructed
    this.trie = new Trie({ useKeyHashing: true })
    this.storageTries = {}
    if (typeof opts.provider === 'string') {
      this.provider = new JsonRpcProvider(opts.provider)
    } else if (opts.provider instanceof JsonRpcProvider) {
      this.provider = opts.provider
    } else {
      throw new Error(`valid JsonRpcProvider or url required; got ${opts.provider}`)
    }

    if (typeof opts.blockTag === 'bigint') {
      this.blockTag = bigIntToHex(opts.blockTag)
    } else {
      this.blockTag = opts.blockTag ?? 'latest'
    }

    this.contractCache = new Map()
    this.externallyRetrievedStorageKeys = new Map<string, Map<string, boolean>>()

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

  copy(): EthersStateManager {
    return new EthersStateManager({ provider: this.provider })
  }

  /**
   * Sets the new block tag used when querying the provider and clears the
   * internal cache.
   * @param blockTag the new block tag to use when querying the provider
   */
  setBlockTag(blockTag: blockTagType): void {
    if (typeof blockTag === 'bigint') {
      this.blockTag = bigIntToHex(blockTag)
    } else {
      this.blockTag = blockTag
    }
    this.clearCache()
  }

  /**
   * Clears the internal cache so all accounts, contract code, and storage slots will
   * initially be retrieved from the provider
   */
  clearCache(): void {
    this.contractCache.clear()
    this._cache.clear()
    this.storageTries = {}
    this.externallyRetrievedStorageKeys.clear()
  }

  /**
   * Gets the code corresponding to the provided `address`.
   * @param address - Address to get the `code` for
   * @returns {Promise<Buffer>} -  Resolves with the code corresponding to the provided address.
   * Returns an empty `Buffer` if the account has no associated code.
   */
  async getContractCode(address: Address): Promise<Buffer> {
    const code = await this.provider.getCode(address.toString(), this.blockTag)
    const codeBuffer = toBuffer(code)
    this.contractCache.set(address.toString(), codeBuffer)
    return codeBuffer
  }

  /**
   * Adds `value` to the state trie as code, and sets `codeHash` on the account
   * corresponding to `address` to reference this.
   * @param address - Address of the `account` to add the `code` for
   * @param value - The value of the `code`
   */
  async putContractCode(address: Address, value: Buffer): Promise<void> {
    // Store contract code in the cache
    this.contractCache.set(address.toString(), value)
  }

  /**
   * Gets the storage value associated with the provided `address` and `key`. This method returns
   * the shortest representation of the stored value.
   * @param address - Address of the account to get the storage for
   * @param key - Key in the account's storage to get the value for. Must be 32 bytes long.
   * @returns {Buffer} - The storage value for the account
   * corresponding to the provided address at the provided key.
   * If this does not exist an empty `Buffer` is returned.
   */
  async getContractStorage(address: Address, key: Buffer): Promise<Buffer> {
    // Retrieve storage slot from provider if not found in cache
    await this.getContractStorageFromProvider(address, key)

    const storageTrie = await this._getStorageTrie(address)
    const foundValue = await storageTrie.get(key)

    return Buffer.from(RLP.decode(Uint8Array.from(foundValue ?? [])) as Uint8Array)
  }

  /**
   * Retrieves a storage slot from the provider and stores in the local trie
   * @param address Address to be retrieved from provider
   * @param key Key of storage slot to be returned
   * @private
   */
  private async getContractStorageFromProvider(address: Address, key: Buffer): Promise<void> {
    if (this.externallyRetrievedStorageKeys.has(address.toString())) {
      const map = this.externallyRetrievedStorageKeys.get(address.toString())
      if (map?.get(key.toString('hex')) !== undefined) {
        return
      }
    }

    const accountData = await this.provider.send('eth_getProof', [
      address.toString(),
      [bufferToHex(key)],
      this.blockTag,
    ])

    const rawAccountProofData = accountData.accountProof
    await this.trie.fromProof(rawAccountProofData.map((e: string) => hexToBytes(e)))
    // Only requesting a single slot at a time so the proof will always be the first item in the array
    const storageData = accountData.storageProof[0]

    const storageTrie = await this._getStorageTrie(address)

    await storageTrie.fromProof(storageData.proof.map((e: string) => hexToBytes(e)))

    let map = this.externallyRetrievedStorageKeys.get(address.toString())
    if (!map) {
      this.externallyRetrievedStorageKeys.set(address.toString(), new Map())
      map = this.externallyRetrievedStorageKeys.get(address.toString())!
    }
    map.set(key.toString('hex'), true)
  }

  /**
   * Adds value to the state trie for the `account`
   * corresponding to `address` at the provided `key`.
   * @param address - Address to set a storage value for
   * @param key - Key to set the value at. Must be 32 bytes long.
   * @param value - Value to set at `key` for account corresponding to `address`.
   * Cannot be more than 32 bytes. Leading zeros are stripped.
   * If it is empty or filled with zeros, deletes the value.
   */
  async putContractStorage(address: Address, key: Buffer, value: Buffer): Promise<void> {
    const storageTrie = await this._getStorageTrie(address)
    if (value.length > 0)
      await storageTrie.put(
        key,
        arrToBufArr(RLP.encode(value.length > 0 ? value : Buffer.from([])))
      )
    else await storageTrie.del(key)

    const contract = await this.getAccount(address)
    contract.storageRoot = storageTrie.root()

    await this.putAccount(address, contract)
  }

  /**
   * Clears all storage entries for the account corresponding to `address`.
   * @param address -  Address to clear the storage of
   */
  async clearContractStorage(address: Address): Promise<void> {
    const storageTrie = await this._getStorageTrie(address)
    storageTrie.root(this.trie.EMPTY_TRIE_ROOT)
    const contract = await this.getAccount(address)
    contract.storageRoot = storageTrie.root()
    await this.putAccount(address, contract)
  }

  /**
   * Dumps the RLP-encoded storage values for an `account` specified by `address`.
   * @param address - The address of the `account` to return storage for
   * @returns {Promise<StorageDump>} - The state of the account as an `Object` map.
   * Keys are are the storage keys, values are the storage values as strings.
   * Both are represented as `0x` prefixed hex strings.
   */
  dumpStorage(address: Address): Promise<StorageDump> {
    return new Promise((resolve, reject) => {
      this._getStorageTrie(address)
        .then((trie) => {
          const storage: StorageDump = {}
          const stream = trie.createReadStream()

          stream.on('data', (val: any) => {
            storage['0x' + val.key.toString('hex')] = '0x' + val.value.toString('hex')
          })
          stream.on('end', () => {
            resolve(storage)
          })
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  /**
   * Checks if an `account` exists at `address`
   * @param address - Address of the `account` to check
   */
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

  /**
   * Gets the code corresponding to the provided `address`.
   * @param address - Address to get the `code` for
   * @returns {Promise<Buffer>} - Resolves with the code corresponding to the provided address.
   * Returns an empty `Buffer` if the account has no associated code.
   */
  async getAccount(address: Address): Promise<Account> {
    const account = await this._cache.getOrLoad(address)
    return account
  }

  /**
   * Retrieves an account from the provider and stores in the local trie
   * @param address Address of account to be retrieved from provider
   * @private
   */
  async getAccountFromProvider(address: Address): Promise<Account> {
    const accountData = await this.provider.send('eth_getProof', [
      address.toString(),
      [],
      this.blockTag,
    ])

    const rawData = accountData.accountProof

    await this.trie.fromProof(rawData.map((e: string) => hexToBytes(e)))

    const account = Account.fromAccountData({
      balance: BigInt(accountData.balance),
      nonce: BigInt(accountData.nonce),
      codeHash: toBuffer(accountData.codeHash),
      storageRoot: accountData.storageHash,
    })
    return account
  }

  /**
   * Saves an account into state under the provided `address`.
   * @param address - Address under which to store `account`
   * @param account - The account to store
   */
  async putAccount(address: Address, account: Account): Promise<void> {
    this._cache.put(address, account, false)
  }

  /**
   * Gets the state-root of the Merkle-Patricia trie representation
   * of the state of this StateManager.
   * @returns {Buffer} - Returns the state-root of the `StateManager`
   */
  async getStateRoot(): Promise<Buffer> {
    return this.trie.root()
  }

  /**
   * Sets the state of the instance to that represented
   * by the provided `stateRoot`.
   * @param stateRoot - The state-root to reset the instance to
   */
  async setStateRoot(stateRoot: Buffer): Promise<void> {
    await this._cache.flush()
    this.trie.root(stateRoot)
  }

  /**
   * Checks whether there is a state corresponding to a stateRoot
   */
  async hasStateRoot(root: Buffer): Promise<boolean> {
    const hasRoot = await this.trie.checkRoot(root)
    return hasRoot
  }

  /**
   * Get an EIP-1186 proof
   * @param address address to get proof of
   * @param storageSlots storage slots to get proof of
   * @returns an EIP-1186 formatted proof
   */
  async getProof(address: Address, storageSlots: Buffer[] = []): Promise<Proof> {
    const account = await this.getAccount(address)
    const accountProof: PrefixedHexString[] = (await this.trie.createProof(address.buf)).map((p) =>
      bufferToHex(p)
    )
    const storageProof: StorageProof[] = []
    const storageTrie = await this._getStorageTrie(address)

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
   * Helper method to retrieve a block from the provider to use in the VM
   * @param blockTag block hash or block number to be run
   * @param common Common instance used in VM
   * @returns the block specified by `blockTag`
   */
  getBlockFromProvider = async (blockTag: string | bigint, common: Common) => {
    let blockData
    if (typeof blockTag === 'string' && blockTag.length === 66) {
      blockData = await this.provider.send('eth_getBlockByHash', [blockTag, true])
    } else if (typeof blockTag === 'bigint') {
      blockData = await this.provider.send('eth_getBlockByNumber', [bigIntToHex(blockTag), true])
    } else if (isHexPrefixed(blockTag)) {
      blockData = await this.provider.send('eth_getBlockByNumber', [blockTag, true])
    } else {
      throw new Error(
        `expected blockTag to be block hash, bigint, or hex prefixed string; got ${blockTag}`
      )
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
  private async _lookupStorageTrie(address: Address): Promise<Trie> {
    // from state trie
    const account = await this.getAccount(address)
    const storageTrie = this.trie.copy(false)
    storageTrie.root(account.storageRoot)
    storageTrie.flushCheckpoints()
    return storageTrie
  }

  /**
   * Gets the storage trie for an account from the storage
   * cache or does a lookup.
   * @private
   */
  private async _getStorageTrie(address: Address): Promise<Trie> {
    // from storage cache
    const addressHex = address.buf.toString('hex')
    let storageTrie = this.storageTries[addressHex]
    if (storageTrie === undefined || storageTrie === null) {
      // lookup from state
      storageTrie = await this._lookupStorageTrie(address)
    }
    return storageTrie
  }
}
