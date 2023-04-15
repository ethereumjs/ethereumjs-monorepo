/* eslint @typescript-eslint/no-unused-vars: 0 */

import {
  Account,
  bytesToHex,
  readInt32LE,
  setLengthLeft,
  setLengthRight,
  toBytes,
  zeros,
} from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'

import { Cache, get } from './cache/cache'

import type { StateManager } from '.'
import type { put } from './cache/cache'
import type { StorageDump } from './interface'
import type { Address, PrefixedHexString } from '@ethereumjs/util'

const wasm = require('../../rust-verkle-wasm/rust_verkle_wasm')

export interface VerkleState {
  [key: PrefixedHexString]: PrefixedHexString
}

/**
 * Options dictionary.
 */
export interface StatelessVerkleStateManagerOpts {}

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
  private _proof: PrefixedHexString = '0x'

  // State along execution (should update)
  private _state: VerkleState = {}

  // Checkpointing
  private _checkpoints: VerkleState[] = []

  /**
   * Instantiate the StateManager interface.
   */
  constructor(opts: StatelessVerkleStateManagerOpts = {}) {
    super(opts)

    /*
     * For a custom StateManager implementation adopt these
     * callbacks passed to the `Cache` instantiated to perform
     * the `get`, `put` and `delete` operations with the
     * desired backend.
     */
    const getCb: get = async (address) => {
      return undefined
    }
    const putCb: put = async (keyBuf, accountRlp) => {}
    const deleteCb = async (keyBuf: Buffer) => {}
    this._cache = new Cache({ get, putCb, deleteCb })
  }

  public initPreState(proof: PrefixedHexString, preState: VerkleState) {
    this._proof = proof
    // Initialize the state with the pre-state
    this._state = preState
  }

  private pedersenHash(input: Buffer) {
    const pedersenHash = wasm.pedersen_hash(input)

    if (pedersenHash === null) {
      throw new Error('Wrong pedersenHash input. This might happen if length is not correct.')
    }

    return arrToBufArr(pedersenHash)
  }

  private getTreeKey(address: Address, treeIndex: number, subIndex: number): Buffer {
    const address32 = setLengthLeft(address.toBytes(), 32)

    const treeIndexB = Buffer.alloc(32)
    treeIndexB.writeInt32LE(treeIndex)

    const input = Buffer.concat([address32, treeIndexB])

    const treeKey = Buffer.concat([this.pedersenHash(input).slice(0, 31), toBytes(subIndex)])

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
  async putContractCode(address: Address, value: Buffer): Promise<void> {
    // TODO
  }

  /**
   * Gets the code corresponding to the provided `address`.
   * @param address - Address to get the `code` for
   * @returns {Promise<Buffer>} -  Resolves with the code corresponding to the provided address.
   * Returns an empty `Buffer` if the account has no associated code.
   */
  async getContractCode(address: Address): Promise<Buffer> {
    // Get the contract code size
    const codeHashKey = this.getTreeKeyForCodeHash(address)
    const codeSizeKey = this.getTreeKeyForCodeSize(address)

    const codeSizeLE = hexToBytes(this._state[bytesToHex(codeSizeKey)])

    // Calculate number of chunks
    const chunks = Math.ceil(readInt32LE(codeSizeLE) / 32)

    const retrievedChunks: Buffer[] = []

    // Retrieve all code chunks
    for (let chunkId = 0; chunkId < chunks; chunkId++) {
      retrievedChunks.push(this.getTreeKeyForCodeChunk(address, chunkId))
    }

    // Aggregate code chunks
    const code = Buffer.concat(retrievedChunks)

    // Return code chunks
    return code
  }

  /**
   * Gets the storage value associated with the provided `address` and `key`. This method returns
   * the shortest representation of the stored value.
   * @param address -  Address of the account to get the storage for
   * @param key - Key in the account's storage to get the value for. Must be 32 bytes long.
   * @returns {Promise<Buffer>} - The storage value for the account
   * corresponding to the provided address at the provided key.
   * If this does not exist an empty `Buffer` is returned.
   */
  async getContractStorage(address: Address, key: Buffer): Promise<Buffer> {
    const storageKey = this.getTreeKeyForStorageSlot(address, Number(bufferToHex(key)))
    const storage = toBuffer(this._state[bufferToHex(storageKey)])

    return storage
  }

  /**
   * Adds value to the state for the `account`
   * corresponding to `address` at the provided `key`.
   * @param address -  Address to set a storage value for
   * @param key - Key to set the value at. Must be 32 bytes long.
   * @param value - Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is a empty or filled with zeros, deletes the value.
   */
  async putContractStorage(address: Address, key: Buffer, value: Buffer): Promise<void> {
    const storageKey = this.getTreeKeyForStorageSlot(address, Number(bufferToHex(key)))
    this._state[bufferToHex(storageKey)] = value.toString('hex')
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

    const balanceLE = toBuffer(this._state[bufferToHex(balanceKey)])
    const nonceLE = toBuffer(this._state[bufferToHex(nonceKey)])
    const codeHash = toBuffer(this._state[bufferToHex(codeHashKey)])

    return Account.fromAccountData({
      balance: balanceLE.length > 0 ? balanceLE.readBigInt64LE() : 0n,
      codeHash: codeHash.length > 0 ? codeHash : zeros(32),
      nonce: nonceLE.length > 0 ? nonceLE.readBigInt64LE() : 0n,
    })
  }

  async putAccount(address: Address, account: Account): Promise<void> {
    // Retrieve treeKeys from account address
    const balanceKey = this.getTreeKeyForBalance(address)
    const nonceKey = this.getTreeKeyForNonce(address)
    const codeHashKey = this.getTreeKeyForCodeHash(address)

    const balanceBuf = Buffer.alloc(32)
    balanceBuf.writeBigInt64LE(account.balance)
    const nonceBuf = Buffer.alloc(32)
    nonceBuf.writeBigInt64LE(account.nonce)

    this._state[bufferToHex(balanceKey)] = bufferToHex(balanceBuf)
    this._state[bufferToHex(nonceKey)] = bufferToHex(nonceBuf)
    this._state[bufferToHex(codeHashKey)] = bufferToHex(account.codeHash)
  }

  /**
   * Checkpoints the current state of the StateManager instance.
   * State changes that follow can then be committed by calling
   * `commit` or `reverted` by calling rollback.
   */
  async checkpoint(): Promise<void> {
    this._checkpoints.push(this._state)
    await super.checkpoint()
  }

  /**
   * Commits the current change-set to the instance since the
   * last call to checkpoint.
   */
  async commit(): Promise<void> {
    this._checkpoints.pop()
    await super.commit()
  }

  // TODO
  async hasStateRoot(root: Buffer): Promise<boolean> {
    return true
  }

  /**
   * Reverts the current change-set to the instance since the
   * last call to checkpoint.
   */
  async revert(): Promise<void> {
    if (this._checkpoints.length === 0) {
      throw new Error('StatelessVerkleStateManager state cannot be reverted, no checkpoints set')
    }
    this._state = this._checkpoints.pop()!
    await super.revert()
  }

  /**
   * Gets the verkle root.
   * NOTE: this needs some examination in the code where this is needed
   * and if we have the verkle root present
   * @returns {Promise<Buffer>} - Returns the verkle root of the `StateManager`
   */
  async getStateRoot(): Promise<Buffer> {
    return Buffer.alloc(0)
  }

  /**
   * TODO: needed?
   * Maybe in this context: reset to original pre state suffice
   * @param stateRoot - The verkle root to reset the instance to
   */
  async setStateRoot(stateRoot: Buffer): Promise<void> {}

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
}
