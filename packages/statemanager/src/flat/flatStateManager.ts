import { Chain, Common } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { merkleizeList } from '@ethereumjs/trie'
import { Account, unpadBytes } from '@ethereumjs/util'
import debugDefault from 'debug'

import { OriginalStorageCache } from '../cache/originalStorageCache.js'

import { STORAGE_PREFIX, Snapshot } from './snapshot.js'

import type { Proof } from '../index.js'
import type { AccountFields, EVMStateManagerInterface, StorageDump } from '@ethereumjs/common'
import type { StorageRange } from '@ethereumjs/common/src'
import type { Address } from '@ethereumjs/util'
import type { Debugger } from 'debug'

const { debug: createDebugLogger } = debugDefault

/**
 * Options for constructing a {@link StateManager}.
 */
export interface FlatStateManagerOpts {
  snapshot?: Snapshot

  /**
   * The common to use
   */
  common?: Common
}

/**
 * Default StateManager implementation for the VM.
 *
 * The state manager abstracts from the underlying data store
 * by providing higher level access to accounts, contract code
 * and storage slots.
 *
 * The default state manager implementation uses a
 * `@ethereumjs/trie` trie as a data backend.
 */
export class FlatStateManager implements EVMStateManagerInterface {
  protected _debug: Debugger
  // protected _accountCache?: AccountCache
  // protected _storageCache?: StorageCache
  // protected _codeCache?: CodeCache

  originalStorageCache: OriginalStorageCache

  // protected readonly _accountCacheSettings: CacheSettings
  // protected readonly _storageCacheSettings: CacheSettings
  // protected readonly _codeCacheSettings: CacheSettings

  public readonly common: Common

  protected _checkpointCount: number

  /**
   * StateManager is run in DEBUG mode (default: false)
   * Taken from DEBUG environment variable
   *
   * Safeguards on debug() calls are added for
   * performance reasons to avoid string literal evaluation
   * @hidden
   */
  protected readonly DEBUG: boolean = false

  _snapshot: Snapshot

  /**
   * Instantiate the StateManager interface.
   */
  constructor(opts: FlatStateManagerOpts = {}) {
    this.DEBUG =
      typeof window === 'undefined' ? process?.env?.DEBUG?.includes('ethjs') ?? false : false

    this._debug = createDebugLogger('statemanager:statemanager')

    this.common = opts.common ?? new Common({ chain: Chain.Mainnet })

    this._snapshot = opts.snapshot ?? new Snapshot()

    this.originalStorageCache = new OriginalStorageCache(this.getContractStorage.bind(this))

    this._checkpointCount = 0
  }

  /**
   * Gets the account associated with `address` or `undefined` if account does not exist
   * @param address - Address of the `account` to get
   */
  async getAccount(address: Address): Promise<Account | undefined> {
    const res = await this._snapshot.getAccount(address)
    const account = res ? Account.fromRlpSerializedAccount(res) : undefined
    return account
  }

  /**
   * Saves an account into state under the provided `address`.
   * @param address - Address under which to store `account`
   * @param account - The account to store or undefined if to be deleted
   */
  async putAccount(address: Address, account: Account | undefined): Promise<void> {
    if (account === undefined) {
      await this._snapshot.delAccount(address)
    } else {
      await this._snapshot.putAccount(address, account)
    }
  }

  /**
   * Gets the account associated with `address`, modifies the given account
   * fields, then saves the account into state. Account fields can include
   * `nonce`, `balance`, `storageRoot`, and `codeHash`.
   * @param address - Address of the account to modify
   * @param accountFields - Object containing account fields and values to modify
   */
  async modifyAccountFields(address: Address, accountFields: AccountFields): Promise<void> {
    let account = await this.getAccount(address)
    if (!account) {
      account = new Account()
    }
    account.nonce = accountFields.nonce ?? account.nonce
    account.balance = accountFields.balance ?? account.balance
    account.storageRoot = accountFields.storageRoot ?? account.storageRoot
    account.codeHash = accountFields.codeHash ?? account.codeHash
    await this.putAccount(address, account)
  }

  /**
   * Deletes an account from state under the provided `address`.
   * @param address - Address of the account which should be deleted
   */
  async deleteAccount(address: Address) {
    await this._snapshot.delAccount(address)
  }

