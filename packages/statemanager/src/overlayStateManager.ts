import { Common, Mainnet } from '@ethereumjs/common'
import {
  Account,
  EthereumJSErrorWithoutCode,
  KECCAK256_NULL,
  bytesToBigInt,
  bytesToHex,
  compareBytesLexicographically,
  createAddressFromString,
  equalsBytes,
  hexToBytes,
  isHexString,
  unprefixedHexToBytes,
} from '@ethereumjs/util'
import debugDefault from 'debug'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { OriginalStorageCache } from './cache/index.ts'

import type { Caches, MerkleStateManager, OverlayStateManagerOpts } from './index.ts'

import type {
  AccountFields,
  StateManagerInterface,
  StorageDump,
  StorageRange,
  VerkleAccessWitnessInterface,
} from '@ethereumjs/common'
import type { Address, PrefixedHexString, VerkleCrypto, VerkleExecutionWitness } from '@ethereumjs/util'
import type { Debugger } from 'debug'

/**
 * Overlay StateManager implementation for the VM.
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
export class OverlayStateManager implements StateManagerInterface {
  protected _debug: Debugger
  protected _caches?: Caches

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
   * Next seek key for trieGetNextAtKey iteration
   */
  private _nextSeek: Uint8Array = new Uint8Array(32)
  // User-supplied map of hashed MPT keys to address preimages
  private _frozenTreePreimages: Map<string, Uint8Array>
  /** Total number of leaves migrated so far (purely informative). */
  private _migratedCount = 0
  private _currAccount?: Uint8Array
  /** Sorted storage keys of current account. */
  private _currStorageKeys?: Uint8Array[]
  /** Index into storage keys. */
  private _currStorageIndex = 0
  /** Whether account data/code has been migrated. */
  private _currCodeMigrated = false
  // Whether conversion has been activated.
  private _conversionActivated = false
  /** Whether conversion has finished for all accounts. */
  private _conversionFinished = false

  /**
   * StateManager is run in DEBUG mode (default: false)
   * Taken from DEBUG environment variable
   *
   * Safeguards on debug() calls are added for
   * performance reasons to avoid string literal evaluation
   * @hidden
   */
  protected readonly DEBUG: boolean = false

  constructor(opts: OverlayStateManagerOpts) {
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

    // Accept state managers directly from options (update OverlayStateManagerOpts accordingly)
    this._frozenStateManager = opts.frozenStateManager
    this._activeStateManager = opts.activeStateManager
    this._caches = opts.caches
    this.keccakFunction = opts.common?.customCrypto.keccak256 ?? keccak256
    this.verkleCrypto = opts.common.customCrypto.verkle
    this.originalStorageCache = new OriginalStorageCache(this.getStorage.bind(this))

    // Optionally use user-provided preimages
    this._frozenTreePreimages = opts.frozenTreePreimages ?? new Map()
  }

  /**
   * Gets the account associated with `address` or `undefined` if account does not exist
   * @param address - Address of the `account` to get
   */
  async getAccount(address: Address): Promise<Account | undefined> {
    if (!this._conversionActivated) {
      // Pre-conversion: use only frozen state manager
      return this._frozenStateManager.getAccount(address)
    }

    // Conversion mode: active first, fallback to frozen
    let account = await this._activeStateManager.getAccount(address)
    if (account !== undefined) {
      return account
    }
    return this._frozenStateManager.getAccount(address)
  }

  /**
   * Saves an account into state under the provided `address`.
   * @param address - Address under which to store `account`
   * @param account - The account to store or undefined if to be deleted
   */
  async putAccount(address: Address, account?: Account): Promise<void> {
    if (!this._conversionActivated) {
      // Pre-conversion: always write to frozen
      await this._frozenStateManager.putAccount(address, account);
    } else {
      await this._activeStateManager.putAccount(address, account);
    }
  }
  /**
   * Deletes an account from state under the provided `address`.
   * @param address - Address of the account which should be deleted
   */
  async deleteAccount(address: Address): Promise<void> {
    if (!this._conversionActivated) {
      // Pre-conversion: delete from frozen
      await this._frozenStateManager.deleteAccount(address)
    } else {
      await this._activeStateManager.deleteAccount(address)
    }
  }

  modifyAccountFields = async (address: Address, accountFields: AccountFields): Promise<void> => {
    if (!this._conversionActivated) {
      // Pre-conversion: modify frozen
      await this._frozenStateManager.modifyAccountFields(address, accountFields)
    } else {
      await this._activeStateManager.modifyAccountFields(address, accountFields)
    }
  }

  /**
   * Gets the code associated with `address` or `undefined` if account does not exist
   * @param address - Address of the `account` to get
   */
  getCode = async (address: Address): Promise<Uint8Array> => {
    if (!this._conversionActivated) {
      // Pre-conversion: get from frozen
      return this._frozenStateManager.getCode(address)
    }
    // Conversion mode: active first, fallback to frozen
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
    if (!this._conversionActivated) {
      // Pre-conversion: get from frozen
      return this._frozenStateManager.getCodeSize(address)
    }
    // Conversion mode: active first, fallback to frozen
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
  async putCode(address: Address, value: Uint8Array): Promise<void> {
    if (!this._conversionActivated) {
      // Pre-conversion: write to frozen
      await this._frozenStateManager.putCode(address, value)
    } else {
      await this._activeStateManager.putCode(address, value)
    }
  }

  /**
   * Gets the storage associated with `address` and `key` or `undefined` if account does not exist
   * @param address - Address of the `account` to get
   * @param key - Key of the storage to get
   */
  async getStorage(address: Address, key: Uint8Array): Promise<Uint8Array> {
    if (!this._conversionActivated) {
      // Pre-conversion: get from frozen
      return this._frozenStateManager.getStorage(address, key)
    }
    // Conversion mode: active first, fallback to frozen
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
  async putStorage(address: Address, key: Uint8Array, value: Uint8Array): Promise<void> {
    if (!this._conversionActivated) {
      // Pre-conversion: write to frozen
      await this._frozenStateManager.putStorage(address, key, value)
    } else {
      // Conversion mode: write to active
      await this._activeStateManager.putStorage(address, key, value)
    }
  }

  /**
   * Clears a storage slot.
   * @param address - Address of the `account` to save
   */
  async clearStorage(address: Address): Promise<void> {
    if (!this._conversionActivated) {
      // Pre-conversion: clear frozen
      await this._frozenStateManager.clearStorage(address)
    } else {
      // Conversion mode: clear active
      await this._activeStateManager.clearStorage(address)
    }
  }

  checkpoint = async (): Promise<void> => {
    if (!this._conversionActivated) {
      // Pre-conversion: checkpoint frozen
      await this._frozenStateManager.checkpoint()
    } else {
      // Conversion mode: checkpoint active
      await this._activeStateManager.checkpoint()
    }
    this._checkpointCount++
  }

  commit = async (): Promise<void> => {
    if (!this._conversionActivated) {
      // Pre-conversion: commit frozen
      await this._frozenStateManager.commit()
    } else {
      // Conversion mode: commit active
      await this._activeStateManager.commit()
    }
    this._checkpointCount--
    if (this._checkpointCount === 0) {
      this.originalStorageCache.clear()
    }
  }

  revert = async (): Promise<void> => {
    if (!this._conversionActivated) {
      // Pre-conversion: revert frozen
      await this._frozenStateManager.revert()
    } else {
      // Conversion mode: revert active
      await this._activeStateManager.revert()
    }
    this._checkpointCount--
    if (this._checkpointCount === 0) {
      this.originalStorageCache.clear()
    }
  }

  getStateRoot(): Promise<Uint8Array> {
    if (!this._conversionActivated) {
      // Pre-conversion: return frozen state root
      return this._frozenStateManager.getStateRoot()
    }
    return this._activeStateManager.getStateRoot()
  }


  setStateRoot(stateRoot: Uint8Array, clearCache?: boolean): Promise<void> {
    if (!this._conversionActivated) {
      // Pre-conversion: set frozen
      return this._frozenStateManager.setStateRoot(stateRoot, clearCache)
    } else {
      // Conversion mode: set active
      return this._activeStateManager.setStateRoot(stateRoot, clearCache)
    }
  }

  hasStateRoot(root: Uint8Array): Promise<boolean> {
    if (!this._conversionActivated) {
      // Pre-conversion: check frozen
      return this._frozenStateManager.hasStateRoot(root)
    }
    // Conversion mode: check active
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

  isConversionActivated(): boolean {
    return this._conversionActivated
  }

  activateConversion(): void {
    if (this._conversionActivated) {
      throw EthereumJSErrorWithoutCode('Conversion already activated')
    }
    this._conversionActivated = true
  }

  /**
   * Migrates a specified set of MPT leaves (accounts) to the Verkle tree.
   * The caller is responsible for determining which leaves to migrate (stride logic).
   *
   * @param leafKeys Array of account keys (addresses as Uint8Array) to migrate.
   */
  public async migrateLeavesToVerkle(leafKeys: Uint8Array[]): Promise<void> {
    if (!this._conversionActivated) {
      throw EthereumJSErrorWithoutCode('Transition must be activated to begin migrating leaves.')
    }

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
            const cleanKeyHex = keyHex.startsWith('0x') ? keyHex.slice(2) : keyHex
            const storageKey = unprefixedHexToBytes(cleanKeyHex)
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

  /**
   * Returns true if there are no more leaves pending migration.
   */
  public isFullyConverted(): boolean {
    return this._conversionFinished
  }

  /**
   * Pops up to `stride` conversion units (storage slots or account data+code) per block.
   */
  public async runConversionStep(stride: number): Promise<void> {
    if (this._conversionFinished || stride <= 0) {
      this._debug?.(`Skipping conversion step: conversionFinished=${this._conversionFinished}, stride=${stride}`);
      return;
    }
    let unitsLeft = stride;
    while (unitsLeft > 0) {
      // Find the next account in the frozen state and initialize it as current
      if (!this._currAccount) {
        // Get next account from frozen trie
        this._debug?.(`Fetching next account from frozen state manager, seek=${bytesToHex(this._nextSeek)}`);
        const res = await (this._frozenStateManager as MerkleStateManager).getNextAtKey(this._nextSeek);
        if (!res) {
          this._debug?.(`No more accounts in frozen trie, conversion complete`);
          this._conversionFinished = true;
          break;
        }
        const { key: hashedKey, nextKey: nextSeek } = res
        this._nextSeek = nextSeek ?? new Uint8Array(32);
        this._debug?.(`Found account in trie: hashedKey=${bytesToHex(hashedKey)}, nextSeek=${bytesToHex(this._nextSeek)}`);

        // Lookup address preimage
        const hashedKeyHex = bytesToHex(hashedKey);
        const addrBytes = this._frozenTreePreimages!.get(hashedKeyHex);
        if (!addrBytes) {
          throw EthereumJSErrorWithoutCode(`Missing preimage for key ${bytesToHex(hashedKey)}`);
        }
        this._currAccount = addrBytes;
        const addr = createAddressFromString(bytesToHex(addrBytes));
        const dump = await this._frozenStateManager.dumpStorage?.(addr) ?? {};
        this._currStorageKeys = Object.keys(dump)
          .map((k: string) => (isHexString(k) ? hexToBytes(k) : unprefixedHexToBytes(k)))
          .sort(compareBytesLexicographically);
        this._currStorageIndex = 0;
        this._currCodeMigrated = false;
        continue;
      }

      // Dead account skip logic (only skip storage; still migrate account data+code)
      const addr = createAddressFromString(bytesToHex(this._currAccount!));
      this._debug?.(`Processing account: ${bytesToHex(this._currAccount!)}`);
      const account = await this._frozenStateManager.getAccount(addr);
      // As per EIP-7748, an account with nonce=0 and empty code is “dead”
      const isDeadAccount =
        account !== undefined &&
        account.nonce === 0n &&
        (!account.codeHash || equalsBytes(account.codeHash, KECCAK256_NULL)) &&
        this._currStorageKeys

      this._debug?.(
        `Account details: nonce=${account?.nonce ?? 0n}, ` +
        `codeHash=${account?.codeHash ? bytesToHex(account.codeHash) : 'null'}, ` +
        `storageSlots=${this._currStorageKeys?.length ?? 0}`
      );

      if (isDeadAccount) {
        this._debug?.(
          `Dead account detected (nonce=0, empty code); ` +
          `skipping storage migration but will migrate account data+code: ` +
          bytesToHex(this._currAccount!)
        );

        // Mark all storage slots as “done” so we jump to the account+code phase
        this._currStorageIndex = this._currStorageKeys!.length;
        // Leave this._currCodeMigrated === false to allow the next block to run
        // continue;
      }

      // Migrate storage slots, one per stride unit
      if (this._currStorageKeys && this._currStorageIndex < this._currStorageKeys.length) {
        const storageKey = this._currStorageKeys[this._currStorageIndex];
        this._debug?.(`Migrating storage slot ${this._currStorageIndex + 1}/${this._currStorageKeys.length}: ${bytesToHex(storageKey)}`);
        const val = await this._frozenStateManager.getStorage(addr, storageKey);
        await this._activeStateManager.putStorage(addr, storageKey, val);
        this._currStorageIndex++;
        unitsLeft--;
        this._debug?.(`Storage slot migrated successfully`);
        continue;
      }

      // Migrate account data and code
      if (!this._currCodeMigrated) {
        this._debug?.(`Migrating account data and code`);
        if (account !== undefined) {
          await this._activeStateManager.putAccount(addr, account);
          this._debug?.(`Account data migrated`);

          if (account.codeHash && !equalsBytes(account.codeHash, KECCAK256_NULL)) {
            this._debug?.(`Migrating code (hash: ${bytesToHex(account.codeHash)})`);
            const code = await this._frozenStateManager.getCode(addr);
            if (code) {
              await this._activeStateManager.putCode(addr, code);
              this._debug?.(`Code migrated, size: ${code.length} bytes`);
            }
          } else {
            this._debug?.(`No code to migrate (empty code hash)`);
          }
        } else {
          this._debug?.(`Account is undefined, skipping migration`);
        }
        this._currCodeMigrated = true;
        unitsLeft--;
        this._debug?.(`Account migration completed`);
        continue;
      }

      this._migratedCount++;
      this._debug?.(`Account migration finalized, total migrated: ${this._migratedCount}`);

      // Reset for next account
      this._currAccount = undefined;
      this._currStorageKeys = undefined;
      this._currStorageIndex = 0;
      this._currCodeMigrated = false;

      // Continue to next account/loop
    }
  }

  /**
   * Add preimages to the frozen preimage mapping
   */
  public addPreimages(map: Map<string, Uint8Array>): void {
    this._frozenTreePreimages = new Map([...(this._frozenTreePreimages), ...map])
  }

  public getAppliedKey(address: Uint8Array): Uint8Array {
    return this._frozenStateManager.getAppliedKey!(address)
  }

  public initVerkleExecutionWitness(blockNum: bigint, executionWitness?: VerkleExecutionWitness | null): void {
    this._activeStateManager.initVerkleExecutionWitness!(blockNum, executionWitness)
  }

  public async verifyVerklePostState?(accessWitness: VerkleAccessWitnessInterface): Promise<boolean> {
    return this._activeStateManager.verifyVerklePostState!(accessWitness)
  }
}
