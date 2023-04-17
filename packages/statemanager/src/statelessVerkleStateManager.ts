/* eslint @typescript-eslint/no-unused-vars: 0 */

import {
  Account,
  bytesToHex,
  readBigInt64LE,
  readInt32LE,
  setLengthLeft,
  setLengthRight,
  toBytes,
  writeBigInt64LE,
  writeInt32LE,
  zeros,
} from '@ethereumjs/util'
import { concatBytes, hexToBytes } from 'ethereum-cryptography/utils'

import { AccountCache, CacheType, StorageCache } from './cache'
import { Cache } from './cache/cache'

import type { StateManager } from '.'
import type { AccountFields, StorageDump } from './interface'
import type { Address, PrefixedHexString } from '@ethereumjs/util'
import type { Debugger } from 'debug'

const wasm = require('../../rust-verkle-wasm/rust_verkle_wasm')

export interface VerkleState {
  [key: PrefixedHexString]: PrefixedHexString
}

type CacheOptions = {
  /**
   * Allows for cache deactivation
   *
   * Depending on the use case and underlying datastore (and eventual concurrent cache
   * mechanisms there), usage with or without cache can be faster
   *
   * Default: false
   */
  deactivate?: boolean

  /**
   * Cache type to use.
   *
   * Available options:
   *
   * ORDERED_MAP: Cache with no fixed upper bound and dynamic allocation,
   * use for dynamic setups like testing or similar.
   *
   * LRU: LRU cache with pre-allocation of memory and a fixed size.
   * Use for larger and more persistent caches.
   */
  type?: CacheType

  /**
   * Size of the cache (only for LRU cache)
   *
   * Default: 100000 (account cache) / 20000 (storage cache)
   *
   * Note: the cache/trie interplay mechanism is designed in a way that
   * the theoretical number of max modified accounts between two flush operations
   * should be smaller than the cache size, otherwise the cache will "forget" the
   * old modifications resulting in an incomplete set of trie-flushed accounts.
   */
  size?: number
}

type CacheSettings = {
  deactivate: boolean
  type: CacheType
  size: number
}

/**
 * Options dictionary.
 */
export interface StatelessVerkleStateManagerOpts {
  accountCacheOpts?: CacheOptions
  storageCacheOpts?: CacheOptions
}

/**
 * Tree key constants.
 */
const VERSION_LEAF_KEY = 0
const BALANCE_LEAF_KEY = 1
const NONCE_LEAF_KEY = 2
const CODE_KECCAK_LEAF_KEY = 3
const CODE_SIZE_LEAF_KEY = 4

const HEADER_STORAGE_OFFSET = 64
const CODE_OFFSET = 128
const VERKLE_NODE_WIDTH = 256
const MAIN_STORAGE_OFFSET = 256 ** 31

const PUSH_OFFSET = 95
const PUSH1 = PUSH_OFFSET + 1
const PUSH32 = PUSH_OFFSET + 32

export class StatelessVerkleStateManager implements StateManager {
  _accountCache?: AccountCache
  _storageCache?: StorageCache
  _codeCache: { [key: string]: Uint8Array }
  protected readonly _accountCacheSettings: CacheSettings
  protected readonly _storageCacheSettings: CacheSettings

  /**
   * StateManager is run in DEBUG mode (default: false)
   * Taken from DEBUG environment variable
   *
   * Safeguards on debug() calls are added for
   * performance reasons to avoid string literal evaluation
   * @hidden
   */
  protected readonly DEBUG: boolean = false

  private _proof: PrefixedHexString = '0x'

  // State along execution (should update)
  private _state: VerkleState = {}

  // Checkpointing
  private _checkpoints: VerkleState[] = []