  /**
   * Adds `value` to the state trie as code, and sets `codeHash` on the account
   * corresponding to `address` to reference this. If account does not exist, a
   * new account will be created.
   * @param address - Address of the `account` to add the `code` for
   * @param value - The value of the `code`
   */
  async putContractCode(address: Address, value: Uint8Array): Promise<void> {
    if ((await this.getAccount(address)) === undefined) {
      await this.putAccount(address, new Account())
    }
    await this._snapshot.putCode(address, value)
  }

  /**
   * Gets the code corresponding to the provided `address`.
   * @param address - Address to get the `code` for
   * @returns {Promise<Uint8Array>} -  Resolves with the code corresponding to the provided address.
   * Returns an empty `Uint8Array` if the account has no associated code.
   */
  async getContractCode(address: Address): Promise<Uint8Array> {
    const code = (await this._snapshot.getCode(address)) ?? new Uint8Array(0)
    return code
  }

  /**
   * Gets the storage value associated with the provided `address` and `key`. This method returns
   * the shortest representation of the stored value.
   * @param address -  Address of the account to get the storage for
   * @param key - Key in the account's storage to get the value for. Must be 32 bytes long.
   * @returns - The storage value for the account
   * corresponding to the provided address at the provided key.
   * If this does not exist an empty `Uint8Array` is returned.
   */
  async getContractStorage(address: Address, key: Uint8Array): Promise<Uint8Array> {
    if (key.length !== 32) {
      throw new Error('Storage key must be 32 bytes long')
    }

    const value = await this._snapshot.getStorageSlot(address, key)
    if (!value) return new Uint8Array(0)

    const decoded = RLP.decode(value ?? new Uint8Array(0)) as Uint8Array
    return decoded
  }

  removeStorageSlotKeyPrefix(leaf: Uint8Array[]) {
    leaf[0] = leaf[0].slice(STORAGE_PREFIX.length + 32)
    return leaf
  }
  /**
   * Adds value to the state trie for the `account`
   * corresponding to `address` at the provided `key`.
   * @param address -  Address to set a storage value for
   * @param key - Key to set the value at. Must be 32 bytes long.
   * @param value - Value to set at `key` for account corresponding to `address`.
   * Cannot be more than 32 bytes. Leading zeros are stripped.
   * If it is a empty or filled with zeros, deletes the value.
   */
  async putContractStorage(address: Address, key: Uint8Array, value: Uint8Array): Promise<void> {
    if (key.length !== 32) {
      throw new Error('Storage key must be 32 bytes long')
    }

    if (value.length > 32) {
      throw new Error('Storage value cannot be longer than 32 bytes')
    }

    const account = await this.getAccount(address)
    if (!account) {
      throw new Error('putContractStorage() called on non-existing account')
    }

    value = unpadBytes(value)
    if (value instanceof Uint8Array && value.length) {
      const encodedValue = RLP.encode(value)
      await this._snapshot.putStorageSlot(address, key, encodedValue)
    } else {
      await this._snapshot.delStorageSlot(address, key)
    }

    const slots = (await this._snapshot.getStorageSlots(address)) as Uint8Array[][]

    // remove any prefixes from keys to ensure raw keys are being used for root calcuation
    slots.map((leaf) => {
      this.removeStorageSlotKeyPrefix(leaf)
    })

    // update contract storageRoot
    account.storageRoot = merkleizeList(slots) // TODO merkleizing like this is an expensive operation - see if it's possible to use a trie for updating roots

    await this.putAccount(address, account)
  }

  /**
   * Clears all storage entries for the account corresponding to `address`.
   * @param address - Address to clear the storage of
   */
  async clearContractStorage(address: Address): Promise<void> {
    return this._snapshot.clearAccountStorage(address)
  }

  /**
   * Checkpoints the current state of the StateManager instance.
   * State changes that follow can then be committed by calling
   * `commit` or `reverted` by calling rollback.
   */
  async checkpoint(): Promise<void> {
    this._snapshot.checkpoint()
    this._checkpointCount++
  }

  /**
   * Commits the current change-set to the instance since the
   * last call to checkpoint.
   */
  async commit(): Promise<void> {
    await this._snapshot.commit()
    this._checkpointCount--

    if (this._checkpointCount === 0) {
      await this.flush()
      this.originalStorageCache.clear()
    }

    if (this.DEBUG) {
      this._debug(`state checkpoint committed`)
    }
  }

  /**
   * Reverts the current change-set to the instance since the
   * last call to checkpoint.
   */
  async revert(): Promise<void> {
    await this._snapshot.revert()

    this._checkpointCount--

    if (this._checkpointCount === 0) {
      await this.flush()
      this.originalStorageCache.clear()
    }
  }

