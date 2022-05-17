import { Block } from '@ethereumjs/block'
import { Address } from 'ethereumjs-util'
import EVM from './evm'
import { OpHandler } from './opcodes'
import { AsyncDynamicGasHandler, SyncDynamicGasHandler } from './opcodes/gas'

/**
 * Log that the contract emits.
 */
export type Log = [address: Buffer, topics: Buffer[], data: Buffer]

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
 * Options for running a call (or create) operation
 */
export interface RunCallOpts {
  /**
   * The `@ethereumjs/block` the `tx` belongs to. If omitted a default blank block will be used.
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
  data?: Buffer
  /**
   * This is for CALLCODE where the code to load is different than the code from the `opts.to` address.
   */
  code?: Buffer
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
  salt?: Buffer
  /**
   * Addresses to selfdestruct. Defaults to none.
   */
  selfdestruct?: { [k: string]: boolean }
  /**
   * Skip balance checks if true. Adds transaction value to balance to ensure execution doesn't fail.
   */
  skipBalance?: boolean
  /**
   * If the call is a DELEGATECALL. Defaults to false.
   */
  delegatecall?: boolean
}

/**
 * Options for the runCode method.
 */
export interface RunCodeOpts {
  /**
   * The `@ethereumjs/block` the `tx` belongs to. If omitted a default blank block will be used.
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
  code?: Buffer
  /**
   * The input data.
   */
  data?: Buffer
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
}

/**
 * Tx context for vm execution
 */
export interface TxContext {
  gasPrice: bigint
  origin: Address
}
