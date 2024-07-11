import {
  Account,
  KECCAK256_NULL,
  KECCAK256_NULL_S,
  VerkleLeafType,
  bigIntToBytes,
  bytesToBigInt,
  bytesToHex,
  bytesToInt32,
  getVerkleKey,
  getVerkleStem,
  getVerkleTreeKeyForCodeChunk,
  getVerkleTreeKeyForStorageSlot,
  hexToBytes,
  padToEven,
  setLengthLeft,
  setLengthRight,
  short,
  toBytes,
  verifyVerkleProof,
} from '@ethereumjs/util'
import debugDefault from 'debug'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { AccessWitness, AccessedStateType, decodeValue } from './accessWitness.js'
import { AccountCache, CacheType, CodeCache, StorageCache } from './cache/index.js'
import { OriginalStorageCache } from './cache/originalStorageCache.js'

import type { AccessedStateWithAddress } from './accessWitness.js'
import type { DefaultStateManager } from './stateManager.js'
import type {
  AccountFields,
  Common,
  EVMStateManagerInterface,
  Proof,
  StorageDump,
  StorageRange,
} from '@ethereumjs/common'
import type {
  Address,
  PrefixedHexString,
  VerkleCrypto,
  VerkleExecutionWitness,
  VerkleProof,
} from '@ethereumjs/util'

const debug = debugDefault('statemanager:verkle')

export interface VerkleState {
  [key: PrefixedHexString]: PrefixedHexString | null
}

export interface EncodedVerkleProof {
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
  /**
   * The common to use
   */
  common?: Common
  accountCacheOpts?: CacheOptions
  storageCacheOpts?: CacheOptions
  codeCacheOpts?: CacheOptions
  accesses?: AccessWitness
  verkleCrypto: VerkleCrypto
  initialStateRoot?: Uint8Array
}

const PUSH_OFFSET = 95
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PUSH1 = PUSH_OFFSET + 1
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PUSH32 = PUSH_OFFSET + 32

const ZEROVALUE = '0x0000000000000000000000000000000000000000000000000000000000000000'

/**
 * Stateless Verkle StateManager implementation for the VM.
 *
 * Experimental.
 *
 * This State Manager enables stateless block execution by building a
 * temporary (1-block) state from the verkle block witness.
 * The Stateless Verkle State Manager then uses that populated state
 * to fetch data requested by the the VM.
 *
 */
export class StatelessVerkleStateManager implements EVMStateManagerInterface {
  _accountCache?: AccountCache
  _storageCache?: StorageCache
  _codeCache?: CodeCache
  _cachedStateRoot?: Uint8Array

  originalStorageCache: OriginalStorageCache

  verkleCrypto: VerkleCrypto
  protected readonly _accountCacheSettings: CacheSettings
  protected readonly _storageCacheSettings: CacheSettings
  protected readonly _codeCacheSettings: CacheSettings

  /**
   * StateManager is run in DEBUG mode (default: false)
   * Taken from DEBUG environment variable
   *
   * Safeguards on debug() calls are added for
   * performance reasons to avoid string literal evaluation
   * @hidden
   */
  protected readonly DEBUG: boolean = false

  private _blockNum = BigInt(0)
  private _executionWitness?: VerkleExecutionWitness

  private _proof: VerkleProof | undefined

  // State along execution (should update)
  private _state: VerkleState = {}

  // Post-state provided from the executionWitness.
  // Should not update. Used for comparing our computed post-state with the canonical one.
  private _postState: VerkleState = {}
  private _preState: VerkleState = {}

  // Checkpointing
  private _checkpoints: VerkleState[] = []
  accessWitness?: AccessWitness

  private keccakFunction: Function

