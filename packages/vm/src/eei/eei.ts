import { Account, Address, bufferToBigInt } from '@ethereumjs/util'
import { Block } from '@ethereumjs/block'
import Blockchain from '@ethereumjs/blockchain'
import Common from '@ethereumjs/common'

import { VmState } from './vmState'
import EVM from '../evm/evm'
import { ExternalInterfaceFactory } from '../evm/types'
import { TransientStorage } from '../state'
import { addressToBuffer } from '../evm/opcodes'
import { StateManager } from '@ethereumjs/statemanager'

type CreateEIOptions = {
  transientStorage: TransientStorage
  env: Env
  gasLeft: bigint
  evm: EVM
}

/**
 * Environment data which is made available to EVM bytecode.
 */
export interface Env {
  blockchain: Blockchain
  address: Address
  caller: Address
  callData: Buffer
  callValue: bigint
  code: Buffer
  isStatic: boolean
  depth: number
  gasPrice: bigint
  origin: Address
  block: Block
  contract: Account
  codeAddress: Address /** Different than address for DELEGATECALL and CALLCODE */
  auth?: Address /** EIP-3074 AUTH parameter */
}

export class EIFactory implements ExternalInterfaceFactory {
  public readonly common: Common
  public readonly state: VmState

  constructor({ common, stateManager }: { common: Common; stateManager: StateManager }) {
    this.common = common
    this.state = new VmState({ common, stateManager })
  }

  createEI(options: CreateEIOptions) {
    return new EEI(options.env, this.state, options.evm, this.common, options.transientStorage)
  }
}

/**
 * External interface made available to EVM bytecode. Modeled after
 * the ewasm EEI [spec](https://github.com/ewasm/design/blob/master/eth_interface.md).
 * It includes methods for accessing/modifying state, calling or creating contracts, access
 * to environment data among other things.
 * The EEI instance also keeps artifacts produced by the bytecode such as logs
 * and to-be-selfdestructed addresses.
 */
export default class EEI {
  _env: Env
  _state: VmState
  _evm: EVM
  _common: Common
  _transientStorage: TransientStorage

  constructor(
    env: Env,
    state: VmState,
    evm: EVM,
    common: Common,
    transientStorage: TransientStorage
  ) {
    this._env = env
    this._state = state
    this._evm = evm
    this._common = common
    this._transientStorage = transientStorage
  }

  /**
   * Returns balance of the given account.
   * @param address - Address of account
   */
  async getExternalBalance(address: Address): Promise<bigint> {
    // shortcut if current account
    if (address.equals(this._env.address)) {
      return this._env.contract.balance
    }

    // otherwise load account then return balance
    const account = await this._state.getAccount(address)
    return account.balance
  }

  /**
   * Get size of an account’s code.
   * @param address - Address of account
   */
  async getExternalCodeSize(address: bigint): Promise<bigint> {
    const addr = new Address(addressToBuffer(address))
    const code = await this._state.getContractCode(addr)
    return BigInt(code.length)
  }

  /**
   * Returns code of an account.
   * @param address - Address of account
   */
  async getExternalCode(address: bigint): Promise<Buffer> {
    const addr = new Address(addressToBuffer(address))
    return this._state.getContractCode(addr)
  }

  /**
   * Returns Gets the hash of one of the 256 most recent complete blocks.
   * @param num - Number of block
   */
  async getBlockHash(num: bigint): Promise<bigint> {
    const block = await this._env.blockchain.getBlock(Number(num))
    return bufferToBigInt(block.hash())
  }

  /**
   * Store 256-bit a value in memory to persistent storage.
   */
  async storageStore(key: Buffer, value: Buffer): Promise<void> {
    await this._state.putContractStorage(this._env.address, key, value)
    const account = await this._state.getAccount(this._env.address)
    this._env.contract = account
  }

  /**
   * Loads a 256-bit value to memory from persistent storage.
   * @param key - Storage key
   * @param original - If true, return the original storage value (default: false)
   */
  async storageLoad(key: Buffer, original = false): Promise<Buffer> {
    if (original) {
      return this._state.getOriginalContractStorage(this._env.address, key)
    } else {
      return this._state.getContractStorage(this._env.address, key)
    }
  }

  /**
   * Store 256-bit a value in memory to transient storage.
   * @param key - Storage key
   * @param value - Storage value
   */
  transientStorageStore(key: Buffer, value: Buffer): void {
    return this._transientStorage.put(this._env.address, key, value)
  }

  /**
   * Loads a 256-bit value to memory from transient storage.
   * @param key - Storage key
   */
  transientStorageLoad(key: Buffer): Buffer {
    return this._transientStorage.get(this._env.address, key)
  }

  /**
   * Returns true if account is empty or non-existent (according to EIP-161).
   * @param address - Address of account
   */
  async isAccountEmpty(address: Address): Promise<boolean> {
    return this._state.accountIsEmpty(address)
  }

  /**
   * Returns true if account exists in the state trie (it can be empty). Returns false if the account is `null`.
   * @param address - Address of account
   */
  async accountExists(address: Address): Promise<boolean> {
    return this._state.accountExists(address)
  }
}
