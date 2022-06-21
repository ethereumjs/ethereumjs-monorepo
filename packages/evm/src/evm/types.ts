import { Block } from '@ethereumjs/block'
import { StateAccess } from '@ethereumjs/statemanager'
import { AccessList } from '@ethereumjs/tx'
import { Address } from '@ethereumjs/util'
import EVM, { EVMResult, ExecResult, NewContractEvent } from './evm'
import { InterpreterStep } from './interpreter'
import Message from './message'
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
  /**
   * Refund counter. Defaults to `0`
   */
  gasRefund?: bigint
  /**
   * Optionally pass in an already-built message.
   */
  message?: Message
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

export type EVMEvents = {
  newContract: (data: NewContractEvent, resolve?: (result: any) => void) => void
  beforeMessage: (data: Message, resolve?: (result: any) => void) => void
  afterMessage: (data: EVMResult, resolve?: (result: any) => void) => void
  step: (data: InterpreterStep, resolve?: (result: any) => void) => void
}

export interface TransientStorageInterface {
  get(addr: Address, key: Buffer): Buffer
  put(addr: Address, key: Buffer, value: Buffer): void
  commit(): void
  checkpoint(): void
  revert(): void
  toJSON(): { [address: string]: { [key: string]: string } }
  clear(): void
}

export interface VmStateAccess extends StateAccess {
  touchAccount(address: Address): void
  addWarmedAddress(address: Buffer): void
  isWarmedAddress(address: Buffer): boolean
  addWarmedStorage(address: Buffer, slot: Buffer): void
  isWarmedStorage(address: Buffer, slot: Buffer): boolean
  clearWarmedAccounts(): void
  generateAccessList?(addressesRemoved: Address[], addressesOnlyStorage: Address[]): AccessList
  getOriginalContractStorage(address: Address, key: Buffer): Promise<Buffer>
  clearOriginalStorageCache(): void
  cleanupTouchedAccounts(): Promise<void>
  generateCanonicalGenesis(initState: any): Promise<void>
}

export interface EEIInterface {
  state: VmStateAccess
  getExternalBalance(address: Address): Promise<bigint>
  getExternalCodeSize(address: bigint): Promise<bigint>
  getExternalCode(address: bigint): Promise<Buffer>
  getBlockHash(num: bigint): Promise<bigint>
  storageStore(address: Address, key: Buffer, value: Buffer): Promise<void>
  storageLoad(address: Address, key: Buffer, original: boolean): Promise<Buffer>
  isAccountEmpty(address: Address): Promise<boolean>
  accountExists(address: Address): Promise<boolean>
  copy(): EEIInterface
}

export interface EVMInterface {
  runCall(opts: RunCallOpts): Promise<EVMResult>
  runCode?(opts: RunCodeOpts): Promise<ExecResult>
  precompiles: Map<string, any> // Note: the `any` type is used because VM only needs to have the addresses of the precompiles (not their functions)
  copy(): EVMInterface
}
