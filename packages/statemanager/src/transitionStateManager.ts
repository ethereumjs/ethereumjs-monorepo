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
import type { Address, VerkleCrypto } from '@ethereumjs/util'
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

  // The frozen tree that we are transitioning away from. Read-only.
  protected _frozenTree: MerklePatriciaTrie
  // The new tree that we are transition to. Can be written to.
  protected _activeTree: VerkleTree
  protected _storageTries: { [key: string]: MerklePatriciaTrie }

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

    // if (opts.common.isActivatedEIP(6800) === false) {
    //   throw EthereumJSErrorWithoutCode('EIP-6800 required for verkle state management')
    // }

    if (opts.common.customCrypto.verkle === undefined) {
      throw EthereumJSErrorWithoutCode('verkle crypto required')
    }

    this._frozenTree = opts.frozenTree
    this._activeTree =
      opts.activeTree ??
      new VerkleTree({
        verkleCrypto: opts.common.customCrypto.verkle,
        db: new MapDB<Uint8Array, Uint8Array>(),
        useRootPersistence: false,
        cacheSize: 0,
      })
    this._storageTries = {}
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
    const elem = this._caches?.account?.get(address)
    if (elem !== undefined) {
      return elem.accountRLP !== undefined ? createAccountFromRLP(elem.accountRLP) : undefined
    }

    // TODO:
    // 1. Attempt retrieving from the active tree
    // 2. Fallback to retrieving from the frozen tree

    const stem = getVerkleStem(this.verkleCrypto, address, 0)

    // First retrieve the account "header" values from the trie
    const accountValues = await this._activeTree.get(stem, [
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
        // Codehash is either untouched (i.e. undefined) or deleted (i.e. overwritten with zeros)
        codeHash:
          accountValues[1] === undefined || equalsBytes(accountValues[1], new Uint8Array(32))
            ? KECCAK256_NULL
            : accountValues[1],
        codeSize: basicData.codeSize,
        storageRoot: KECCAK256_NULL, // TODO: Add storage stuff
      })
    } else if (accountValues[1] === undefined) {
      // account does not exist if both basic fields and codehash are undefined
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

  /**
   * Saves an account into state under the provided `address`.
   * @param address - Address under which to store `account`
   * @param account - The account to store or undefined if to be deleted
   */
  putAccount = async (address: Address, account?: Account): Promise<void> => {
    if (this.DEBUG) {
      this._debug(
        `putAccount address=${address} nonce=${account?.nonce} balance=${
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
        await this._activeTree.put(
          stem,
          [VerkleLeafType.BasicData, VerkleLeafType.CodeHash],
          [basicDataBytes, account.codeHash],
        )
      } else {
        // Delete account
        await this.deleteAccount(address)
      }
    } else {
      if (account !== undefined) {
        this._caches?.account?.put(address, account, true)
      } else {
        this._caches?.account?.del(address)
      }
    }
  }

  /**
   * Deletes an account from state under the provided `address`.
   * @param address - Address of the account which should be deleted
   */
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
      // Special instance where we delete the account and revert the trie value to untouched
      await this._activeTree.put(
        stem,
        [VerkleLeafType.BasicData, VerkleLeafType.CodeHash],
        [LeafVerkleNodeValue.Untouched, LeafVerkleNodeValue.Untouched],
      )
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
    if (equalsBytes(codeHash, KECCAK256_NULL)) {
      // If the code hash is the null hash, no code has to be stored
      return
    }

    if ((await this.getAccount(address)) === undefined) {
      await this.putAccount(address, new Account())
    }
    if (this.DEBUG) {
      this._debug(`Update codeHash (-> ${short(codeHash)}) for account ${address}`)
    }

    const codeChunks = chunkifyCode(value)
    const chunkStems = await generateCodeStems(codeChunks.length, address, this.verkleCrypto)

    const chunkSuffixes: number[] = generateChunkSuffixes(codeChunks.length)
    // Put the code chunks corresponding to the first stem (up to 128 chunks)
    await this._activeTree.put(
      chunkStems[0],
      chunkSuffixes.slice(
        0,
        chunkSuffixes.length <= VERKLE_CODE_OFFSET ? chunkSuffixes.length : VERKLE_CODE_OFFSET,
      ),
      codeChunks.slice(
        0,
        codeChunks.length <= VERKLE_CODE_OFFSET ? codeChunks.length : VERKLE_CODE_OFFSET,
      ),
    )

    // Put additional chunks under additional stems as applicable
    for (let stem = 1; stem < chunkStems.length; stem++) {
      const sliceStart = VERKLE_CODE_OFFSET + VERKLE_NODE_WIDTH * (stem - 1)
      const sliceEnd =
        value.length <= VERKLE_CODE_OFFSET + VERKLE_NODE_WIDTH * stem
          ? value.length
          : VERKLE_CODE_OFFSET + VERKLE_NODE_WIDTH * stem
      await this._activeTree.put(
        chunkStems[stem],
        chunkSuffixes.slice(sliceStart, sliceEnd),
        codeChunks.slice(sliceStart, sliceEnd),
      )
    }
    await this.modifyAccountFields(address, {
      codeHash,
      codeSize: value.length,
    })
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

    const stems = await generateCodeStems(
      Math.ceil(codeSize / VERKLE_CODE_CHUNK_SIZE),
      address,
      this.verkleCrypto,
    )
    const chunkSuffixes = generateChunkSuffixes(Math.ceil(codeSize / VERKLE_CODE_CHUNK_SIZE))

    const chunksByStem = new Array(stems.length)
    // Retrieve the code chunks stored in the first leaf node
    chunksByStem[0] = await this._activeTree.get(
      stems[0],
      chunkSuffixes.slice(0, codeSize <= VERKLE_CODE_OFFSET ? codeSize : VERKLE_CODE_OFFSET),
    )

    // Retrieve code chunks on any additional stems
    for (let stem = 1; stem < stems.length; stem++) {
      const sliceStart = VERKLE_CODE_OFFSET + VERKLE_NODE_WIDTH * (stem - 1)
      const sliceEnd =
        codeSize <= VERKLE_CODE_OFFSET + VERKLE_NODE_WIDTH * stem
          ? codeSize
          : VERKLE_CODE_OFFSET + VERKLE_NODE_WIDTH * stem
      chunksByStem[stem] = await this._activeTree.get(
        stems[stem],
        chunkSuffixes.slice(sliceStart, sliceEnd),
      )
    }
    const chunks = chunksByStem.flat()
    const code = new Uint8Array(codeSize)
    // Insert code chunks into final array (skipping PUSHDATA overflow indicator byte)
    for (let x = 0; x < chunks.length; x++) {
      if (chunks[x] === undefined)
        throw EthereumJSErrorWithoutCode(`expected code chunk at ID ${x}, got undefined`)

      let lastChunkByteIndex = VERKLE_CODE_CHUNK_SIZE
      // Determine code ending byte (if we're on the last chunk)
      if (x === chunks.length - 1) {
        // On the last chunk, the slice either ends on a partial chunk (if codeSize doesn't exactly fit in full chunks), or a full chunk
        lastChunkByteIndex = codeSize % VERKLE_CODE_CHUNK_SIZE || VERKLE_CODE_CHUNK_SIZE
      }
      code.set(
        chunks[x]!.slice(1, lastChunkByteIndex + 1),
        code.byteOffset + x * VERKLE_CODE_CHUNK_SIZE,
      )
    }
    this._caches?.code?.put(address, code)

    return code
  }

  getCodeSize = async (address: Address): Promise<number> => {
    const accountBytes = (
      await this._activeTree.get(getVerkleStem(this.verkleCrypto, address), [
        VerkleLeafType.BasicData,
      ])
    )[0]
    if (accountBytes === undefined) return 0
    return decodeVerkleLeafBasicData(accountBytes).codeSize
  }
  getStorage = async (address: Address, key: Uint8Array): Promise<Uint8Array> => {
    if (key.length !== 32) {
      throw EthereumJSErrorWithoutCode('Storage key must be 32 bytes long')
    }
    const cachedValue = this._caches?.storage?.get(address, key)
    if (cachedValue !== undefined) {
      const decoded = RLP.decode(cachedValue ?? new Uint8Array(0)) as Uint8Array
      return decoded
    }

    const account = await this.getAccount(address)
    if (!account) {
      return new Uint8Array()
    }
    const storageKey = await getVerkleTreeKeyForStorageSlot(
      address,
      bytesToBigInt(key),
      this.verkleCrypto,
    )
    const value = await this._activeTree.get(storageKey.slice(0, 31), [storageKey[31]])

    this._caches?.storage?.put(address, key, value[0] ?? hexToBytes('0x80'))
    const decoded = (value[0] ?? new Uint8Array(0)) as Uint8Array
    return setLengthLeft(decoded, 32)
  }

  putStorage = async (address: Address, key: Uint8Array, value: Uint8Array): Promise<void> => {
    this._caches?.storage?.put(address, key, RLP.encode(value))
    if (this._caches?.storage === undefined) {
      const storageKey = await getVerkleTreeKeyForStorageSlot(
        address,
        bytesToBigInt(key),
        this.verkleCrypto,
      )
      await this._activeTree.put(
        storageKey.slice(0, 31),
        [storageKey[31]],
        [setLengthLeft(value, 32)],
      )
    }
  }

  clearStorage = async (address: Address): Promise<void> => {
    // TODO: Determine if it's possible to clear the actual slots in the trie
    // since the EIP doesn't seem to state how to handle this
    // The main concern I have is that we have no way of identifying all storage slots
    // for a given account so we can't correctly update the trie's root hash
    // (since presumably "clearStorage" would imply writing over all of the storage slots with zeros)
    // Also, do we still need a storageRoot? - presumably not since we don't have separate storage tries
    this._caches?.storage?.clearStorage(address)
  }

  checkpoint = async (): Promise<void> => {
    this._activeTree.checkpoint()
    this._caches?.checkpoint()
    this._checkpointCount++
  }
  commit = async (): Promise<void> => {
    await this._activeTree.commit()
    this._caches?.commit()
    this._checkpointCount--

    if (this._checkpointCount === 0) {
      await this.flush()
      this.originalStorageCache.clear()
    }

    if (this.DEBUG) {
      this._debug(`state checkpoint committed`)
    }
  }
  revert = async (): Promise<void> => {
    await this._activeTree.revert()
    this._caches?.revert()

    this._checkpointCount--

    if (this._checkpointCount === 0) {
      await this.flush()
      this.originalStorageCache.clear()
    }
  }

  flush = async (): Promise<void> => {
    const codeItems = this._caches?.code?.flush() ?? []
    for (const item of codeItems) {
      const addr = createAddressFromString(`0x${item[0]}`)

      const code = item[1].code
      if (code === undefined) {
        continue
      }

      await this.putCode(addr, code)
    }

    const storageItems = this._caches?.storage?.flush() ?? []
    for (const item of storageItems) {
      const address = createAddressFromString(`0x${item[0]}`)
      const keyHex = item[1]
      const keyBytes = unprefixedHexToBytes(keyHex)
      const value = item[2]

      const decoded = RLP.decode(value ?? new Uint8Array(0)) as Uint8Array
      const account = await this.getAccount(address)
      if (account) {
        await this.putStorage(address, keyBytes, decoded)
      }
    }

    const accountItems = this._caches?.account?.flush() ?? []
    for (const item of accountItems) {
      const address = createAddressFromString(`0x${item[0]}`)
      const elem = item[1]
      if (elem.accountRLP === undefined) {
        await this.deleteAccount(address)
      } else {
        const account = createPartialAccountFromRLP(elem.accountRLP)
        await this.putAccount(address, account)
      }
    }
  }

  getStateRoot(): Promise<Uint8Array> {
    return Promise.resolve(this._activeTree.root())
  }

  setStateRoot(stateRoot: Uint8Array, clearCache?: boolean): Promise<void> {
    this._activeTree.root(stateRoot)
    clearCache === true && this.clearCaches()
    return Promise.resolve()
  }
  hasStateRoot(root: Uint8Array): Promise<boolean> {
    return this._activeTree.checkRoot(root)
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
      // 1. Get the account RLP from the frozen MPT
      const accountRLP = await this._frozenTree.get(key)
      if (!accountRLP) {
        // No account at this key, skip
        continue
      }
      const address = createAddressFromString(bytesToHex(key))
      const account = createPartialAccountFromRLP(accountRLP)

      // 2. Insert account into Verkle Tree
      await this.putAccount(address, account)

      // 3. If account has code, migrate code as well
      if (account.codeHash && !equalsBytes(account.codeHash, KECCAK256_NULL)) {
        const code = await this.getCode(address)
        if (code) {
          await this.putCode(address, code)
        }
      }

      // 4. Migrate storage if storageRoot is not empty
      if (account.storageRoot && !equalsBytes(account.storageRoot, KECCAK256_NULL)) {
        const storageTrie = await createMPT({
          root: account.storageRoot,
          db: this._frozenTree.database()['db'],
        })

        // Use walkAllValueNodes to iterate all storage slots
        await storageTrie.walkAllValueNodes(async (node, keyNibbles) => {
          // node.value() is the value at this storage slot
          // keyNibbles is the nibbles array; convert to Uint8Array key
          const storageKey = Uint8Array.from(keyNibbles)
          const storageValue = node.value()
          if (storageValue !== null && storageValue !== undefined) {
            await this.putStorage(address, storageKey, storageValue)
          }
        })
      }
    }
  }
}
