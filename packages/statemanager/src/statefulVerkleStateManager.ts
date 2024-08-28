import { Common, Mainnet } from '@ethereumjs/common'
import {
  type Account,
  type Address,
  MapDB,
  VerkleLeafType,
  bigIntToBytes,
  bytesToBigInt,
  bytesToInt32,
  createAccountFromRLP,
  createPartialAccount,
  getVerkleKey,
  getVerkleStem,
  setLengthRight,
  short,
} from '@ethereumjs/util'
import { VerkleTree } from '@ethereumjs/verkle'
import debugDefault from 'debug'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { OriginalStorageCache } from './cache/originalStorageCache.js'
import { modifyAccountFields } from './util.js'

import type { Caches } from './cache/caches.js'
import type { StatefulVerkleStateManagerOpts } from './types.js'
import type {
  AccountFields,
  Proof,
  StateManagerInterface,
  StorageDump,
  StorageRange,
} from '@ethereumjs/common'
import type { VerkleCrypto } from '@ethereumjs/util'
import type { Debugger } from 'debug'
export class StatefulVerkleStateManager implements StateManagerInterface {
  protected _debug: Debugger
  protected _caches?: Caches

  originalStorageCache: OriginalStorageCache

  protected _trie: VerkleTree

  public readonly common: Common

  protected _checkpointCount: number

  protected verkleCrypto: VerkleCrypto
  /**
   * StateManager is run in DEBUG mode (default: false)
   * Taken from DEBUG environment variable
   *
   * Safeguards on debug() calls are added for
   * performance reasons to avoid string literal evaluation
   * @hidden
   */
  protected readonly DEBUG: boolean = false

  private keccakFunction: Function

  constructor(opts: StatefulVerkleStateManagerOpts) {
    // Skip DEBUG calls unless 'ethjs' included in environmental DEBUG variables
    // Additional window check is to prevent vite browser bundling (and potentially other) to break
    this.DEBUG =
      typeof window === 'undefined' ? (process?.env?.DEBUG?.includes('ethjs') ?? false) : false

    this._checkpointCount = 0

    if (opts.common?.isActivatedEIP(6800) === false)
      throw new Error('EIP-6800 required for verkle state management')

    this.common = opts.common ?? new Common({ chain: Mainnet, eips: [6800] })
    this._trie =
      opts.trie ??
      new VerkleTree({ verkleCrypto: opts.verkleCrypto, db: new MapDB<Uint8Array, Uint8Array>() })
    this._debug = debugDefault('statemanager:statefulVerkleStatemanager')
    this.originalStorageCache = new OriginalStorageCache(this.getStorage.bind(this))
    this._caches = opts.caches
    this.keccakFunction = opts.common?.customCrypto.keccak256 ?? keccak256
    this.verkleCrypto = opts.verkleCrypto
  }

  getAccount = async (address: Address): Promise<Account | undefined> => {
    const elem = this._caches?.account?.get(address)
    if (elem !== undefined) {
      return elem.accountRLP !== undefined ? createAccountFromRLP(elem.accountRLP) : undefined
    }

    const stem = getVerkleStem(this.verkleCrypto, address, 0)
    const versionKey = getVerkleKey(stem, VerkleLeafType.Version)
    const balanceKey = getVerkleKey(stem, VerkleLeafType.Balance)
    const nonceKey = getVerkleKey(stem, VerkleLeafType.Nonce)
    const codeHashKey = getVerkleKey(stem, VerkleLeafType.CodeHash)
    const codeSizeKey = getVerkleKey(stem, VerkleLeafType.CodeSize)
    const version = await this._trie.get(versionKey)
    const balance = await this._trie.get(balanceKey)
    const nonce = await this._trie.get(nonceKey)
    const codeHash = await this._trie.get(codeHashKey)
    // TODO: Only do this check if codeHash !== KECCAK_RLP (or whatever the empty array is)
    const codeSize = await this._trie.get(codeSizeKey)

    const account = createPartialAccount({
      version: Array.isArray(version) ? bytesToInt32(version, true) : null,
      balance: Array.isArray(balance) ? bytesToBigInt(balance, true) : null,
      nonce: Array.isArray(nonce) ? bytesToBigInt(nonce, true) : null,
      codeHash: Array.isArray(codeHash) ? codeHash : null,
      // if codeSizeRaw is null, it means account didn't exist or it was EOA either way codeSize is 0
      // if codeSizeRaw is undefined, then we pass in null which in our context of partial account means
      // not specified
      codeSize: Array.isArray(codeSize) ? bytesToInt32(codeSize, true) : null,
      storageRoot: null,
    })
    // check if the account didn't exist if any of the basic keys are undefined
    if (
      version === undefined ||
      balance === undefined ||
      nonce === undefined ||
      codeHash === undefined
    ) {
      if (this.DEBUG) {
        this._debug(`getAccount address=${address.toString()} from DB (non-existent)`)
      }
      this._caches?.account?.put(address, account)
    }

    if (this.DEBUG) {
      this._debug(`getAccount address=${address.toString()} stem=${short(stem)}`)
    }
    return account
  }

