import { Address } from 'ethereumjs-util'

/**
 * Log that the contract emitted.
 */
export type Log = [address: Buffer, topics: Buffer[], data: Buffer]

export interface TxContext {
  gasPrice: bigint
  origin: Address
}
