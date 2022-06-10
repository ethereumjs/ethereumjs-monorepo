import { Address, bufferToBigInt } from 'ethereumjs-util'
import Common from '@ethereumjs/common'

import { VmState } from './vmState'
import TransientStorage from './transientStorage'
import { addressToBuffer } from '../evm/opcodes'
import { StateManager } from '@ethereumjs/statemanager'
import { EEIInterface } from '../types'

type Block = {
  hash(): Buffer
}

type Blockchain = {
  getBlock(blockId: number): Promise<Block>
}

/**
 * External interface made available to EVM bytecode. Modeled after
 * the ewasm EEI [spec](https://github.com/ewasm/design/blob/master/eth_interface.md).
 * It includes methods for accessing/modifying state, calling or creating contracts, access
 * to environment data among other things.
 * The EEI instance also keeps artifacts produced by the bytecode such as logs
 * and to-be-selfdestructed addresses.
 */
export default class EEI implements EEIInterface {
  readonly state: VmState // TODO this is part of the interface, remove underscore (search .ei._state, replace all)
  protected _common: Common
  _transientStorage: TransientStorage
  protected _blockchain: Blockchain

  constructor(stateManager: StateManager, common: Common, blockchain: Blockchain) {
    this._common = common
    this._transientStorage = new TransientStorage()
    this._blockchain = blockchain
    this.state = new VmState({ common, stateManager })
  }

  /**
   * Returns balance of the given account.
   * @param address - Address of account
   */
  async getExternalBalance(address: Address): Promise<bigint> {
    const account = await this.state.getAccount(address)
    return account.balance
  }

  /**
   * Get size of an account’s code.
   * @param address - Address of account
   */
  async getExternalCodeSize(address: bigint): Promise<bigint> {
    const addr = new Address(addressToBuffer(address))
    const code = await this.state.getContractCode(addr)
    return BigInt(code.length)
  }

  /**
   * Returns code of an account.
   * @param address - Address of account
   */
  async getExternalCode(address: bigint): Promise<Buffer> {
    const addr = new Address(addressToBuffer(address))
    return this.state.getContractCode(addr)
  }

  /**
   * Returns Gets the hash of one of the 256 most recent complete blocks.
   * @param num - Number of block
   */
  async getBlockHash(num: bigint): Promise<bigint> {
    const block = await this._blockchain.getBlock(Number(num))
    return bufferToBigInt(block.hash())
  }

  /**
   * Storage 256-bit value into storage of an address
   * @param address Address to store into
   * @param key Storage key
   * @param value Storage value
   */
  async storageStore(address: Address, key: Buffer, value: Buffer): Promise<void> {
    await this.state.putContractStorage(address, key, value)
  }

  /**
   * Loads a 256-bit value to memory from persistent storage.
   * @param address Address to get storage key value from
   * @param key Storage key
   * @param original If true, return the original storage value (default: false)
   */
  async storageLoad(address: Address, key: Buffer, original = false): Promise<Buffer> {
    if (original) {
      return this.state.getOriginalContractStorage(address, key)
    } else {
      return this.state.getContractStorage(address, key)
    }
  }

  /**
   * Store 256-bit a value in memory to transient storage.
   * @param address Address to use
   * @param key Storage key
   * @param value Storage value
   */
  transientStorageStore(address: Address, key: Buffer, value: Buffer): void {
    return this._transientStorage.put(address, key, value)
  }

  /**
   * Loads a 256-bit value to memory from transient storage.
   * @param address Address to use
   * @param key Storage key
   */
  transientStorageLoad(address: Address, key: Buffer): Buffer {
    return this._transientStorage.get(address, key)
  }

  /**
   * Returns true if account is empty or non-existent (according to EIP-161).
   * @param address - Address of account
   */
  async isAccountEmpty(address: Address): Promise<boolean> {
    return this.state.accountIsEmpty(address)
  }

  /**
   * Returns true if account exists in the state trie (it can be empty). Returns false if the account is `null`.
   * @param address - Address of account
   */
  async accountExists(address: Address): Promise<boolean> {
    return this.state.accountExists(address)
  }
}
