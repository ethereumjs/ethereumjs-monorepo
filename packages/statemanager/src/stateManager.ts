import { RLP } from '@ethereumjs/rlp'
import { Trie } from '@ethereumjs/trie'
import {
  Account,
  Address,
  KECCAK256_NULL,
  KECCAK256_RLP,
  bigIntToHex,
  bufferToHex,
  setLengthLeft,
  short,
  toBuffer,
  unpadBuffer,
} from '@ethereumjs/util'
import { debug as createDebugLogger } from 'debug'
import { keccak256 } from 'ethereum-cryptography/keccak'

import { AccountCache, CacheType, StorageCache } from './cache'

import type { AccountFields, StateManager, StorageDump } from './interface'
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
const CODEHASH_PREFIX = Buffer.from('c')

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
export class DefaultStateManager implements StateManager {
  _debug: Debugger
  _accountCache?: AccountCache
  _storageCache?: StorageCache

  _trie: Trie
  _storageTries: { [key: string]: Trie }
  _codeCache: { [key: string]: Buffer }

  protected readonly _prefixCodeHashes: boolean
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

  /**
   * Instantiate the StateManager interface.
   */
  constructor(opts: DefaultStateManagerOpts = {}) {
    // Skip DEBUG calls unless 'ethjs' included in environmental DEBUG variables
    this.DEBUG = process?.env?.DEBUG?.includes('ethjs') ?? false

    this._debug = createDebugLogger('statemanager:statemanager')

    this._trie = opts.trie ?? new Trie({ useKeyHashing: true })
    this._storageTries = {}
    this._codeCache = {}

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

    const rlp = await this._trie.get(address.buf)
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
        await trie.put(address.buf, account.serialize())
      } else {
        await trie.del(address.buf)
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
      await this._trie.del(address.buf)
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
  async putContractCode(address: Address, value: Buffer): Promise<void> {
    const codeHash = Buffer.from(keccak256(value))

    if (codeHash.equals(KECCAK256_NULL)) {
      return
    }

    const key = this._prefixCodeHashes ? Buffer.concat([CODEHASH_PREFIX, codeHash]) : codeHash
    // @ts-expect-error
    await this._trie._db.put(key, value)

    const keyHex = key.toString('hex')
    this._codeCache[keyHex] = value

    if (this.DEBUG) {
      this._debug(`Update codeHash (-> ${short(codeHash)}) for account ${address}`)
    }
    if (!(await this.getAccount(address))) {
      await this.putAccount(address, new Account())
    }
    await this.modifyAccountFields(address, { codeHash })
  }

  /**
   * Gets the code corresponding to the provided `address`.
   * @param address - Address to get the `code` for
   * @returns {Promise<Buffer>} -  Resolves with the code corresponding to the provided address.
   * Returns an empty `Buffer` if the account has no associated code.
   */
  async getContractCode(address: Address): Promise<Buffer> {
    const account = await this.getAccount(address)
    if (!account) {
      return Buffer.alloc(0)
    }
    if (!account.isContract()) {
      return Buffer.alloc(0)
    }
    const key = this._prefixCodeHashes
      ? Buffer.concat([CODEHASH_PREFIX, account.codeHash])
      : account.codeHash

    const keyHex = key.toString('hex')
    if (keyHex in this._codeCache) {
      return this._codeCache[keyHex]
    } else {
      // @ts-expect-error
      const code = (await this._trie._db.get(key)) ?? Buffer.alloc(0)
      this._codeCache[keyHex] = code
      return code
    }
  }

  /**
   * Gets the storage trie for an account from the storage
   * cache or does a lookup.
   * @private
   */
  async _getStorageTrie(address: Address, account: Account): Promise<Trie> {
    // from storage cache
    const addressHex = address.buf.toString('hex')
    const storageTrie = this._storageTries[addressHex]
    if (storageTrie === undefined) {
      const storageTrie = this._trie.copy(false)
      storageTrie.root(account.storageRoot)
      storageTrie.flushCheckpoints()
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
   * If this does not exist an empty `Buffer` is returned.
   */
  async getContractStorage(address: Address, key: Buffer): Promise<Buffer> {
    if (key.length !== 32) {
      throw new Error('Storage key must be 32 bytes long')
    }
    if (!this._storageCacheSettings.deactivate) {
      const elem = this._storageCache!.get(address, key)
      if (elem !== undefined) {
        const decoded = Buffer.from(RLP.decode(Uint8Array.from(elem)) as Uint8Array)
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
      this._storageCache?.put(address, key, value ?? Buffer.from('80', 'hex'))
    }
    const decoded = Buffer.from(RLP.decode(Uint8Array.from(value ?? [])) as Uint8Array)
    return decoded
  }

  /**
   * Modifies the storage trie of an account.
   * @private
   * @param address -  Address of the account whose storage is to be modified
   * @param modifyTrie - Function to modify the storage trie of the account
   */
  async _modifyContractStorage(
    address: Address,
    account: Account,
    modifyTrie: (storageTrie: Trie, done: Function) => void
  ): Promise<void> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const storageTrie = await this._getStorageTrie(address, account)

      modifyTrie(storageTrie, async () => {
        // update storage cache
        const addressHex = address.buf.toString('hex')
        this._storageTries[addressHex] = storageTrie

        // update contract storageRoot
        account.storageRoot = storageTrie.root()
        await this.putAccount(address, account)
        resolve()
      })
    })
  }

  async _writeContractStorage(address: Address, account: Account, key: Buffer, value: Buffer) {
    await this._modifyContractStorage(address, account, async (storageTrie, done) => {
      if (Buffer.isBuffer(value) && value.length) {
        // format input
        const encodedValue = Buffer.from(RLP.encode(Uint8Array.from(value)))
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
  async putContractStorage(address: Address, key: Buffer, value: Buffer): Promise<void> {
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

    value = unpadBuffer(value)
    if (!this._storageCacheSettings.deactivate) {
      const encodedValue = Buffer.from(RLP.encode(Uint8Array.from(value)))
      this._storageCache!.put(address, key, encodedValue)
    } else {
      await this._writeContractStorage(address, account, key, value)
    }
  }

  /**
   * Clears all storage entries for the account corresponding to `address`.
   * @param address -  Address to clear the storage of
   */
  async clearContractStorage(address: Address): Promise<void> {
    const account = await this.getAccount(address)
    if (!account) {
      throw new Error(`clearContractStorage() called on non-existing account (${address})`)
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
  }

  /**
   * Writes all cache items to the trie
   */
  async flush(): Promise<void> {
    if (!this._storageCacheSettings.deactivate) {
      const items = await this._storageCache!.flush()
      for (const item of items) {
        const address = Address.fromString(`0x${item[0]}`)
        const keyHex = item[1]
        const keyBuf = Buffer.from(keyHex, 'hex')
        const value = item[2]

        const decoded = Buffer.from(RLP.decode(Uint8Array.from(value ?? [])) as Uint8Array)
        const account = await this.getAccount(address)
        if (account) {
          await this._writeContractStorage(address, account, keyBuf, decoded)
        }
      }
    }
    if (!this._accountCacheSettings.deactivate) {
      const items = await this._accountCache!.flush()
      for (const item of items) {
        const addressHex = item[0]
        const addressBuf = Buffer.from(addressHex, 'hex')
        const elem = item[1]
        if (elem.accountRLP === undefined) {
          const trie = this._trie
          await trie.del(addressBuf)
        } else {
          const trie = this._trie
          await trie.put(addressBuf, elem.accountRLP)
        }
      }
    }
  }

  /**
   * Get an EIP-1186 proof
   * @param address address to get proof of
   * @param storageSlots storage slots to get proof of
   */
  async getProof(address: Address, storageSlots: Buffer[] = []): Promise<Proof> {
    const account = await this.getAccount(address)
    if (!account) {
      throw new Error(`getProof() can only be called for an existing account`)
    }
    const accountProof: PrefixedHexString[] = (await this._trie.createProof(address.buf)).map((p) =>
      bufferToHex(p)
    )
    const storageProof: StorageProof[] = []
    const storageTrie = await this._getStorageTrie(address, account)

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
      storageProof,
    }
    return returnValue
  }

  /**
   * Verify an EIP-1186 proof. Throws if proof is invalid, otherwise returns true.
   * @param proof the proof to prove
   */
  async verifyProof(proof: Proof): Promise<boolean> {
    const rootHash = Buffer.from(keccak256(toBuffer(proof.accountProof[0])))
    const key = toBuffer(proof.address)
    const accountProof = proof.accountProof.map((rlpString: PrefixedHexString) =>
      toBuffer(rlpString)
    )

    // This returns the account if the proof is valid.
    // Verify that it matches the reported account.
    const value = await new Trie({ useKeyHashing: true }).verifyProof(rootHash, key, accountProof)

    if (value === null) {
      // Verify that the account is empty in the proof.
      const emptyBuffer = Buffer.from('')
      const notEmptyErrorMsg = 'Invalid proof provided: account is not empty'
      const nonce = unpadBuffer(toBuffer(proof.nonce))
      if (!nonce.equals(emptyBuffer)) {
        throw new Error(`${notEmptyErrorMsg} (nonce is not zero)`)
      }
      const balance = unpadBuffer(toBuffer(proof.balance))
      if (!balance.equals(emptyBuffer)) {
        throw new Error(`${notEmptyErrorMsg} (balance is not zero)`)
      }
      const storageHash = toBuffer(proof.storageHash)
      if (!storageHash.equals(KECCAK256_RLP)) {
        throw new Error(`${notEmptyErrorMsg} (storageHash does not equal KECCAK256_RLP)`)
      }
      const codeHash = toBuffer(proof.codeHash)
      if (!codeHash.equals(KECCAK256_NULL)) {
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
      if (!storageRoot.equals(toBuffer(proof.storageHash))) {
        throw new Error(`${invalidErrorMsg} storageHash does not match`)
      }
      if (!codeHash.equals(toBuffer(proof.codeHash))) {
        throw new Error(`${invalidErrorMsg} codeHash does not match`)
      }
    }

    const storageRoot = toBuffer(proof.storageHash)

    for (const stProof of proof.storageProof) {
      const storageProof = stProof.proof.map((value: PrefixedHexString) => toBuffer(value))
      const storageValue = setLengthLeft(toBuffer(stProof.value), 32)
      const storageKey = toBuffer(stProof.key)
      const proofValue = await new Trie({ useKeyHashing: true }).verifyProof(
        storageRoot,
        storageKey,
        storageProof
      )
      const reportedValue = setLengthLeft(
        Buffer.from(RLP.decode(Uint8Array.from((proofValue as Buffer) ?? [])) as Uint8Array),
        32
      )
      if (!reportedValue.equals(storageValue)) {
        throw new Error('Reported trie value does not match storage')
      }
    }
    return true
  }

  /**
   * Gets the state-root of the Merkle-Patricia trie representation
   * of the state of this StateManager. Will error if there are uncommitted
   * checkpoints on the instance.
   * @returns {Promise<Buffer>} - Returns the state-root of the `StateManager`
   */
  async getStateRoot(): Promise<Buffer> {
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
  async setStateRoot(stateRoot: Buffer, clearCache: boolean = true): Promise<void> {
    await this.flush()

    if (!stateRoot.equals(this._trie.EMPTY_TRIE_ROOT)) {
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
            storage[val.key.toString('hex')] = val.value.toString('hex')
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
   * Checks whether there is a state corresponding to a stateRoot
   */
  async hasStateRoot(root: Buffer): Promise<boolean> {
    return this._trie.checkRoot(root)
  }

  /**
   * Checks if the `account` corresponding to `address`
   * exists
   * @param address - Address of the `account` to check
   */
  async accountExists(address: Address): Promise<boolean> {
    const account = await this.getAccount(address)
    if (account) {
      return true
    } else {
      return false
    }
  }

  /**
   * Copies the current instance of the `StateManager`
   * at the last fully committed point, i.e. as if all current
   * checkpoints were reverted.
   */
  copy(): StateManager {
    return new DefaultStateManager({
      trie: this._trie.copy(false),
      prefixCodeHashes: this._prefixCodeHashes,
      accountCacheOpts: this._accountCacheSettings,
      storageCacheOpts: this._storageCacheSettings,
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
