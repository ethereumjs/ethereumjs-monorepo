import type { EVM, EVMResult, ExecResult } from './evm'
import type { InterpreterStep } from './interpreter'
import type { Message } from './message'
import type { OpHandler, OpcodeList } from './opcodes'
import type { AsyncDynamicGasHandler, SyncDynamicGasHandler } from './opcodes/gas'
import type { Account, Address, AsyncEventEmitter, PrefixedHexString } from '@ethereumjs/util'

/**
 * API of the EVM
 */
export interface EVMInterface {
  runCall(opts: EVMRunCallOpts): Promise<EVMResult>
  runCode?(opts: EVMRunCodeOpts): Promise<ExecResult>
  getActiveOpcodes?(): OpcodeList
  precompiles: Map<string, any> // Note: the `any` type is used because EVM only needs to have the addresses of the precompiles (not their functions)
  copy(): EVMInterface
  eei: EEIInterface
  events?: AsyncEventEmitter<EVMEvents>
}

/**
 * API for an EEI (Ethereum Environment Interface) implementation
 *
 * This can be used to connect the EVM to different (chain) environments.
 * An implementation for an EEI to connect to an Ethereum execution chain
 * environment (`mainnet`, `sepolia`,...) can be found in the
 * `@ethereumjs/vm` package.
 */
export interface EEIInterface extends EVMStateAccess {
  getBlockHash(num: bigint): Promise<bigint>
  storageStore(address: Address, key: Uint8Array, value: Uint8Array): Promise<void>
  storageLoad(address: Address, key: Uint8Array, original: boolean): Promise<Uint8Array>
  copy(): EEIInterface
}

/**
 * API for EVM state access, this extends the base interface from
 * the `@ethereumjs/statemanager` package and is part of the broader
 * EEI (see EEI interface).
 *
 * An implementation of this can be found in the `@ethereumjs/vm` package.
 */
export interface EVMStateAccess extends StateAccess {
  addWarmedAddress(address: Uint8Array): void
  isWarmedAddress(address: Uint8Array): boolean
  addWarmedStorage(address: Uint8Array, slot: Uint8Array): void
  isWarmedStorage(address: Uint8Array, slot: Uint8Array): boolean
  clearWarmedAccounts(): void
  generateAccessList?(addressesRemoved: Address[], addressesOnlyStorage: Address[]): AccessList
  clearOriginalStorageCache(): void
  cleanupTouchedAccounts(): Promise<void>
  generateCanonicalGenesis(initState: any): Promise<void>
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

declare type AccessListItem = {
  address: PrefixedHexString
  storageKeys: PrefixedHexString[]
}

declare type AccessList = AccessListItem[]

declare type StorageProof = {
  key: PrefixedHexString
  proof: PrefixedHexString[]
  value: PrefixedHexString
}
declare type Proof = {
  address: PrefixedHexString
  balance: PrefixedHexString
  codeHash: PrefixedHexString
  nonce: PrefixedHexString
  storageHash: PrefixedHexString
  accountProof: PrefixedHexString[]
  storageProof: StorageProof[]
}

type AccountFields = Partial<Pick<Account, 'nonce' | 'balance' | 'storageRoot' | 'codeHash'>>

interface StateAccess {
  accountExists(address: Address): Promise<boolean>
  getAccount(address: Address): Promise<Account>
  putAccount(address: Address, account: Account): Promise<void>
  accountIsEmpty(address: Address): Promise<boolean>
  deleteAccount(address: Address): Promise<void>
  modifyAccountFields(address: Address, accountFields: AccountFields): Promise<void>
  putContractCode(address: Address, value: Uint8Array): Promise<void>
  getContractCode(address: Address): Promise<Uint8Array>
  getContractStorage(address: Address, key: Uint8Array): Promise<Uint8Array>
  putContractStorage(address: Address, key: Uint8Array, value: Uint8Array): Promise<void>
  clearContractStorage(address: Address): Promise<void>
  checkpoint(): Promise<void>
  commit(): Promise<void>
  revert(): Promise<void>
  getStateRoot(): Promise<Uint8Array>
  setStateRoot(stateRoot: Uint8Array): Promise<void>
  getProof?(address: Address, storageSlots: Uint8Array[]): Promise<Proof>
  verifyProof?(proof: Proof): Promise<boolean>
  hasStateRoot(root: Uint8Array): Promise<boolean>
}

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
