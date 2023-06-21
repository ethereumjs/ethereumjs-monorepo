import { zeros } from '@ethereumjs/util'

import type { EVM, EVMResult, ExecResult } from './evm.js'
import type { InterpreterStep } from './interpreter.js'
import type { Message } from './message.js'
import type { AsyncDynamicGasHandler, SyncDynamicGasHandler } from './opcodes/gas.js'
import type { OpHandler, OpcodeList } from './opcodes/index.js'
import type { EVMStateManagerInterface } from '@ethereumjs/common'
import type { Address, AsyncEventEmitter } from '@ethereumjs/util'

/**
 * API of the EVM
 */
export interface EVMInterface {
  runCall(opts: EVMRunCallOpts): Promise<EVMResult>
  runCode?(opts: EVMRunCodeOpts): Promise<ExecResult>
  getActiveOpcodes?(): OpcodeList
  precompiles: Map<string, any> // Note: the `any` type is used because EVM only needs to have the addresses of the precompiles (not their functions)
  copy(): EVMInterface
  stateManager: EVMStateManagerInterface
  events?: AsyncEventEmitter<EVMEvents>
}

export type DeleteOpcode = {
  opcode: number
}

export type AddOpcode = {
  opcode: number
  opcodeName: string
  baseFee: number
  gasFunction?: AsyncDynamicGasHandler | SyncDynamicGasHandler
  logicFunction: OpHandler
}

export type CustomOpcode = AddOpcode | DeleteOpcode

/**
 * Options for running a call (or create) operation with `EVM.runCall()`
 */
export interface EVMRunCallOpts {
  /**
   * The `block` the `tx` belongs to. If omitted a default blank block will be used.
   */
  block?: Block
  /**
   * The gas price for the call. Defaults to `0`
   */
  gasPrice?: bigint
  /**
   * The address where the call originated from. Defaults to the zero address.
   */
  origin?: Address
  /**
   * The address that ran this code (`msg.sender`). Defaults to the zero address.
   */
  caller?: Address
  /**
   * The gas limit for the call. Defaults to `0xffffff`
   */
  gasLimit?: bigint
  /**
   * The to address. Defaults to the zero address.
   */
  to?: Address
  /**
   * The value in ether that is being sent to `opts.to`. Defaults to `0`
   */
  value?: bigint
  /**
   * The data for the call.
   */
  data?: Uint8Array
  /**
   * This is for CALLCODE where the code to load is different than the code from the `opts.to` address.
   */
  code?: Uint8Array
  /**
   * The call depth. Defaults to `0`
   */
  depth?: number
  /**
   * If the code location is a precompile.
   */
  isCompiled?: boolean
  /**
   * If the call should be executed statically. Defaults to false.
   */
  isStatic?: boolean
  /**
   * An optional salt to pass to CREATE2.
   */
  salt?: Uint8Array
  /**
   * Addresses to selfdestruct. Defaults to none.
   */
  selfdestruct?: { [k: string]: boolean }
  /**
   * Created addresses in current context. Used in EIP 6780
   */
  createdAddresses?: Set<string>
  /**
   * Skip balance checks if true. If caller balance is less than message value,
   * sets balance to message value to ensure execution doesn't fail.
   */
  skipBalance?: boolean
  /**
   * If the call is a DELEGATECALL. Defaults to false.
   */
  delegatecall?: boolean
  /**
   * Refund counter. Defaults to `0`
   */
  gasRefund?: bigint
  /**
   * Optionally pass in an already-built message.
   */
  message?: Message
  /**
   * Versioned hashes for each blob in a blob transaction
   */
  versionedHashes?: Uint8Array[]
}

/**
 * Options for the `EVM.runCode()` method.
 */
export interface EVMRunCodeOpts {
  /**
   * The `block` the `tx` belongs to. If omitted a default blank block will be used.
   */
  block?: Block
  /**
   * Pass a custom {@link EVM} to use. If omitted the default {@link EVM} will be used.
   */
  evm?: EVM
  /**
   * The gas price for the call. Defaults to `0`
   */
  gasPrice?: bigint
  /**
   * The address where the call originated from. Defaults to the zero address.
   */
  origin?: Address
  /**
   * The address that ran this code (`msg.sender`). Defaults to the zero address.
   */
  caller?: Address
  /**
   * The EVM code to run.
   */
  code?: Uint8Array
  /**
   * The input data.
   */
  data?: Uint8Array
  /**
   * The gas limit for the call.
   */
  gasLimit: bigint
  /**
   * The value in ether that is being sent to `opts.address`. Defaults to `0`
   */
  value?: bigint
  /**
   * The call depth. Defaults to `0`
   */
  depth?: number
  /**
   * If the call should be executed statically. Defaults to false.
   */
  isStatic?: boolean
  /**
   * Addresses to selfdestruct. Defaults to none.
   */
  selfdestruct?: { [k: string]: boolean }
  /**
   * The address of the account that is executing this code (`address(this)`). Defaults to the zero address.
   */
  address?: Address
  /**
   * The initial program counter. Defaults to `0`
   */
  pc?: number
  /**
   * Versioned hashes for each blob in a blob transaction
   */
  versionedHashes?: Uint8Array[]
}

interface NewContractEvent {
  address: Address
  // The deployment code
  code: Uint8Array
}

export type EVMEvents = {
  newContract: (data: NewContractEvent, resolve?: (result?: any) => void) => void
  beforeMessage: (data: Message, resolve?: (result?: any) => void) => void
  afterMessage: (data: EVMResult, resolve?: (result?: any) => void) => void
  step: (data: InterpreterStep, resolve?: (result?: any) => void) => void
}

/**
 * Log that the contract emits.
 */
export type Log = [address: Uint8Array, topics: Uint8Array[], data: Uint8Array]

export type Block = {
  header: {
    number: bigint
    cliqueSigner(): Address
    coinbase: Address
    timestamp: bigint
    difficulty: bigint
    prevRandao: Uint8Array
    gasLimit: bigint
    baseFeePerGas?: bigint
  }
}

export interface TransientStorageInterface {
  get(addr: Address, key: Uint8Array): Uint8Array
  put(addr: Address, key: Uint8Array, value: Uint8Array): void
  commit(): void
  checkpoint(): void
  revert(): void
  toJSON(): { [address: string]: { [key: string]: string } }
  clear(): void
}

type MockBlock = {
  hash(): Uint8Array
}

export interface Blockchain {
  getBlock(blockId: number): Promise<MockBlock>
  copy(): Blockchain
}

export class DefaultBlockchain implements Blockchain {
  async getBlock() {
    return {
      hash() {
        return zeros(32)
      },
    }
  }
  copy() {
    return this
  }
}
