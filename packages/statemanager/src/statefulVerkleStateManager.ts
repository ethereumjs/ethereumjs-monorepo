import { Common, Mainnet } from '@ethereumjs/common'
import {
  Account,
  type Address,
  KECCAK256_NULL,
  MapDB,
  VerkleLeafType,
  chunkifyCode,
  createAccountFromRLP,
  createPartialAccount,
  decodeVerkleLeafBasicData,
  encodeVerkleLeafBasicData,
  equalsBytes,
  getVerkleStem,
  getVerkleTreeKeyForCodeChunk,
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

    // First retrieve the account "header" values from the trie
    const accountValues = await this._trie.get(stem, [
      VerkleLeafType.BasicData,
      VerkleLeafType.CodeHash,
    ])

    let account
    if (accountValues[0] !== undefined) {
      const basicData = decodeVerkleLeafBasicData(accountValues[0]!)
      account = createPartialAccount({
        version: basicData.version,
        balance: basicData.balance,
        nonce: basicData.nonce,
        codeHash:
          accountValues[1] === undefined
            ? KECCAK256_NULL // codeHash is undefined in trie (i.e. not touched)
            : equalsBytes(accountValues[1], new Uint8Array(32))
              ? KECCAK256_NULL // codeHash is deleted in trie (i.e. overwritten with zeroes)
              : accountValues[1],
        codeSize: basicData.codeSize,
        storageRoot: null, // TODO: Add storage stuff
      })
    }
    // check if the account didn't exist if any of the basic keys are undefined
    else if (accountValues[0] === undefined || accountValues[1] === undefined) {
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
    }
    if (this._caches?.account === undefined) {
      if (account !== undefined) {
        const stem = getVerkleStem(this.verkleCrypto, address, 0)
        const basicDataBytes = encodeVerkleLeafBasicData(account)
        await this._trie.put(
          stem,
          [VerkleLeafType.BasicData, VerkleLeafType.CodeHash],
          [basicDataBytes, account.codeHash],
        )
      } else {
        // Delete account
      }
    } else {
      if (account !== undefined) {
        this._caches?.account?.put(address, account, true)
      } else {
        this._caches?.account?.del(address)
      }
    }
  }

  deleteAccount = async (address: Address): Promise<void> => {
    if (this.DEBUG) {
      this._debug(`Delete account ${address}`)
    }

    this._caches?.deleteAccount(address)

    if (this._caches?.account === undefined) {
      const stem = getVerkleStem(this.verkleCrypto, address)
      // TODO: Determine the best way to clear code/storage for an account when deleting
      // Will need to inspect all possible code and storage keys to see if it's anything
      // other than untouched leaf values
      await this._trie.del(stem, [VerkleLeafType.BasicData, VerkleLeafType.CodeHash])
    }
  }

  modifyAccountFields = async (address: Address, accountFields: AccountFields): Promise<void> => {
    await modifyAccountFields(this, address, accountFields)
  }
  putCode = async (address: Address, value: Uint8Array): Promise<void> => {
    if (this.DEBUG) {
      this._debug(`putCode address=${address.toString()} value=${short(value)}`)
    }

    this._caches?.code?.put(address, value)

    const codeHash = keccak256(value)
    if (KECCAK256_NULL === codeHash) {
      // If the code hash is the null hash, no code has to be stored
      return
    }

    if (this.DEBUG) {
      this._debug(`Update codeHash (-> ${short(codeHash)}) for account ${address}`)
    }

    const codeChunks = chunkifyCode(value)
    // The maximum number of chunks is 793 (maxCodeSize - 24576) / (bytes per chunk 31) + (round up - 1)
    // Code is stored in chunks starting at leaf index 128 of the leaf node corresponding to the stem of the code's address
    // Code chunks beyond the initial 128 are stored in additional leaf nodes in batches up of up to 256 chunks per leaf node
    // so the maximum number of leaf nodes that can hold contract code for a specific address is 4 leaf nodes (128 chunks in
    // the first leaf node and 256 chunks in up to 3 additional leaf nodes)
    // So, instead of computing every single leaf key (which is a heavy async operation), we just compute the stem for the first
    // chunk in each leaf node and can then know that the chunks in between have tree keys in monotonically increasing order
    const numStems = Math.floor(codeChunks.length / 256) + 1
    const chunkStems = [
      // Compute the stem for the initial set of code chunks
      (await getVerkleTreeKeyForCodeChunk(address, 0, this.verkleCrypto)).slice(0, 31),
    ]

    for (let stemNum = 0; stemNum < numStems - 1; stemNum++) {
      // Generate additional stems
      const firstChunkKey = await getVerkleTreeKeyForCodeChunk(
        address,
        128 + stemNum * 256,
        this.verkleCrypto,
      )
      chunkStems.push(firstChunkKey.slice(0, 31))
    }

    // Generate code chunk suffixes
    const chunkSuffixes: number[] = new Array(codeChunks.length)
    for (let x = 0; x < codeChunks.length; x++) {
      if (x < 128) {
        // Suffixes for chunks 0 - 127 start at 128 and end with 255
        chunkSuffixes[x] = x + 128
        continue
      }
      if (x < 384) {
        // Suffixes for chunks 128 - 383 start at 0 and go to 255
        chunkSuffixes[x] = x - 128
        continue
      }
      if (x < 640) {
        // Suffixes for chunks 384 - 639 start at 0 and go to 255
        chunkSuffixes[x] = x - 384
        continue
      }
      if (x > 639) {
        // Suffixes for chunks 640 - 793 start at 0 and go to 153
        chunkSuffixes[x] = x - 640
        continue
      }
    }
    // Put the code chunks corresponding to the first stem (up to 128 chunks)
    await this._trie.put(
      chunkStems[0],
      chunkSuffixes.slice(0, codeChunks.length <= 128 ? codeChunks.length : 128),
      codeChunks.slice(0, codeChunks.length <= 128 ? codeChunks.length : 128),
    )
    // Put additional chunks under additional stems as applicable
    for (let stem = 1; stem < numStems; stem++) {
      await this._trie.put(
        chunkStems[stem],
        chunkSuffixes.slice(
          128 + (256 * stem - 1),
          codeChunks.length <= 128 + 256 * stem ? codeChunks.length : 128 + 256 * stem,
        ),
        codeChunks.slice(
          128 + (256 * stem - 1),
          codeChunks.length <= 128 + 256 * stem ? codeChunks.length : 128 + 256 * stem,
        ),
      )
    }
    if ((await this.getAccount(address)) === undefined) {
      await this.putAccount(address, new Account())
    }
    await this.modifyAccountFields(address, { codeHash, codeSize: value.length })
  }

  getCode = async (address: Address): Promise<Uint8Array> => {
    if (this.DEBUG) {
      this._debug(`getCode address=${address.toString()}`)
    }

    const elem = this._caches?.code?.get(address)
    if (elem !== undefined) {
      return elem.code ?? new Uint8Array(0)
    }

    const account = await this.getAccount(address)
    if (!account) {
      return new Uint8Array(0)
    }
    if (!account.isContract()) {
      return new Uint8Array(0)
    }

    // allocate the code
    const codeSize = account.codeSize

    // TODO: Get code from trie
    const code = new Uint8Array(codeSize)
    this._caches?.code?.put(address, code)

    return code
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

  verifyVerkleProof?(): boolean {
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
