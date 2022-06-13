import { Block } from '@ethereumjs/block'
import { TypedTransaction } from '@ethereumjs/tx'
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
  cumulativeBlockGasUsed: bigint
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