  /**
   * Instantiate the StateManager interface.
   */
  constructor(opts: StatelessVerkleStateManagerOpts = {}) {
    this._accountCacheSettings = {
      deactivate: opts.accountCacheOpts?.deactivate ?? false,
      type: opts.accountCacheOpts?.type ?? CacheType.ORDERED_MAP,
      size: opts.accountCacheOpts?.size ?? 100000,
    }

    if (!this._accountCacheSettings.deactivate) {
      this._accountCache = new AccountCache({
        size: this._accountCacheSettings.size,
        type: this._accountCacheSettings.type,
      })
    }

    this._storageCacheSettings = {
      deactivate: opts.storageCacheOpts?.deactivate ?? false,
      type: opts.storageCacheOpts?.type ?? CacheType.ORDERED_MAP,
      size: opts.storageCacheOpts?.size ?? 20000,
    }

    if (!this._storageCacheSettings.deactivate) {
      this._storageCache = new StorageCache({
        size: this._storageCacheSettings.size,
        type: this._storageCacheSettings.type,
      })
    }

    this._codeCache = {}

    /*
     * For a custom StateManager implementation adopt these
     * callbacks passed to the `Cache` instantiated to perform
     * the `get`, `put` and `delete` operations with the
     * desired backend.
     */
    // const getCb: get = async (address) => {
    //   return undefined
    // }
    // const putCb: put = async (keyBuf, accountRlp) => {}
    // const deleteCb = async (keyBuf: Uint8Array) => {}
    // this._cache = new Cache({ get, putCb, deleteCb })
  }

  public initPreState(proof: PrefixedHexString, preState: VerkleState) {
    this._proof = proof
    // Initialize the state with the pre-state
    this._state = preState
  }

  private pedersenHash(input: Uint8Array): Uint8Array {
    const pedersenHash = wasm.pedersen_hash(input)

    if (pedersenHash === null) {
      throw new Error('Wrong pedersenHash input. This might happen if length is not correct.')
    }

    return pedersenHash
  }

  private getTreeKey(address: Address, treeIndex: number, subIndex: number): Uint8Array {
    const address32 = setLengthLeft(address.toBytes(), 32)

    const treeIndexB = writeInt32LE(treeIndex)

    const input = concatBytes(address32, treeIndexB)

    const treeKey = concatBytes(this.pedersenHash(input).slice(0, 31), toBytes(subIndex))

    return treeKey
  }

  private getTreeKeyForVersion(address: Address) {
    return this.getTreeKey(address, 0, VERSION_LEAF_KEY)
  }

  private getTreeKeyForBalance(address: Address) {
    return this.getTreeKey(address, 0, BALANCE_LEAF_KEY)
  }

  private getTreeKeyForNonce(address: Address) {
    return this.getTreeKey(address, 0, NONCE_LEAF_KEY)
  }

  private getTreeKeyForCodeHash(address: Address) {
    return this.getTreeKey(address, 0, CODE_KECCAK_LEAF_KEY)
  }

  private getTreeKeyForCodeSize(address: Address) {
    return this.getTreeKey(address, 0, CODE_SIZE_LEAF_KEY)
  }

  private getTreeKeyForCodeChunk(address: Address, chunkId: number) {
    return this.getTreeKey(
      address,
      Math.floor((CODE_OFFSET + chunkId) / VERKLE_NODE_WIDTH),
      (CODE_OFFSET + chunkId) % VERKLE_NODE_WIDTH
    )
  }

  private chunkifyCode(code: Uint8Array) {
    // Pad code to multiple of 31 bytes
    if (code.length % 31 !== 0) {
      const paddingLength = 31 - (code.length % 31)
      code = setLengthRight(code, code.length + paddingLength)
    }

    /* # Figure out how much pushdata there is after+including each byte
    bytes_to_exec_data = [0] * (len(code) + 32)
    pos = 0
    while pos < len(code):
        if PUSH1 <= code[pos] <= PUSH32:
            pushdata_bytes = code[pos] - PUSH_OFFSET
        else:
            pushdata_bytes = 0
        pos += 1
        for x in range(pushdata_bytes):
            bytes_to_exec_data[pos + x] = pushdata_bytes - x
        pos += pushdata_bytes
    # Output chunks
    return [
        bytes([min(bytes_to_exec_data[pos], 31)]) + code[pos: pos+31]
        for pos in range(0, len(code), 31)
    ] */
  }

  private getTreeKeyForStorageSlot(address: Address, storageKey: number) {
    let position: number
    if (storageKey < CODE_OFFSET - HEADER_STORAGE_OFFSET) {
      position = HEADER_STORAGE_OFFSET + storageKey
    } else {
      position = MAIN_STORAGE_OFFSET + storageKey
    }

    return this.getTreeKey(
      address,
      Math.floor(position / VERKLE_NODE_WIDTH),
      position % VERKLE_NODE_WIDTH
    )
  }