  /**
   * Instantiate the StateManager interface.
   */
  constructor(opts: StatelessVerkleStateManagerOpts) {
    this.originalStorageCache = new OriginalStorageCache(this.getContractStorage.bind(this))

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

    this._codeCacheSettings = {
      deactivate:
        (opts.codeCacheOpts?.deactivate === true || opts.codeCacheOpts?.size === 0) ?? false,
      type: opts.codeCacheOpts?.type ?? CacheType.ORDERED_MAP,
      size: opts.codeCacheOpts?.size ?? 20000,
    }

    if (!this._codeCacheSettings.deactivate) {
      this._codeCache = new CodeCache({
        size: this._codeCacheSettings.size,
        type: this._codeCacheSettings.type,
      })
    }

    this._cachedStateRoot = opts.initialStateRoot

    this.keccakFunction = opts.common?.customCrypto.keccak256 ?? keccak256

    if (opts.verkleCrypto === undefined) {
      throw new Error('verkle crypto required')
    }
    this.verkleCrypto = opts.verkleCrypto

    // Skip DEBUG calls unless 'ethjs' included in environmental DEBUG variables
    // Additional window check is to prevent vite browser bundling (and potentially other) to break
    this.DEBUG =
      typeof window === 'undefined' ? process?.env?.DEBUG?.includes('ethjs') ?? false : false
  }

  async getTransitionStateRoot(_: DefaultStateManager, __: Uint8Array): Promise<Uint8Array> {
    throw Error('not implemented')
  }

  public initVerkleExecutionWitness(
    blockNum: bigint,
    executionWitness?: VerkleExecutionWitness | null,
    accessWitness?: AccessWitness
  ) {
    this._blockNum = blockNum
    if (executionWitness === null || executionWitness === undefined) {
      const errorMsg = `Invalid executionWitness=${executionWitness} for initVerkleExecutionWitness`
      debug(errorMsg)
      throw Error(errorMsg)
    }

    this._executionWitness = executionWitness
    this.accessWitness = accessWitness ?? new AccessWitness({ verkleCrypto: this.verkleCrypto })

    this._proof = executionWitness.verkleProof

    // Populate the pre-state and post-state from the executionWitness
    const preStateRaw = executionWitness.stateDiff.flatMap(({ stem, suffixDiffs }) => {
      const suffixDiffPairs = suffixDiffs.map(({ currentValue, suffix }) => {
        const key = `${stem}${padToEven(Number(suffix).toString(16))}`
        return {
          [key]: currentValue,
        }
      })

      return suffixDiffPairs
    })

    const preState = preStateRaw.reduce((prevValue, currentValue) => {
      const acc = { ...prevValue, ...currentValue }
      return acc
    }, {})

    this._state = preState

    // also maintain a separate preState unaffected by any changes in _state
    this._preState = preStateRaw.reduce((prevValue, currentValue) => {
      const acc = { ...prevValue, ...currentValue }
      return acc
    }, {})

    const postStateRaw = executionWitness.stateDiff.flatMap(({ stem, suffixDiffs }) => {
      const suffixDiffPairs = suffixDiffs.map(({ newValue, suffix }) => {
        const key = `${stem}${padToEven(Number(suffix).toString(16))}` as PrefixedHexString
        // A postState value of null means there was no change from the preState.
        // In this implementation, we therefore replace null with the preState.
        const value = newValue ?? this._state[key]

        return {
          [key]: value,
        }
      })

      return suffixDiffPairs
    })

    const postState = postStateRaw.reduce((prevValue, currentValue) => {
      const acc = { ...prevValue, ...currentValue }
      return acc
    }, {})

    this._postState = postState
    debug('initVerkleExecutionWitness preState', this._state)
    debug('initVerkleExecutionWitness postState', this._postState)
  }

  async checkChunkWitnessPresent(address: Address, codeOffset: number) {
    const chunkId = codeOffset / 31
    const chunkKey = bytesToHex(
      await getVerkleTreeKeyForCodeChunk(address, chunkId, this.verkleCrypto)
    )
    return this._state[chunkKey] !== undefined
  }

  /**
   * Copies the current instance of the `StateManager`
   * at the last fully committed point, i.e. as if all current
   * checkpoints were reverted.
   */
  shallowCopy(): EVMStateManagerInterface {
    const stateManager = new StatelessVerkleStateManager({ verkleCrypto: this.verkleCrypto })
    return stateManager
  }