  /**
   * Writes all cache items to the trie
   */
  async flush(): Promise<void> {
    // currently, not using any caches, and so flush doesn't do anything
    return
  }

  /**
   * Get an EIP-1186 proof
   * @param address address to get proof of
   * @param storageSlots storage slots to get proof of
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getProof(address: Address, storageSlots: Uint8Array[] = []): Promise<Proof> {
    throw new Error('Not yet implemented')
  }

  /**
   * Verify an EIP-1186 proof. Throws if proof is invalid, otherwise returns true.
   * @param proof the proof to prove
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async verifyProof(proof: Proof): Promise<boolean> {
    throw new Error('Not yet implemented')
  }

  /**
   * Gets the state-root of the Merkle-Patricia trie representation
   * of the state of this StateManager. Will error if there are uncommitted
   * checkpoints on the instance.
   * @returns {Promise<Uint8Array>} - Returns the state-root of the `StateManager`
   */
  async getStateRoot(checkpointStateRoot = false): Promise<Uint8Array> {
    await this.flush()
    return this._snapshot.merkleize(checkpointStateRoot)
  }

  /**
   * Sets the state of the instance to that represented
   * by the provided `stateRoot`. Will error if there are uncommitted
   * checkpoints on the instance or if the state root does not exist in
   * the state trie.
   * @param stateRoot - The state-root to reset the instance to
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async setStateRoot(stateRoot: Uint8Array, clearCache: boolean = true): Promise<void> {
    // potentially don't need setStateRoot and can stub it out like in ethersStateManager
    //
    // can keep the supported state roots of the last n blocks in a set to check if root is valid and supported
    // then can set a class field
    await this._snapshot.setStateRoot(stateRoot)
  }

  /**
   * Dumps the RLP-encoded storage values for an `account` specified by `address`.
   * @param address - The address of the `account` to return storage for
   * @returns {Promise<StorageDump>} - The state of the account as an `Object` map.
   * Keys are are the storage keys, values are the storage values as strings.
   * Both are represented as hex strings without the `0x` prefix.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async dumpStorage(address: Address): Promise<StorageDump> {
    throw new Error('Not yet implemented')
  }

  /**
   Dumps a limited number of RLP-encoded storage values for an account specified by `address`,
   starting from `startKey` or greater.
   @param address - The address of the `account` to return storage for.
   @param startKey - The bigint representation of the smallest storage key that will be returned.
   @param limit - The maximum number of storage values that will be returned.
   @returns {Promise<StorageRange>} - A {@link StorageRange} object that will contain at most `limit` entries in its `storage` field.
   The object will also contain `nextKey`, the next (hashed) storage key after the range included in `storage`.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async dumpStorageRange(address: Address, startKey: bigint, limit: number): Promise<StorageRange> {
    throw new Error('Not yet implemented')
  }

  /**
   * Initializes the provided genesis state into the state trie.
   * Will error if there are uncommitted checkpoints on the instance.
   * @param initState address -> balance | [balance, code, storage]
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async generateCanonicalGenesis(initState: any): Promise<void> {
    throw new Error('Not yet implemented')
  }

  /**
   * Checks whether there is a state corresponding to a stateRoot
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async hasStateRoot(root: Uint8Array): Promise<boolean> {
    throw new Error('Not yet implemented')
  }

  /**
   * Copies the current instance of the `StateManager`
   * at the last fully committed point, i.e. as if all current
   * checkpoints were reverted.
   *
   * Caches are downleveled (so: adopted for short-term usage)
   * by default.
   *
   * This means in particular:
   * 1. For caches instantiated as an LRU cache type
   * the copy() method will instantiate with an ORDERED_MAP cache
   * instead, since copied instantances are mostly used in
   * short-term usage contexts and LRU cache instantation would create
   * a large overhead here.
   * 2. The underlying trie object is initialized with 0 cache size
   *
   * Both adoptions can be deactivated by setting `downlevelCaches` to
   * `false`.
   *
   * Cache values are generally not copied along regardless of the
   * `downlevelCaches` setting.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shallowCopy(downlevelCaches: boolean = true): FlatStateManager {
    const common = this.common.copy()
    common.setHardfork(this.common.hardfork())

    const snapshot = new Snapshot(this._snapshot._db)

    return new FlatStateManager({
      common,
      snapshot,
    })
  }

  /**
   * Clears all underlying caches
   */
  clearCaches() {
    // currently, not using any caches, and so clearCaches doesn't do anything
    return
  }
}