  /**
   * Copies the current instance of the `StateManager`
   * at the last fully committed point, i.e. as if all current
   * checkpoints were reverted.
   */
  copy(): StateManager {
    const stateManager = new StatelessVerkleStateManager()
    stateManager.initPreState(this._proof, this._state)
    return stateManager
  }

  /**
   * Adds `value` to the state trie as code, and sets `codeHash` on the account
   * corresponding to `address` to reference this.
   * @param address - Address of the `account` to add the `code` for
   * @param value - The value of the `code`
   */
  async putContractCode(address: Address, value: Uint8Array): Promise<void> {
    // TODO
  }

  /**
   * Gets the code corresponding to the provided `address`.
   * @param address - Address to get the `code` for
   * @returns {Promise<Uint8Array>} -  Resolves with the code corresponding to the provided address.
   * Returns an empty `Uint8Array` if the account has no associated code.
   */
  async getContractCode(address: Address): Promise<Uint8Array> {
    // Get the contract code size
    const codeHashKey = this.getTreeKeyForCodeHash(address)
    const codeSizeKey = this.getTreeKeyForCodeSize(address)

    const codeSizeLE = hexToBytes(this._state[bytesToHex(codeSizeKey)])

    // Calculate number of chunks
    const chunks = Math.ceil(readInt32LE(codeSizeLE) / 32)

    const retrievedChunks: Uint8Array[] = []

    // Retrieve all code chunks
    for (let chunkId = 0; chunkId < chunks; chunkId++) {
      retrievedChunks.push(this.getTreeKeyForCodeChunk(address, chunkId))
    }

    // Aggregate code chunks
    const code = concatBytes(...retrievedChunks)

    // Return code chunks
    return code
  }

  /**
   * Gets the storage value associated with the provided `address` and `key`. This method returns
   * the shortest representation of the stored value.
   * @param address -  Address of the account to get the storage for
   * @param key - Key in the account's storage to get the value for. Must be 32 bytes long.
   * @returns {Promise<Uint8Array>} - The storage value for the account
   * corresponding to the provided address at the provided key.
   * If this does not exist an empty `Uint8Array` is returned.
   */
  async getContractStorage(address: Address, key: Uint8Array): Promise<Uint8Array> {
    const storageKey = this.getTreeKeyForStorageSlot(address, Number(bytesToHex(key)))
    const storage = toBytes(this._state[bytesToHex(storageKey)])

    return storage
  }

  /**
   * Adds value to the state for the `account`
   * corresponding to `address` at the provided `key`.
   * @param address -  Address to set a storage value for
   * @param key - Key to set the value at. Must be 32 bytes long.
   * @param value - Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is a empty or filled with zeros, deletes the value.
   */
  async putContractStorage(address: Address, key: Uint8Array, value: Uint8Array): Promise<void> {
    const storageKey = this.getTreeKeyForStorageSlot(address, Number(bytesToHex(key)))
    this._state[bytesToHex(storageKey)] = bytesToHex(value)
  }

  /**
   * Clears all storage entries for the account corresponding to `address`.
   * @param address -  Address to clear the storage of
   */
  async clearContractStorage(address: Address): Promise<void> {
    // Update codeHash to `c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470`
    // Clear all storage slots (how?)
  }

  async getAccount(address: Address): Promise<Account> {
    // Retrieve treeKeys from account address
    const balanceKey = this.getTreeKeyForBalance(address)
    const nonceKey = this.getTreeKeyForNonce(address)
    const codeHashKey = this.getTreeKeyForCodeHash(address)

    const balanceLE = toBytes(this._state[bytesToHex(balanceKey)])
    const nonceLE = toBytes(this._state[bytesToHex(nonceKey)])
    const codeHash = toBytes(this._state[bytesToHex(codeHashKey)])

    return Account.fromAccountData({
      balance: balanceLE.length > 0 ? readBigInt64LE(balanceLE) : 0n,
      codeHash: codeHash.length > 0 ? codeHash : zeros(32),
      nonce: nonceLE.length > 0 ? readBigInt64LE(nonceLE) : 0n,
    })
  }

