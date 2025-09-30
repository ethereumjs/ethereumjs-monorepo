/**
 * Local type definitions for testdata package
 * These are minimal types that avoid circular dependencies with @ethereumjs/block
 */

export interface BlockData {
  header?: {
    parentHash?: string
    uncleHash?: string
    coinbase?: string
    stateRoot?: string
    transactionsTrie?: string
    receiptTrie?: string
    logsBloom?: string
    difficulty?: string
    number?: string
    gasLimit?: string
    gasUsed?: string
    timestamp?: string
    extraData?: string
    mixHash?: string
    nonce?: string
    baseFeePerGas?: string
    withdrawalsRoot?: string
    blobGasUsed?: string
    excessBlobGas?: string
    parentBeaconBlockRoot?: string
    requestsHash?: string
  }
  transactions?: any[]
  uncleHeaders?: any[]
  withdrawals?: any[]
  executionWitness?: any
}

export type PrefixedHexString = string
