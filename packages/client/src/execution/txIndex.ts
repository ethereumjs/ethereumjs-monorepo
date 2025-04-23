export type TxHashIndex = [blockHash: Uint8Array, txIndex: number]

export type IndexType = (typeof IndexType)[keyof typeof IndexType]

export const IndexType = {
  TxHash: 'txhash',
} as const

export type IndexOperation = (typeof IndexOperation)[keyof typeof IndexOperation]

export const IndexOperation = {
  Save: 'save',
  Delete: 'delete',
} as const

export type rlpTxHash = [blockHash: Uint8Array, txIndex: Uint8Array]
