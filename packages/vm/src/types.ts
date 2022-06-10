import { Block } from '@ethereumjs/block'
import { StateAccess } from '@ethereumjs/statemanager'
import { AccessList, TypedTransaction } from '@ethereumjs/tx'
import { Address } from 'ethereumjs-util'
import { Log } from './evm/types'
import { AfterBlockEvent } from './runBlock'
import { AfterTxEvent } from './runTx'

export type TxReceipt = PreByzantiumTxReceipt | PostByzantiumTxReceipt

/**
 * Abstract interface with common transaction receipt fields
 */
export interface BaseTxReceipt {
  /**
   * Cumulative gas used in the block including this tx
   */
  gasUsed: bigint
  /**
   * Bloom bitvector
   */
  bitvector: Buffer
  /**
   * Logs emitted
   */
  logs: Log[]
}

/**
 * Pre-Byzantium receipt type with a field
 * for the intermediary state root
 */
export interface PreByzantiumTxReceipt extends BaseTxReceipt {
  /**
   * Intermediary state root
   */
  stateRoot: Buffer
}

/**
 * Receipt type for Byzantium and beyond replacing the intermediary
 * state root field with a status code field (EIP-658)
 */
export interface PostByzantiumTxReceipt extends BaseTxReceipt {
  /**
   * Status of transaction, `1` if successful, `0` if an exception occured
   */
  status: 0 | 1
}

export type VMEvents = {
  beforeBlock: (data: Block, resolve?: (result: any) => void) => void
  afterBlock: (data: AfterBlockEvent, resolve?: (result: any) => void) => void
  beforeTx: (data: TypedTransaction, resolve?: (result: any) => void) => void
  afterTx: (data: AfterTxEvent, resolve?: (result: any) => void) => void
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
}

export interface EEIInterface {
  _transientStorage: TransientStorageInterface
  state: VmStateAccess
  getExternalBalance(address: Address): Promise<bigint>
  getExternalCodeSize(address: bigint): Promise<bigint>
  getExternalCode(address: bigint): Promise<Buffer>
  getBlockHash(num: bigint): Promise<bigint>
  storageStore(address: Address, key: Buffer, value: Buffer): Promise<void>
  storageLoad(address: Address, key: Buffer, original: boolean): Promise<Buffer>
  transientStorageStore(address: Address, key: Buffer, value: Buffer): void
  transientStorageLoad(address: Address, key: Buffer): Buffer
  isAccountEmpty(address: Address): Promise<boolean>
  accountExists(address: Address): Promise<boolean>
}