  /**
   * Adds `value` to the state trie as code, and sets `codeHash` on the account
   * corresponding to `address` to reference this.
   * @param address - Address of the `account` to add the `code` for
   * @param value - The value of the `code`
   */
  async putContractCode(address: Address, value: Uint8Array): Promise<void> {
    if (this.DEBUG) {
      debug(`putContractCode address=${address.toString()} value=${short(value)}`)
    }

    this._codeCache?.put(address, value)
    const codeHash = keccak256(value)
    if (KECCAK256_NULL === codeHash) {
      // If the code hash is the null hash, no code has to be stored
      return
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
    if (this.DEBUG) {
      debug(`getContractCode address=${address.toString()}`)
    }

    if (!this._codeCacheSettings.deactivate) {
      const elem = this._codeCache?.get(address)
      if (elem !== undefined) {
        return elem.code ?? new Uint8Array(0)
      }
    }

    const account = await this.getAccount(address)
    if (!account) {
      return new Uint8Array(0)
    }
    if (!account.isContract()) {
      return new Uint8Array(0)
    }

    // allocate the code and copy onto it from the available witness chunks
    const codeSize = account.codeSize
    // allocate enough to fit the last chunk
    const accessedCode = new Uint8Array(codeSize + 31)

    const chunks = Math.floor(codeSize / 31) + 1
    for (let chunkId = 0; chunkId < chunks; chunkId++) {
      const chunkKey = bytesToHex(
        await getVerkleTreeKeyForCodeChunk(address, chunkId, this.verkleCrypto)
      )
      const codeChunk = this._state[chunkKey]
      if (codeChunk === null) {
        const errorMsg = `Invalid access to a non existent code chunk with chunkKey=${chunkKey}`
        debug(errorMsg)
        throw Error(errorMsg)
      }

      const codeOffset = chunkId * 31
      // if code chunk was accessed as per the provided witnesses copy it over
      if (codeChunk !== undefined) {
        // actual code starts from index 1 in chunk, 0th index is if there are any push data bytes
        const actualChunk = hexToBytes(codeChunk).slice(1)
        accessedCode.set(actualChunk, codeOffset)
      } else {
        // else fill this unaccessed segment with invalid opcode since the evm execution shouldn't
        // end up here
        accessedCode.fill(0xfe, codeOffset, 31)
      }
    }

    // Return accessedCode where only accessed code has been copied
    const contactCode = accessedCode.slice(0, codeSize)
    if (!this._codeCacheSettings.deactivate) {
      this._codeCache?.put(address, contactCode)
    }

    return contactCode
  }

  async getContractCodeSize(address: Address): Promise<number> {
    if (!this._accountCacheSettings.deactivate) {
      const elem = this._accountCache!.get(address)
      if (elem !== undefined) {
        const account =
          elem.accountRLP !== undefined
            ? Account.fromRlpSerializedPartialAccount(elem.accountRLP)
            : undefined
        if (account === undefined) {
          const errorMsg = `account=${account} in cache`
          debug(errorMsg)
          throw Error(errorMsg)
        }
        return account.codeSize
      }
    }

    // load the account basic fields and codeSize should be in it
    const account = await this.getAccount(address)
    if (account === undefined) {
      return 0
    }
    return account.codeSize
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
    if (!this._storageCacheSettings.deactivate) {
      const value = this._storageCache!.get(address, key)
      if (value !== undefined) {
        return value
      }
    }

    const storageKey = await getVerkleTreeKeyForStorageSlot(
      address,
      BigInt(bytesToHex(key)),
      this.verkleCrypto
    )
    const storageValue = toBytes(this._state[bytesToHex(storageKey)])

    if (!this._storageCacheSettings.deactivate) {
      this._storageCache?.put(address, key, storageValue ?? hexToBytes('0x80'))
    }

    return storageValue
  }

  /**
   * Adds value to the state for the `account`
   * corresponding to `address` at the provided `key`.
   * @param address -  Address to set a storage value for
   * @param key - Key to set the value at. Must be 32 bytes long.
   * @param value - Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is a empty or filled with zeros, deletes the value.
   */
  async putContractStorage(address: Address, key: Uint8Array, value: Uint8Array): Promise<void> {
    if (!this._storageCacheSettings.deactivate) {
      this._storageCache!.put(address, key, value)
    } else {
      // TODO: Consider refactoring this in a writeContractStorage function? Like in stateManager.ts
      const storageKey = await getVerkleTreeKeyForStorageSlot(
        address,
        BigInt(bytesToHex(key)),
        this.verkleCrypto
      )
      this._state[bytesToHex(storageKey)] = bytesToHex(setLengthRight(value, 32))
    }
  }

  // Note from Gabriel: Clearing storage is not actually not possible in Verkle.
  // This is because the storage keys are scattered throughout the verkle tree.
  /**
   * Clears all storage entries for the account corresponding to `address`.
   * @param address -  Address to clear the storage of
   */
  async clearContractStorage(address: Address): Promise<void> {
    const stem = getVerkleStem(this.verkleCrypto, address, 0)
    const codeHashKey = getVerkleKey(stem, VerkleLeafType.CodeHash)
    this._storageCache?.clearContractStorage(address)
    // Update codeHash to `c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470`
    this._state[bytesToHex(codeHashKey)] = KECCAK256_NULL_S
  }

  async getAccount(address: Address): Promise<Account | undefined> {
    if (!this._accountCacheSettings.deactivate) {
      const elem = this._accountCache!.get(address)
      if (elem !== undefined) {
        return elem.accountRLP !== undefined
          ? Account.fromRlpSerializedPartialAccount(elem.accountRLP)
          : undefined
      }
    }

    const stem = getVerkleStem(this.verkleCrypto, address, 0)
    const versionKey = getVerkleKey(stem, VerkleLeafType.Version)
    const balanceKey = getVerkleKey(stem, VerkleLeafType.Balance)
    const nonceKey = getVerkleKey(stem, VerkleLeafType.Nonce)
    const codeHashKey = getVerkleKey(stem, VerkleLeafType.CodeHash)
    const codeSizeKey = getVerkleKey(stem, VerkleLeafType.CodeSize)

    const versionRaw = this._state[bytesToHex(versionKey)]
    const balanceRaw = this._state[bytesToHex(balanceKey)]
    const nonceRaw = this._state[bytesToHex(nonceKey)]
    const codeHashRaw = this._state[bytesToHex(codeHashKey)]
    const codeSizeRaw = this._state[bytesToHex(codeSizeKey)]

    // check if the account didn't exist if any of the basic keys have null
    if (versionRaw === null || balanceRaw === null || nonceRaw === null || codeHashRaw === null) {
      // check any of the other key shouldn't have string input available as this account didn't exist
      if (
        typeof versionRaw === `string` ||
        typeof balanceRaw === 'string' ||
        typeof nonceRaw === 'string' ||
        typeof codeHashRaw === 'string'
      ) {
        const errorMsg = `Invalid witness for a non existing address=${address} stem=${bytesToHex(
          stem
        )}`
        debug(errorMsg)
        throw Error(errorMsg)
      } else {
        return undefined
      }
    }

    // check if codehash is correct 32 bytes prefixed hex string
    if (codeHashRaw !== undefined && codeHashRaw !== null && codeHashRaw.length !== 66) {
      const errorMsg = `Invalid codeHashRaw=${codeHashRaw} for address=${address} chunkKey=${bytesToHex(
        codeHashKey
      )}`
      debug(errorMsg)
      throw Error(errorMsg)
    }

    if (
      versionRaw === undefined &&
      balanceRaw === undefined &&
      nonceRaw === undefined &&
      codeHashRaw === undefined &&
      codeSizeRaw === undefined
    ) {
      const errorMsg = `No witness bundled for address=${address} stem=${bytesToHex(stem)}`
      debug(errorMsg)
      throw Error(errorMsg)
    }

    const account = Account.fromPartialAccountData({
      version: typeof versionRaw === 'string' ? bytesToInt32(hexToBytes(versionRaw), true) : null,
      balance: typeof balanceRaw === 'string' ? bytesToBigInt(hexToBytes(balanceRaw), true) : null,
      nonce: typeof nonceRaw === 'string' ? bytesToBigInt(hexToBytes(nonceRaw), true) : null,
      codeHash: typeof codeHashRaw === 'string' ? hexToBytes(codeHashRaw) : null,
      // if codeSizeRaw is null, it means account didnt exist or it was EOA either way codeSize is 0
      // if codeSizeRaw is undefined, then we pass in null which in our context of partial account means
      // not specified
      codeSize:
        typeof codeSizeRaw === 'string'
          ? bytesToInt32(hexToBytes(codeSizeRaw), true)
          : codeSizeRaw === null
          ? 0
          : null,
      storageRoot: null,
    })

    if (this.DEBUG) {
      debug(`getAccount address=${address.toString()} stem=${short(stem)}`)
    }

    if (!this._accountCacheSettings.deactivate) {
      this._accountCache?.put(address, account, true)
    }

    return account
  }

  async putAccount(address: Address, account: Account): Promise<void> {
    if (this.DEBUG) {
      debug(`putAccount address=${address.toString()}`)
    }

    if (this._accountCacheSettings.deactivate) {
      const stem = getVerkleStem(this.verkleCrypto, address, 0)
      const balanceKey = getVerkleKey(stem, VerkleLeafType.Balance)
      const nonceKey = getVerkleKey(stem, VerkleLeafType.Nonce)
      const codeHashKey = getVerkleKey(stem, VerkleLeafType.CodeHash)

      const balanceBuf = setLengthRight(bigIntToBytes(account.balance, true), 32)
      const nonceBuf = setLengthRight(bigIntToBytes(account.nonce, true), 32)

      this._state[bytesToHex(balanceKey)] = bytesToHex(balanceBuf)
      this._state[bytesToHex(nonceKey)] = bytesToHex(nonceBuf)
      this._state[bytesToHex(codeHashKey)] = bytesToHex(account.codeHash)
    } else {
      if (account !== undefined) {
        this._accountCache!.put(address, account, true)
      } else {
        this._accountCache!.del(address)
      }
    }
  }

  /**
   * Deletes an account from state under the provided `address`.
   * @param address - Address of the account which should be deleted
   */
  async deleteAccount(address: Address) {
    if (this.DEBUG) {
      debug(`Delete account ${address}`)
    }

    this._codeCache?.del(address)
    this._accountCache!.del(address)

    if (!this._storageCacheSettings.deactivate) {
      this._storageCache?.clearContractStorage(address)
    }
  }

  async modifyAccountFields(address: Address, accountFields: AccountFields): Promise<void> {
    let account = await this.getAccount(address)
    if (!account) {
      account = new Account()
    }

    account._nonce = accountFields.nonce ?? account._nonce
    account._balance = accountFields.balance ?? account._balance
    account._storageRoot = accountFields.storageRoot ?? account._storageRoot
    account._codeHash = accountFields.codeHash ?? account._codeHash
    await this.putAccount(address, account)
  }

  getProof(_: Address, __: Uint8Array[] = []): Promise<Proof> {
    throw new Error('Not implemented yet')
  }
  /**
   * Verifies whether the execution witness matches the stateRoot
   * @param {Uint8Array} stateRoot - The stateRoot to verify the executionWitness against
   * @returns {boolean} - Returns true if the executionWitness matches the provided stateRoot, otherwise false
   */
  verifyProof(stateRoot: Uint8Array): boolean {
    if (this._executionWitness === undefined) {
      debug('Missing executionWitness')
      return false
    }

    return verifyVerkleProof(this.verkleCrypto, stateRoot, this._executionWitness)
  }

  // Verifies that the witness post-state matches the computed post-state
  verifyPostState(): boolean {
    // track what all chunks were accessed so as to compare in the end if any chunks were missed
    // in access while comparising against the provided poststate in the execution witness
    const accessedChunks = new Map<string, boolean>()
    // switch to false if postVerify fails
    let postFailures = 0

    for (const accessedState of this.accessWitness!.accesses()) {
      const { address, type } = accessedState
      let extraMeta = ''
      if (accessedState.type === AccessedStateType.Code) {
        extraMeta = `codeOffset=${accessedState.codeOffset}`
      } else if (accessedState.type === AccessedStateType.Storage) {
        extraMeta = `slot=${accessedState.slot}`
      }

      const { chunkKey } = accessedState
      accessedChunks.set(chunkKey, true)
      const computedValue = this.getComputedValue(accessedState) ?? this._preState[chunkKey]
      if (computedValue === undefined) {
        debug(
          `Block accesses missing in canonical address=${address} type=${type} ${extraMeta} chunkKey=${chunkKey}`
        )
        postFailures++
        continue
      }

      let canonicalValue: PrefixedHexString | null | undefined = this._postState[chunkKey]

      if (canonicalValue === undefined) {
        debug(
          `Block accesses missing in canonical address=${address} type=${type} ${extraMeta} chunkKey=${chunkKey}`
        )
        postFailures++
        continue
      }

      // if the access type is code, then we can't match the first byte because since the computed value
      // doesn't has the first byte for push data since previous chunk code itself might not be available
      if (accessedState.type === AccessedStateType.Code) {
        // computedValue = computedValue !== null ? `0x${computedValue.slice(4)}` : null
        canonicalValue = canonicalValue !== null ? `0x${canonicalValue.slice(4)}` : null
      } else if (
        accessedState.type === AccessedStateType.Storage &&
        canonicalValue === null &&
        computedValue === ZEROVALUE
      ) {
        canonicalValue = ZEROVALUE
      }

      if (computedValue !== canonicalValue) {
        const decodedComputedValue = decodeValue(accessedState.type, computedValue)
        const decodedCanonicalValue = decodeValue(accessedState.type, canonicalValue)

        const displayComputedValue =
          computedValue === decodedComputedValue
            ? computedValue
            : `${computedValue} (${decodedComputedValue})`
        const displayCanonicalValue =
          canonicalValue === decodedCanonicalValue
            ? canonicalValue
            : `${canonicalValue} (${decodedCanonicalValue})`

        debug(
          `Block accesses mismatch address=${address} type=${type} ${extraMeta} chunkKey=${chunkKey}`
        )
        debug(`expected=${displayCanonicalValue}`)
        debug(`computed=${displayComputedValue}`)
        postFailures++
      }
    }

    for (const canChunkKey of Object.keys(this._postState)) {
      if (accessedChunks.get(canChunkKey) === undefined) {
        debug(`Missing chunk access for canChunkKey=${canChunkKey}`)
        postFailures++
      }
    }

    const verifyPassed = postFailures === 0
    debug(`verifyPostState verifyPassed=${verifyPassed} postFailures=${postFailures}`)

    return verifyPassed
  }

  getComputedValue(accessedState: AccessedStateWithAddress): PrefixedHexString | null {
    const { address, type } = accessedState
    switch (type) {
      case AccessedStateType.Version: {
        const encodedAccount = this._accountCache?.get(address)?.accountRLP
        if (encodedAccount === undefined) {
          return null
        }
        // Version is always 0
        // TODO: Update this when versioning is added to accounts
        return ZEROVALUE
      }
      case AccessedStateType.Balance: {
        const encodedAccount = this._accountCache?.get(address)?.accountRLP
        if (encodedAccount === undefined) {
          return null
        }

        const balanceBigint = Account.fromRlpSerializedPartialAccount(encodedAccount).balance
        return bytesToHex(setLengthRight(bigIntToBytes(balanceBigint, true), 32))
      }

      case AccessedStateType.Nonce: {
        const encodedAccount = this._accountCache?.get(address)?.accountRLP
        if (encodedAccount === undefined) {
          return null
        }
        const nonceBigint = Account.fromRlpSerializedPartialAccount(encodedAccount).nonce
        return bytesToHex(setLengthRight(bigIntToBytes(nonceBigint, true), 32))
      }

      case AccessedStateType.CodeHash: {
        const encodedAccount = this._accountCache?.get(address)?.accountRLP
        if (encodedAccount === undefined) {
          return null
        }
        return bytesToHex(Account.fromRlpSerializedPartialAccount(encodedAccount).codeHash)
      }

      case AccessedStateType.CodeSize: {
        const codeSize = this._codeCache?.get(address)?.code?.length
        if (codeSize === undefined) {
          // it could be an EOA lets check for that
          const encodedAccount = this._accountCache?.get(address)?.accountRLP
          if (encodedAccount === undefined) {
            return null
          }

          const account = Account.fromRlpSerializedPartialAccount(encodedAccount)
          if (account.isContract()) {
            const errorMsg = `Code cache not found for address=${address.toString()}`
            debug(errorMsg)
            throw Error(errorMsg)
          } else {
            return null
          }
        }

        return bytesToHex(setLengthRight(bigIntToBytes(BigInt(codeSize), true), 32))
      }

      case AccessedStateType.Code: {
        const { codeOffset } = accessedState
        const code = this._codeCache?.get(address)?.code
        if (code === undefined) {
          return null
        }

        // we can only compare the actual code because to compare the first byte would
        // be very tricky and impossible in certain scenarios like when the previous code chunk
        // was not accessed and hence not even provided in the witness
        const chunkSize = 31
        return bytesToHex(setLengthRight(code.slice(codeOffset, codeOffset + chunkSize), chunkSize))
      }

      case AccessedStateType.Storage: {
        const { slot } = accessedState
        const key = setLengthLeft(bigIntToBytes(slot), 32)

        const storage = this._storageCache?.get(address, key)
        if (storage === undefined) {
          return null
        }
        return bytesToHex(setLengthLeft(storage, 32))
      }
    }
  }

  /**
   * Checkpoints the current state of the StateManager instance.
   * State changes that follow can then be committed by calling
   * `commit` or `reverted` by calling rollback.
   */
  async checkpoint(): Promise<void> {
    this._checkpoints.push(this._state)
    this._accountCache?.checkpoint()
    this._storageCache?.checkpoint()
    this._codeCache?.checkpoint()
  }

  /**
   * Commits the current change-set to the instance since the
   * last call to checkpoint.
   */
  async commit(): Promise<void> {
    this._checkpoints.pop()
    this._accountCache!.commit()
    this._storageCache?.commit()
    this._codeCache?.commit()
  }

  // TODO
  async hasStateRoot(_: Uint8Array): Promise<boolean> {
    return true
  }

  /**
   * Reverts the current change-set to the instance since the
   * last call to checkpoint.
   */
  async revert(): Promise<void> {
    // setup trie checkpointing
    this._checkpoints.pop()
    this._accountCache?.revert()
    this._storageCache?.revert()
    this._codeCache?.revert()
  }

  /**
   * Writes all cache items to the trie
   */
  async flush(): Promise<void> {}

  /**
   * Gets the cache state root.
   * This is used to persist the stateRoot between blocks, so that blocks can retrieve the stateRoot of the parent block.
   * This is required to verify and prove verkle execution witnesses.
   * @returns {Promise<Uint8Array>} - Returns the cached state root
   */
  async getStateRoot(): Promise<Uint8Array> {
    if (this._cachedStateRoot === undefined) {
      throw new Error('Cache state root missing')
    }
    return this._cachedStateRoot
  }

  /**
   * Sets the cache state root.
   * This is used to persist the stateRoot between blocks, so that blocks can retrieve the stateRoot of the parent block.
   * @param stateRoot - The stateRoot to set
   */
  async setStateRoot(stateRoot: Uint8Array): Promise<void> {
    this._cachedStateRoot = stateRoot
  }

  /**
   * Dumps the RLP-encoded storage values for an `account` specified by `address`.
   * @param address - The address of the `account` to return storage for
   * @returns {Promise<StorageDump>} - The state of the account as an `Object` map.
   * Keys are are the storage keys, values are the storage values as strings.
   * Both are represented as hex strings without the `0x` prefix.
   */
  async dumpStorage(_: Address): Promise<StorageDump> {
    throw Error('not implemented')
  }

  dumpStorageRange(_: Address, __: bigint, ___: number): Promise<StorageRange> {
    throw Error('not implemented')
  }

  /**
   * Clears all underlying caches
   */
  clearCaches() {
    this._accountCache?.clear()
    this._codeCache?.clear()
    this._storageCache?.clear()
  }

  generateCanonicalGenesis(_initState: any): Promise<void> {
    return Promise.resolve()
  }

  getAppliedKey(_: Uint8Array): Uint8Array {
    throw Error('not implemented')
  }
}
