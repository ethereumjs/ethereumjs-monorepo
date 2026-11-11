import { createBlockHeaderFromBytesArray } from '@ethereumjs/block'
import type { ChainConfig } from '@ethereumjs/common'
import { Common } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { createTxFromBlockBodyData } from '@ethereumjs/tx'

import type { StoredRpcBlock } from './blockWindowStore.ts'
import { dataHex, quantityHex } from './quantities.ts'

export function formatRpcBlock(
  stored: StoredRpcBlock,
  chain: ChainConfig,
  hardfork: string,
  fullTx: boolean,
): Record<string, unknown> | null {
  const common = new Common({ chain, hardfork })
  try {
    const header = createBlockHeaderFromBytesArray(RLP.decode(stored.headerRlp) as never, {
      common,
      skipConsensusFormatValidation: true,
    })
    const blockHash = dataHex(stored.blockHash)
    let transactions: (string | Record<string, unknown>)[] = stored.txHashes
    if (fullTx && stored.bodyRlp !== undefined) {
      transactions = []
      const body = RLP.decode(stored.bodyRlp) as unknown
      if (Array.isArray(body) && Array.isArray(body[0])) {
        let idx = 0
        for (const raw of body[0]) {
          const tx = createTxFromBlockBodyData(raw as Uint8Array | Uint8Array[], { common })
          const json = tx.toJSON()
          transactions.push({
            ...json,
            blockHash,
            blockNumber: quantityHex(header.number),
            transactionIndex: quantityHex(BigInt(idx)),
            hash: dataHex(tx.hash()),
            from: tx.getSenderAddress().toString(),
          })
          idx += 1
        }
      }
    }
    return {
      number: quantityHex(header.number),
      hash: blockHash,
      parentHash: dataHex(header.parentHash),
      nonce: dataHex(header.nonce),
      sha3Uncles: dataHex(header.uncleHash),
      logsBloom: dataHex(header.logsBloom),
      transactionsRoot: dataHex(header.transactionsTrie),
      stateRoot: dataHex(header.stateRoot),
      receiptsRoot: dataHex(header.receiptTrie),
      miner: header.coinbase.toString(),
      difficulty: quantityHex(header.difficulty),
      extraData: dataHex(header.extraData),
      gasLimit: quantityHex(header.gasLimit),
      gasUsed: quantityHex(header.gasUsed),
      timestamp: quantityHex(header.timestamp),
      transactions,
      uncles: [],
      baseFeePerGas:
        header.baseFeePerGas !== undefined ? quantityHex(header.baseFeePerGas) : undefined,
      blobGasUsed: header.blobGasUsed !== undefined ? quantityHex(header.blobGasUsed) : undefined,
      excessBlobGas:
        header.excessBlobGas !== undefined ? quantityHex(header.excessBlobGas) : undefined,
      blockAccessListHash:
        header.blockAccessListHash !== undefined ? dataHex(header.blockAccessListHash) : undefined,
    }
  } catch {
    return null
  }
}
