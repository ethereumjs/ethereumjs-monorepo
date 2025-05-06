import { Common, Mainnet } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import {
  Account,
  EthereumJSErrorWithoutCode,
  KECCAK256_NULL,
  MapDB,
  VERKLE_CODE_CHUNK_SIZE,
  VERKLE_CODE_OFFSET,
  VERKLE_NODE_WIDTH,
  VerkleLeafType,
  bytesToBigInt,
  bytesToHex,
  chunkifyCode,
  createAccountFromRLP,
  createAddressFromString,
  createPartialAccount,
  createPartialAccountFromRLP,
  decodeVerkleLeafBasicData,
  encodeVerkleLeafBasicData,
  equalsBytes,
  generateChunkSuffixes,
  generateCodeStems,
  getVerkleStem,
  getVerkleTreeKeyForStorageSlot,
  hexToBytes,
  setLengthLeft,
  short,
  unprefixedHexToBytes,
} from '@ethereumjs/util'
import { LeafVerkleNodeValue, VerkleTree } from '@ethereumjs/verkle'
import debugDefault from 'debug'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { OriginalStorageCache } from './cache/index.ts'
import { modifyAccountFields } from './util.ts'

import type { Caches, TransitionStateManagerOpts } from './index.ts'

import type {
  AccountFields,
  StateManagerInterface,
  StorageDump,
  StorageRange,
} from '@ethereumjs/common'
import type { MerklePatriciaTrie } from '@ethereumjs/mpt'
import { createMPT } from '@ethereumjs/mpt'
import type { Address, PrefixedHexString, VerkleCrypto } from '@ethereumjs/util'
import type { Debugger } from 'debug'

/**
 * Transition StateManager implementation for the VM.
 *
 * The state manager abstracts from the underlying data store
 * by providing higher level access to accounts, contract code
 * and storage slots.
 *
 * This state manager handles two underlying data structures (e.g. an MPT and a Verkle tree)
 * and allows transition between a frozen and an active one as per these EIPS:
 * EIP-7612: https://eips.ethereum.org/EIPS/eip-7612
 * EIP-7748: https://eips.ethereum.org/EIPS/eip-7748
 */
export class TransitionStateManager implements StateManagerInterface {
  protected _debug: Debugger
  protected _caches?: Caches

  preStateRoot: Uint8Array
  originalStorageCache: OriginalStorageCache
  verkleCrypto: VerkleCrypto

  // The frozen state manager that we are transitioning away from. Read-only.
  protected _frozenStateManager: StateManagerInterface
  // The new state manager that we are transitioning to. Can be written to.
  protected _activeStateManager: StateManagerInterface

  public readonly common: Common

  protected _checkpointCount: number

  private keccakFunction: Function

  /**
   * StateManager is run in DEBUG mode (default: false)
   * Taken from DEBUG environment variable
   *
   * Safeguards on debug() calls are added for
   * performance reasons to avoid string literal evaluation
   * @hidden
   */
  protected readonly DEBUG: boolean = false

  constructor(opts: TransitionStateManagerOpts) {
    // Skip DEBUG calls unless 'ethjs' included in environmental DEBUG variables
    // Additional window check is to prevent vite browser bundling (and potentially other) to break
    this.DEBUG =
      typeof window === 'undefined' ? (process?.env?.DEBUG?.includes('ethjs') ?? false) : false

    this._debug = debugDefault('statemanager:transition')

    this.common = opts.common ?? new Common({ chain: Mainnet })

    this._checkpointCount = 0

    if (opts.common.customCrypto.verkle === undefined) {
      throw EthereumJSErrorWithoutCode('verkle crypto required')
    }

    // Accept state managers directly from options (update TransitionStateManagerOpts accordingly)
    this._frozenStateManager = opts.frozenStateManager
    this._activeStateManager = opts.activeStateManager
    this._caches = opts.caches
    this.keccakFunction = opts.common?.customCrypto.keccak256 ?? keccak256
    this.verkleCrypto = opts.common.customCrypto.verkle
    this.originalStorageCache = new OriginalStorageCache(this.getStorage.bind(this))
    this._caches = opts.caches
    this.preStateRoot = new Uint8Array(32) // Initial state root is zeroes
  }

  /**
   * Gets the account associated with `address` or `undefined` if account does not exist
   * @param address - Address of the `account` to get
   */
  async getAccount(address: Address): Promise<Account | undefined> {
    // Try from active first
    let account = await this._activeStateManager.getAccount(address)
    if (account !== undefined) {
      return account
    }
    // Fallback to frozen
    return this._frozenStateManager.getAccount(address)
  }

  /**
   * Saves an account into state under the provided `address`.
   * @param address - Address under which to store `account`
   * @param account - The account to store or undefined if to be deleted
   */
  putAccount = async (address: Address, account?: Account): Promise<void> => {
    await this._activeStateManager.putAccount(address, account)
  }

  /**
   * Deletes an account from state under the provided `address`.
   * @param address - Address of the account which should be deleted
   */
  deleteAccount = async (address: Address): Promise<void> => {
    await this._activeStateManager.deleteAccount(address)
  }

  modifyAccountFields = async (address: Address, accountFields: AccountFields): Promise<void> => {
    await this._activeStateManager.modifyAccountFields(address, accountFields)
  }

