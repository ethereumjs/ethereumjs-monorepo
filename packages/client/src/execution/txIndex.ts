import { RLP } from '@ethereumjs/rlp'
import { BIGINT_0, bytesToInt, intToBytes } from '@ethereumjs/util'
import { DBKey, MetaDBManager } from '../util/metaDBManager.ts'

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
export class TxIndex extends MetaDBManager {
  private rlpEncode(value: TxHashIndex): Uint8Array {
    const [blockHash, txIndex] = value as TxHashIndex
    return RLP.encode([blockHash, intToBytes(txIndex)])
  }
  private rlpDecode(value: Uint8Array): TxHashIndex {
    const [blockHash, txIndex] = RLP.decode(value) as unknown as rlpTxHash
    return [blockHash, bytesToInt(txIndex)] as TxHashIndex
  }
  async updateIndex(operation: IndexOperation, type: IndexType, value: any): Promise<void> {
    switch (type) {
      case IndexType.TxHash: {
        const block = value
        if (operation === IndexOperation.Save) {
          const withinTxLookupLimit =
            this.config.txLookupLimit === 0 ||
            this.chain.headers.height - BigInt(this.config.txLookupLimit) < block.header.number
          if (withinTxLookupLimit) {
            for (const [i, tx] of block.transactions.entries()) {
              const index: TxHashIndex = [block.hash(), i]
              const encoded = this.rlpEncode(index)
              await this.put(DBKey.TxHash, tx.hash(), encoded)
            }
          }
          if (this.config.txLookupLimit > 0) {
            // Remove tx hashes for one block past txLookupLimit
            const limit = this.chain.headers.height - BigInt(this.config.txLookupLimit)
            if (limit < BIGINT_0) return
            const blockDelIndexes = await this.chain.getBlock(limit)
            void this.updateIndex(IndexOperation.Delete, IndexType.TxHash, blockDelIndexes)
          }
        } else if (operation === IndexOperation.Delete) {
          for (const tx of block.transactions) {
            await this.delete(DBKey.TxHash, tx.hash())
          }
        }
        break
      }
    }
  }

  /**
   * Returns the value for an index or null if not found
   * @param value for {@link IndexType.TxHash}, the txHash to get
   */
  async getIndex(value: Uint8Array): Promise<TxHashIndex | null> {
    const encoded = await this.get(DBKey.TxHash, value)
    if (encoded === null) return null
    return this.rlpDecode(encoded)
  }
}
