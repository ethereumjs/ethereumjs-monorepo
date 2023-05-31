import { Chain, Common } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { Trie } from '@ethereumjs/trie'
import {
  Account,
  Address,
  KECCAK256_NULL,
  KECCAK256_NULL_S,
  KECCAK256_RLP,
  KECCAK256_RLP_S,
  bigIntToHex,
  bytesToHex,
  bytesToPrefixedHexString,
  concatBytes,
  equalsBytes,
  hexStringToBytes,
  setLengthLeft,
  short,
  toBytes,
  unpadBytes,
  utf8ToBytes,
} from '@ethereumjs/util'
import { debug as createDebugLogger } from 'debug'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { hexToBytes } from 'ethereum-cryptography/utils'

import { AccountCache, CacheType, StorageCache } from './cache'
import { OriginalStorageCache } from './cache/originalStorageCache'

import type { AccountFields, EVMStateManagerInterface, StorageDump } from '@ethereumjs/common'
import type { PrefixedHexString } from '@ethereumjs/util'
import type { Debugger } from 'debug'

export type StorageProof = {
  key: PrefixedHexString
  proof: PrefixedHexString[]
  value: PrefixedHexString
}

export type Proof = {
  address: PrefixedHexString
  balance: PrefixedHexString
  codeHash: PrefixedHexString
  nonce: PrefixedHexString
  storageHash: PrefixedHexString
  accountProof: PrefixedHexString[]
  storageProof: StorageProof[]
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
 * Prefix to distinguish between a contract deployed with code `0x80`
 * and `RLP([])` (also having the value `0x80`).
 *
 * Otherwise the creation of the code hash for the `0x80` contract
 * will be the same as the hash of the empty trie which leads to
 * misbehaviour in the underlying trie library.
 */
export const CODEHASH_PREFIX = utf8ToBytes('c')

/**
 * Options for constructing a {@link StateManager}.
 */
export interface DefaultStateManagerOpts {
  /**
   * A {@link Trie} instance
   */
  trie?: Trie
  /**
   * Option to prefix codehashes in the database. This defaults to `true`.
   * If this is disabled, note that it is possible to corrupt the trie, by deploying code
   * which code is equal to the preimage of a trie-node.
   * E.g. by putting the code `0x80` into the empty trie, will lead to a corrupted trie.
   */
  prefixCodeHashes?: boolean

  accountCacheOpts?: CacheOptions

  storageCacheOpts?: CacheOptions

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
export class DefaultStateManager implements EVMStateManagerInterface {
  _debug: Debugger
  _accountCache?: AccountCache
  _storageCache?: StorageCache

  originalStorageCache: OriginalStorageCache

  _trie: Trie
  _storageTries: { [key: string]: Trie }
  _codeCache: { [key: string]: Uint8Array }

  protected readonly _prefixCodeHashes: boolean
  protected readonly _accountCacheSettings: CacheSettings
  protected readonly _storageCacheSettings: CacheSettings

  protected readonly _common: Common

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

  /**
   * Instantiate the StateManager interface.
   */
  constructor(opts: DefaultStateManagerOpts = {}) {
    // Skip DEBUG calls unless 'ethjs' included in environmental DEBUG variables
    this.DEBUG = process?.env?.DEBUG?.includes('ethjs') ?? false

    this._debug = createDebugLogger('statemanager:statemanager')

    this._common = opts.common ?? new Common({ chain: Chain.Mainnet })

    this._checkpointCount = 0

    this._trie = opts.trie ?? new Trie({ useKeyHashing: true })
    this._storageTries = {}
    this._codeCache = {}

    this.originalStorageCache = new OriginalStorageCache(this.getContractStorage.bind(this))

    this._prefixCodeHashes = opts.prefixCodeHashes ?? true
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
  }

  /**
   * Gets the account associated with `address` or `undefined` if account does not exist
   * @param address - Address of the `account` to get
   */
  async getAccount(address: Address): Promise<Account | undefined> {
    if (!this._accountCacheSettings.deactivate) {
      const elem = this._accountCache!.get(address)
      if (elem !== undefined) {
        return elem.accountRLP !== undefined
          ? Account.fromRlpSerializedAccount(elem.accountRLP)
          : undefined
      }
    }

    const rlp = await this._trie.get(address.bytes)
    const account = rlp !== null ? Account.fromRlpSerializedAccount(rlp) : undefined
    if (this.DEBUG) {
      this._debug(`Get account ${address} from DB (${account ? 'exists' : 'non-existent'})`)
    }
    this._accountCache?.put(address, account)
    return account
  }

  /**
   * Saves an account into state under the provided `address`.
   * @param address - Address under which to store `account`
   * @param account - The account to store or undefined if to be deleted
   */
  async putAccount(address: Address, account: Account | undefined): Promise<void> {
    if (this.DEBUG) {
      this._debug(
        `Save account address=${address} nonce=${account?.nonce} balance=${
          account?.balance
        } contract=${account && account.isContract() ? 'yes' : 'no'} empty=${
          account && account.isEmpty() ? 'yes' : 'no'
        }`
      )
    }
    if (this._accountCacheSettings.deactivate) {
      const trie = this._trie
      if (account !== undefined) {
        await trie.put(address.bytes, account.serialize())
      } else {
        await trie.del(address.bytes)
      }
    } else {
      if (account !== undefined) {
        this._accountCache!.put(address, account)
      } else {
        this._accountCache!.del(address)
      }
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
    if (this.DEBUG) {
      this._debug(`Delete account ${address}`)
    }
    if (this._accountCacheSettings.deactivate) {
      await this._trie.del(address.bytes)
    } else {
      this._accountCache!.del(address)
    }
    if (!this._storageCacheSettings.deactivate) {
      this._storageCache?.clearContractStorage(address)
    }
  }

  /**
   * Adds `value` to the state trie as code, and sets `codeHash` on the account
   * corresponding to `address` to reference this.
   * @param address - Address of the `account` to add the `code` for
   * @param value - The value of the `code`
   */
  async putContractCode(address: Address, value: Uint8Array): Promise<void> {
    const codeHash = keccak256(value)

    if (equalsBytes(codeHash, KECCAK256_NULL)) {
      return
    }

    const key = this._prefixCodeHashes ? concatBytes(CODEHASH_PREFIX, codeHash) : codeHash
    await this._trie.database().put(key, value)

    const keyHex = bytesToHex(key)
    this._codeCache[keyHex] = value

    if (this.DEBUG) {
      this._debug(`Update codeHash (-> ${short(codeHash)}) for account ${address}`)
    }
    if ((await this.getAccount(address)) === undefined) {
      await this.putAccount(address, new Account())
    }
    await this.modifyAccountFields(address, { codeHash })
  }

  /**
   * Gets the code corresponding to the provided `address`.
   * @param address - Address to get the `code` for
   * @returns {Promise<Uint8Array>} -  Resolves with the code corresponding to the provided address.
   * Returns an empty `Uint8Array` if the account has no associated code.
   */
  async getContractCode(address: Address): Promise<Uint8Array> {
    const account = await this.getAccount(address)
    if (!account) {
      return new Uint8Array(0)
    }
    if (!account.isContract()) {
      return new Uint8Array(0)
    }
    const key = this._prefixCodeHashes
      ? concatBytes(CODEHASH_PREFIX, account.codeHash)
      : account.codeHash

    const keyHex = bytesToHex(key)
    if (keyHex in this._codeCache) {
      return this._codeCache[keyHex]
    } else {
      const code = (await this._trie.database().get(key)) ?? new Uint8Array(0)
      this._codeCache[keyHex] = code
      return code
    }
  }

  /**
   * Gets the storage trie for an account from the storage
   * cache or does a lookup.
   * @private
   */
  private async _getStorageTrie(address: Address, account: Account): Promise<Trie> {
    // from storage cache
    const addressHex = bytesToHex(address.bytes)
    const storageTrie = this._storageTries[addressHex]
    if (storageTrie === undefined) {
      const storageTrie = this._trie.copy(false)
      storageTrie.root(account.storageRoot)
      storageTrie.flushCheckpoints()
      this._storageTries[addressHex] = storageTrie
      return storageTrie
    }
    return storageTrie
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
    if (!this._storageCacheSettings.deactivate) {
      const value = this._storageCache!.get(address, key)
      if (value !== undefined) {
        const decoded = RLP.decode(value ?? new Uint8Array(0)) as Uint8Array
        return decoded
      }
    }

    const account = await this.getAccount(address)
    if (!account) {
      throw new Error('getContractStorage() called on non-existing account')
    }
    const trie = await this._getStorageTrie(address, account)
    const value = await trie.get(key)
    if (!this._storageCacheSettings.deactivate) {
      this._storageCache?.put(address, key, value ?? hexStringToBytes('80'))
    }
    const decoded = RLP.decode(value ?? new Uint8Array(0)) as Uint8Array
    return decoded
  }

  /**
   * Modifies the storage trie of an account.
   * @private
   * @param address -  Address of the account whose storage is to be modified
   * @param modifyTrie - Function to modify the storage trie of the account
   */
  private async _modifyContractStorage(
    address: Address,
    account: Account,
    modifyTrie: (storageTrie: Trie, done: Function) => void
  ): Promise<void> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const storageTrie = await this._getStorageTrie(address, account)

      modifyTrie(storageTrie, async () => {
        // update storage cache
        const addressHex = bytesToHex(address.bytes)
        this._storageTries[addressHex] = storageTrie

        // update contract storageRoot
        account.storageRoot = storageTrie.root()
        await this.putAccount(address, account)
        resolve()
      })
    })
  }

  private async _writeContractStorage(
    address: Address,
    account: Account,
    key: Uint8Array,
    value: Uint8Array
  ) {
    await this._modifyContractStorage(address, account, async (storageTrie, done) => {
      if (value instanceof Uint8Array && value.length) {
        // format input
        const encodedValue = RLP.encode(value)
        if (this.DEBUG) {
          this._debug(`Update contract storage for account ${address} to ${short(value)}`)
        }
        await storageTrie.put(key, encodedValue)
      } else {
        // deleting a value
        if (this.DEBUG) {
          this._debug(`Delete contract storage for account`)
        }
        await storageTrie.del(key)
      }
      done()
    })
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
    if (!this._storageCacheSettings.deactivate) {
      const encodedValue = RLP.encode(value)
      this._storageCache!.put(address, key, encodedValue)
    } else {
      await this._writeContractStorage(address, account, key, value)
    }
  }

  /**
   * Clears all storage entries for the account corresponding to `address`.
   * @param address - Address to clear the storage of
   */
  async clearContractStorage(address: Address): Promise<void> {
    let account = await this.getAccount(address)
    if (!account) {
      account = new Account()
    }
    this._storageCache?.clearContractStorage(address)
    await this._modifyContractStorage(address, account, (storageTrie, done) => {
      storageTrie.root(storageTrie.EMPTY_TRIE_ROOT)
      done()
    })
  }

  /**
   * Checkpoints the current state of the StateManager instance.
   * State changes that follow can then be committed by calling
   * `commit` or `reverted` by calling rollback.
   */
  async checkpoint(): Promise<void> {
    this._trie.checkpoint()
    this._storageCache?.checkpoint()
    this._accountCache?.checkpoint()
    this._checkpointCount++
  }

  /**
   * Commits the current change-set to the instance since the
   * last call to checkpoint.
   */
  async commit(): Promise<void> {
    // setup trie checkpointing
    await this._trie.commit()
    this._storageCache?.commit()
    this._accountCache?.commit()
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
    // setup trie checkpointing
    await this._trie.revert()
    this._storageCache?.revert()
    this._accountCache?.revert()
    this._storageTries = {}
    this._codeCache = {}

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
    if (!this._storageCacheSettings.deactivate) {
      const items = this._storageCache!.flush()
      for (const item of items) {
        const address = Address.fromString(`0x${item[0]}`)
        const keyHex = item[1]
        const keyBytes = hexToBytes(keyHex)
        const value = item[2]

        const decoded = RLP.decode(value ?? new Uint8Array(0)) as Uint8Array
        const account = await this.getAccount(address)
        if (account) {
          await this._writeContractStorage(address, account, keyBytes, decoded)
        }
      }
    }
    if (!this._accountCacheSettings.deactivate) {
      const items = this._accountCache!.flush()
      for (const item of items) {
        const addressHex = item[0]
        const addressBytes = hexToBytes(addressHex)
        const elem = item[1]
        if (elem.accountRLP === undefined) {
          const trie = this._trie
          await trie.del(addressBytes)
        } else {
          const trie = this._trie
          await trie.put(addressBytes, elem.accountRLP)
        }
      }
    }
  }

  /**
   * Get an EIP-1186 proof
   * @param address address to get proof of
   * @param storageSlots storage slots to get proof of
   */
  async getProof(address: Address, storageSlots: Uint8Array[] = []): Promise<Proof> {
    const account = await this.getAccount(address)
    if (!account) {
      // throw new Error(`getProof() can only be called for an existing account`)
      const returnValue: Proof = {
        address: address.toString(),
        balance: '0x',
        codeHash: '0x' + KECCAK256_NULL_S,
        nonce: '0x',
        storageHash: '0x' + KECCAK256_RLP_S,
        accountProof: (await this._trie.createProof(address.bytes)).map((p) =>
          bytesToPrefixedHexString(p)
        ),
        storageProof: [],
      }
      return returnValue
    }
    const accountProof: PrefixedHexString[] = (await this._trie.createProof(address.bytes)).map(
      (p) => bytesToPrefixedHexString(p)
    )
    const storageProof: StorageProof[] = []
    const storageTrie = await this._getStorageTrie(address, account)

    for (const storageKey of storageSlots) {
      const proof = (await storageTrie.createProof(storageKey)).map((p) =>
        bytesToPrefixedHexString(p)
      )
      const value = bytesToPrefixedHexString(await this.getContractStorage(address, storageKey))
      const proofItem: StorageProof = {
        key: bytesToPrefixedHexString(storageKey),
        value: value === '0x' ? '0x0' : value, // Return '0x' values as '0x0' since this is a JSON RPC response
        proof,
      }
      storageProof.push(proofItem)
    }

    const returnValue: Proof = {
      address: address.toString(),
      balance: bigIntToHex(account.balance),
      codeHash: bytesToPrefixedHexString(account.codeHash),
      nonce: bigIntToHex(account.nonce),
      storageHash: bytesToPrefixedHexString(account.storageRoot),
      accountProof,
      storageProof,
    }
    return returnValue
  }

  /**
   * Verify an EIP-1186 proof. Throws if proof is invalid, otherwise returns true.
   * @param proof the proof to prove
   */
  async verifyProof(proof: Proof): Promise<boolean> {
    const rootHash = keccak256(hexStringToBytes(proof.accountProof[0]))
    const key = hexStringToBytes(proof.address)
    const accountProof = proof.accountProof.map((rlpString: PrefixedHexString) =>
      hexStringToBytes(rlpString)
    )

    // This returns the account if the proof is valid.
    // Verify that it matches the reported account.
    const value = await new Trie({ useKeyHashing: true }).verifyProof(rootHash, key, accountProof)

    if (value === null) {
      // Verify that the account is empty in the proof.
      const emptyBytes = new Uint8Array(0)
      const notEmptyErrorMsg = 'Invalid proof provided: account is not empty'
      const nonce = unpadBytes(hexStringToBytes(proof.nonce))
      if (!equalsBytes(nonce, emptyBytes)) {
        throw new Error(`${notEmptyErrorMsg} (nonce is not zero)`)
      }
      const balance = unpadBytes(hexStringToBytes(proof.balance))
      if (!equalsBytes(balance, emptyBytes)) {
        throw new Error(`${notEmptyErrorMsg} (balance is not zero)`)
      }
      const storageHash = hexStringToBytes(proof.storageHash)
      if (!equalsBytes(storageHash, KECCAK256_RLP)) {
        throw new Error(`${notEmptyErrorMsg} (storageHash does not equal KECCAK256_RLP)`)
      }
      const codeHash = hexStringToBytes(proof.codeHash)
      if (!equalsBytes(codeHash, KECCAK256_NULL)) {
        throw new Error(`${notEmptyErrorMsg} (codeHash does not equal KECCAK256_NULL)`)
      }
    } else {
      const account = Account.fromRlpSerializedAccount(value)
      const { nonce, balance, storageRoot, codeHash } = account
      const invalidErrorMsg = 'Invalid proof provided:'
      if (nonce !== BigInt(proof.nonce)) {
        throw new Error(`${invalidErrorMsg} nonce does not match`)
      }
      if (balance !== BigInt(proof.balance)) {
        throw new Error(`${invalidErrorMsg} balance does not match`)
      }
      if (!equalsBytes(storageRoot, hexStringToBytes(proof.storageHash))) {
        throw new Error(`${invalidErrorMsg} storageHash does not match`)
      }
      if (!equalsBytes(codeHash, hexStringToBytes(proof.codeHash))) {
        throw new Error(`${invalidErrorMsg} codeHash does not match`)
      }
    }

    const storageRoot = hexStringToBytes(proof.storageHash)

    for (const stProof of proof.storageProof) {
      const storageProof = stProof.proof.map((value: PrefixedHexString) => hexStringToBytes(value))
      const storageValue = setLengthLeft(hexStringToBytes(stProof.value), 32)
      const storageKey = hexStringToBytes(stProof.key)
      const proofValue = await new Trie({ useKeyHashing: true }).verifyProof(
        storageRoot,
        storageKey,
        storageProof
      )
      const reportedValue = setLengthLeft(
        RLP.decode(proofValue ?? new Uint8Array(0)) as Uint8Array,
        32
      )
      if (!equalsBytes(reportedValue, storageValue)) {
        throw new Error('Reported trie value does not match storage')
      }
    }
    return true
  }

  /**
   * Gets the state-root of the Merkle-Patricia trie representation
   * of the state of this StateManager. Will error if there are uncommitted
   * checkpoints on the instance.
   * @returns {Promise<Uint8Array>} - Returns the state-root of the `StateManager`
   */
  async getStateRoot(): Promise<Uint8Array> {
    await this.flush()
    return this._trie.root()
  }

  /**
   * Sets the state of the instance to that represented
   * by the provided `stateRoot`. Will error if there are uncommitted
   * checkpoints on the instance or if the state root does not exist in
   * the state trie.
   * @param stateRoot - The state-root to reset the instance to
   */
  async setStateRoot(stateRoot: Uint8Array, clearCache: boolean = true): Promise<void> {
    await this.flush()

    if (!equalsBytes(stateRoot, this._trie.EMPTY_TRIE_ROOT)) {
      const hasRoot = await this._trie.checkRoot(stateRoot)
      if (!hasRoot) {
        throw new Error('State trie does not contain state root')
      }
    }

    this._trie.root(stateRoot)
    if (this._accountCache !== undefined && clearCache) {
      this._accountCache.clear()
    }
    if (this._storageCache !== undefined && clearCache) {
      this._storageCache.clear()
    }
    this._storageTries = {}
    this._codeCache = {}
  }

  /**
   * Dumps the RLP-encoded storage values for an `account` specified by `address`.
   * @param address - The address of the `account` to return storage for
   * @returns {Promise<StorageDump>} - The state of the account as an `Object` map.
   * Keys are are the storage keys, values are the storage values as strings.
   * Both are represented as hex strings without the `0x` prefix.
   */
  async dumpStorage(address: Address): Promise<StorageDump> {
    await this.flush()
    const account = await this.getAccount(address)
    if (!account) {
      throw new Error(`dumpStorage f() can only be called for an existing account`)
    }

    return new Promise((resolve, reject) => {
      this._getStorageTrie(address, account)
        .then((trie) => {
          const storage: StorageDump = {}
          const stream = trie.createReadStream()

          stream.on('data', (val: any) => {
            storage[bytesToHex(val.key)] = bytesToHex(val.value)
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
   * Initializes the provided genesis state into the state trie.
   * Will error if there are uncommitted checkpoints on the instance.
   * @param initState address -> balance | [balance, code, storage]
   */
  async generateCanonicalGenesis(initState: any): Promise<void> {
    if (this._checkpointCount !== 0) {
      throw new Error('Cannot create genesis state with uncommitted checkpoints')
    }
    if (this.DEBUG) {
      this._debug(`Save genesis state into the state trie`)
    }
    const addresses = Object.keys(initState)
    for (const address of addresses) {
      const addr = Address.fromString(address)
      const state = initState[address]
      if (!Array.isArray(state)) {
        // Prior format: address -> balance
        const account = Account.fromAccountData({ balance: state })
        await this.putAccount(addr, account)
      } else {
        // New format: address -> [balance, code, storage]
        const [balance, code, storage, nonce] = state
        const account = Account.fromAccountData({ balance, nonce })
        await this.putAccount(addr, account)
        if (code !== undefined) {
          await this.putContractCode(addr, toBytes(code))
        }
        if (storage !== undefined) {
          for (const [key, value] of storage) {
            await this.putContractStorage(addr, toBytes(key), toBytes(value))
          }
        }
      }
    }
    await this.flush()
  }

  /**
   * Checks whether there is a state corresponding to a stateRoot
   */
  async hasStateRoot(root: Uint8Array): Promise<boolean> {
    return this._trie.checkRoot(root)
  }

  /**
   * Copies the current instance of the `StateManager`
   * at the last fully committed point, i.e. as if all current
   * checkpoints were reverted.
   *
   * Note on caches:
   * 1. For caches instantiated as an LRU cache type
   * the copy() method will instantiate with an ORDERED_MAP cache
   * instead, since copied instantances are mostly used in
   * short-term usage contexts and LRU cache instantation would create
   * a large overhead here.
   * 2. Cache values are generally not copied along
   */
  copy(): DefaultStateManager {
    const trie = this._trie.copy(false)
    const prefixCodeHashes = this._prefixCodeHashes
    let accountCacheOpts = { ...this._accountCacheSettings }
    if (!this._accountCacheSettings.deactivate) {
      accountCacheOpts = { ...accountCacheOpts, type: CacheType.ORDERED_MAP }
    }
    let storageCacheOpts = { ...this._storageCacheSettings }
    if (!this._storageCacheSettings.deactivate) {
      storageCacheOpts = { ...storageCacheOpts, type: CacheType.ORDERED_MAP }
    }

    return new DefaultStateManager({
      trie,
      prefixCodeHashes,
      accountCacheOpts,
      storageCacheOpts,
    })
  }

  /**
   * Clears all underlying caches
   */
  clearCaches() {
    this._accountCache?.clear()
    this._storageCache?.clear()
  }
}