  async putAccount(address: Address, account: Account): Promise<void> {
    // Retrieve treeKeys from account address
    const balanceKey = this.getTreeKeyForBalance(address)
    const nonceKey = this.getTreeKeyForNonce(address)
    const codeHashKey = this.getTreeKeyForCodeHash(address)

    const balanceBuf = writeBigInt64LE(account.balance)
    const nonceBuf = writeBigInt64LE(account.nonce)

    this._state[bytesToHex(balanceKey)] = bytesToHex(balanceBuf)
    this._state[bytesToHex(nonceKey)] = bytesToHex(nonceBuf)
    this._state[bytesToHex(codeHashKey)] = bytesToHex(account.codeHash)
  }

  /**
   * Deletes an account from state under the provided `address`.
   * @param address - Address of the account which should be deleted
   */
  async deleteAccount(address: Address) {
    this._accountCache!.del(address)

    if (!this._storageCacheSettings.deactivate) {
      this._storageCache?.clearContractStorage(address)
    }
  }

  async modifyAccountFields(address: Address, accountFields: AccountFields): Promise<void> {
    const account = await this.getAccount(address)

    account.nonce = accountFields.nonce ?? account.nonce
    account.balance = accountFields.balance ?? account.balance
    account.storageRoot = accountFields.storageRoot ?? account.storageRoot
    account.codeHash = accountFields.codeHash ?? account.codeHash
    await this.putAccount(address, account)
  }

  /**
   * Checkpoints the current state of the StateManager instance.
   * State changes that follow can then be committed by calling
   * `commit` or `reverted` by calling rollback.
   */
  async checkpoint(): Promise<void> {
    this._checkpoints.push(this._state)
    this._accountCache!.checkpoint()
  }

  /**
   * Commits the current change-set to the instance since the
   * last call to checkpoint.
   */
  async commit(): Promise<void> {
    this._checkpoints.pop()
    this._accountCache!.commit()
  }

  // TODO
  async hasStateRoot(root: Uint8Array): Promise<boolean> {
    return true
  }

  /**
   * Reverts the current change-set to the instance since the
   * last call to checkpoint.
   */
  async revert(): Promise<void> {
    // setup trie checkpointing
    this._storageCache?.revert()
    this._accountCache?.revert()
    this._codeCache = {}
  }

  /**
   * Writes all cache items to the trie
   */
  async flush(): Promise<void> {}

  /**
   * Gets the verkle root.
   * NOTE: this needs some examination in the code where this is needed
   * and if we have the verkle root present
   * @returns {Promise<Uint8Array>} - Returns the verkle root of the `StateManager`
   */
  async getStateRoot(): Promise<Uint8Array> {
    return new Uint8Array(0)
  }

  /**
   * TODO: needed?
   * Maybe in this context: reset to original pre state suffice
   * @param stateRoot - The verkle root to reset the instance to
   */
  async setStateRoot(stateRoot: Uint8Array): Promise<void> {}

  /**
   * Dumps the RLP-encoded storage values for an `account` specified by `address`.
   * @param address - The address of the `account` to return storage for
   * @returns {Promise<StorageDump>} - The state of the account as an `Object` map.
   * Keys are are the storage keys, values are the storage values as strings.
   * Both are represented as hex strings without the `0x` prefix.
   */
  async dumpStorage(address: Address): Promise<StorageDump> {
    return { test: 'test' }
  }

  /**
   * Checks whether the current instance has the canonical genesis state
   * for the configured chain parameters.
   * @returns {Promise<boolean>} - Whether the storage trie contains the
   * canonical genesis state for the configured chain parameters.
   */
  async hasGenesisState(): Promise<boolean> {
    return false
  }

  /**
   * Checks if the `account` corresponding to `address`
   * exists
   * @param address - Address of the `account` to check
   */
  async accountExists(address: Address): Promise<boolean> {
    return false
  }

  /**
   * Clears all underlying caches
   */
  clearCaches() {
    this._accountCache?.clear()
    this._storageCache?.clear()
  }
}