  /**
   * Gets the code associated with `address` or `undefined` if account does not exist
   * @param address - Address of the `account` to get
   */
  getCode = async (address: Address): Promise<Uint8Array> => {
    // Try from active first
    let code = await this._activeStateManager.getCode(address)
    if (code && code.length > 0) {
      return code
    }
    // Fallback to frozen
    return this._frozenStateManager.getCode(address)
  }

  /**
   * Gets the code size associated with `address` or `undefined` if account does not exist
   * @param address - Address of the `account` to get
   */
  getCodeSize = async (address: Address): Promise<number> => {
    let size = await this._activeStateManager.getCodeSize(address)
    if (size && size > 0) {
      return size
    }
    return this._frozenStateManager.getCodeSize(address)
  }

  /**
   * Saves contract code for an account at the provided address.
   * @param address - Address of the account
   * @param value - Contract code as Uint8Array
   */
  putCode = async (address: Address, value: Uint8Array): Promise<void> => {
    await this._activeStateManager.putCode(address, value)
  }

  /**
   * Gets the storage associated with `address` and `key` or `undefined` if account does not exist
   * @param address - Address of the `account` to get
   * @param key - Key of the storage to get
   */
  getStorage = async (address: Address, key: Uint8Array): Promise<Uint8Array> => {
    let value = await this._activeStateManager.getStorage(address, key)
    if (value && value.length > 0) {
      return value
    }
    return this._frozenStateManager.getStorage(address, key)
  }

  /**
   * Saves a value to storage.
   * @param address - Address of the `account` to save
   * @param key - Key of the storage to save
   * @param value - Value to save
   */
  putStorage = async (address: Address, key: Uint8Array, value: Uint8Array): Promise<void> => {
    await this._activeStateManager.putStorage(address, key, value)
  }

  /**
   * Clears a storage slot.
   * @param address - Address of the `account` to save
   */
  clearStorage = async (address: Address): Promise<void> => {
    await this._activeStateManager.clearStorage(address)
  }

  checkpoint = async (): Promise<void> => {
    await this._activeStateManager.checkpoint()
    this._checkpointCount++
  }

  commit = async (): Promise<void> => {
    await this._activeStateManager.commit()
    this._checkpointCount--
    if (this._checkpointCount === 0) {
      this.originalStorageCache.clear()
    }
  }

  revert = async (): Promise<void> => {
    await this._activeStateManager.revert()
    this._checkpointCount--
    if (this._checkpointCount === 0) {
      this.originalStorageCache.clear()
    }
  }

  getStateRoot(): Promise<Uint8Array> {
    return this._activeStateManager.getStateRoot()
  }

  setStateRoot(stateRoot: Uint8Array, clearCache?: boolean): Promise<void> {
    return this._activeStateManager.setStateRoot(stateRoot, clearCache)
  }

  hasStateRoot(root: Uint8Array): Promise<boolean> {
    return this._activeStateManager.hasStateRoot(root)
  }

  dumpStorage?(_address: Address): Promise<StorageDump> {
    throw EthereumJSErrorWithoutCode('Method not implemented.')
  }

  dumpStorageRange?(_address: Address, _startKey: bigint, _limit: number): Promise<StorageRange> {
    throw EthereumJSErrorWithoutCode('Method not implemented.')
  }

  clearCaches(): void {
    this._caches?.clear()
  }

  shallowCopy(_downlevelCaches?: boolean): StateManagerInterface {
    throw EthereumJSErrorWithoutCode('Method not implemented.')
  }

  async checkChunkWitnessPresent(_address: Address, _codeOffset: number): Promise<boolean> {
    throw EthereumJSErrorWithoutCode('Method not implemented.')
  }

  /**
   * Migrates a specified set of MPT leaves (accounts) to the Verkle tree.
   * The caller is responsible for determining which leaves to migrate (stride logic).
   *
   * @param leafKeys Array of account keys (addresses as Uint8Array) to migrate.
   */
  public async migrateLeavesToVerkle(leafKeys: Uint8Array[]): Promise<void> {
    for (const key of leafKeys) {
      // 1. Get the account from the frozen state manager
      const address = createAddressFromString(bytesToHex(key))
      const account = await this._frozenStateManager.getAccount(address)
      if (!account) {
        // No account at this key, skip
        continue
      }
      // 2. Insert account into active state manager
      await this._activeStateManager.putAccount(address, account)
      // 3. If account has code, migrate code as well
      if (account.codeHash && !equalsBytes(account.codeHash, KECCAK256_NULL)) {
        const code = await this._frozenStateManager.getCode(address)
        if (code) {
          await this._activeStateManager.putCode(address, code)
        }
      }
      // 4. Migrate storage if storageRoot is not empty
      if (account.storageRoot && !equalsBytes(account.storageRoot, KECCAK256_NULL)) {
        // For generic state managers, we need to enumerate all storage keys
        // Here we assume frozenStateManager exposes a method to dump storage (or similar)
        if (typeof this._frozenStateManager.dumpStorage === 'function') {
          const storageDump = await this._frozenStateManager.dumpStorage(address)
          for (const [keyHex, value] of Object.entries(storageDump)) {
            const storageKey = unprefixedHexToBytes(keyHex)
            await this._activeStateManager.putStorage(
              address,
              storageKey,
              hexToBytes(value as PrefixedHexString),
            )
          }
        } else {
          throw EthereumJSErrorWithoutCode('dumpStorage not implemented on frozenStateManager')
        }
      }
    }
  }
}