  putAccount = async (address: Address, account?: Account): Promise<void> => {
    if (this.DEBUG) {
      this._debug(
        `Save account address=${address} nonce=${account?.nonce} balance=${
          account?.balance
        } contract=${account && account.isContract() ? 'yes' : 'no'} empty=${
          account && account.isEmpty() ? 'yes' : 'no'
        }`,
      )

      if (this._caches?.account === undefined) {
        const stem = getVerkleStem(this.verkleCrypto, address, 0)
        const balanceKey = getVerkleKey(stem, VerkleLeafType.Balance)
        const nonceKey = getVerkleKey(stem, VerkleLeafType.Nonce)
        const codeHashKey = getVerkleKey(stem, VerkleLeafType.CodeHash)

        const balanceBuf = setLengthRight(bigIntToBytes(account.balance, true), 32)
        const nonceBuf = setLengthRight(bigIntToBytes(account.nonce, true), 32)
      } else {
        if (account !== undefined) {
          this._caches?.account?.put(address, account, true)
        } else {
          this._caches?.account?.del(address)
        }
      }
    }
  }
  deleteAccount = async (address: Address): Promise<void> => {
    if (this.DEBUG) {
      this._debug(`Delete account ${address}`)
    }

    this._caches?.deleteAccount(address)

    if (this._caches?.account === undefined) {
      await this._trie.del(address.bytes)
    }
  }

  modifyAccountFields = async (address: Address, accountFields: AccountFields): Promise<void> => {
    await modifyAccountFields(this, address, accountFields)
  }
  putCode(address: Address, value: Uint8Array): Promise<void> {
    throw new Error('Method not implemented.')
  }
  getCode(address: Address): Promise<Uint8Array> {
    throw new Error('Method not implemented.')
  }
  getCodeSize(address: Address): Promise<number> {
    throw new Error('Method not implemented.')
  }
  getStorage(address: Address, key: Uint8Array): Promise<Uint8Array> {
    throw new Error('Method not implemented.')
  }
  putStorage(address: Address, key: Uint8Array, value: Uint8Array): Promise<void> {
    throw new Error('Method not implemented.')
  }
  clearStorage(address: Address): Promise<void> {
    throw new Error('Method not implemented.')
  }
  checkpoint = async (): Promise<void> => {
    this._trie.checkpoint()
    this._caches?.checkpoint()
    this._checkpointCount++
  }
  commit(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  revert(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  getStateRoot(): Promise<Uint8Array> {
    throw new Error('Method not implemented.')
  }
  setStateRoot(stateRoot: Uint8Array, clearCache?: boolean): Promise<void> {
    throw new Error('Method not implemented.')
  }
  hasStateRoot(root: Uint8Array): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  getProof?(address: Address, storageSlots: Uint8Array[]): Promise<Proof> {
    throw new Error('Method not implemented.')
  }
  dumpStorage?(address: Address): Promise<StorageDump> {
    throw new Error('Method not implemented.')
  }
  dumpStorageRange?(address: Address, startKey: bigint, limit: number): Promise<StorageRange> {
    throw new Error('Method not implemented.')
  }

  verifyVerkleProof?(stateRoot: Uint8Array): boolean {
    throw new Error('Method not implemented.')
  }
  verifyPostState?(): boolean {
    throw new Error('Method not implemented.')
  }
  checkChunkWitnessPresent?(contract: Address, programCounter: number): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  getAppliedKey?(address: Uint8Array): Uint8Array {
    throw new Error('Method not implemented.')
  }
  clearCaches(): void {
    throw new Error('Method not implemented.')
  }
  shallowCopy(downlevelCaches?: boolean): StateManagerInterface {
    throw new Error('Method not implemented.')
  }
}
