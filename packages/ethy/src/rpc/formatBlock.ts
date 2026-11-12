import { type BlockHeader, createBlockHeaderFromBytesArray } from '@ethereumjs/block'
import type { ChainConfig } from '@ethereumjs/common'
import { Common } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { createTxFromBlockBodyData } from '@ethereumjs/tx'
import { bytesToBigInt } from '@ethereumjs/util'

import type { StoredRpcBlock } from './blockWindowStore.ts'
import { dataHex, quantityHex } from './quantities.ts'

export function decodeRpcHeader(
  headerRlp: Uint8Array,
  chain: ChainConfig,
  hardfork: string,
  fallbackNumber?: bigint,
): BlockHeader {
  const raw = RLP.decode(headerRlp)
  const fields = Array.isArray(raw) ? raw : undefined
  const timestamp =
    fields !== undefined && fields.length >= 12 && fields[11] instanceof Uint8Array
      ? bytesToBigInt(fields[11])
      : 0n
  if (timestamp > 0n) {
    try {
      const blockNumber =
        fields !== undefined && fields.length >= 9 && fields[8] instanceof Uint8Array
          ? bytesToBigInt(fields[8])
          : (fallbackNumber ?? 0n)
      const dynamicCommon = new Common({ chain, hardfork })
      dynamicCommon.setHardforkBy({ blockNumber, timestamp })
      return createBlockHeaderFromBytesArray(raw as never, {
        common: dynamicCommon,
        skipConsensusFormatValidation: true,
      })
    } catch {
      // fall through to explicit hardfork
    }
  }
  const common = new Common({ chain, hardfork })
  return createBlockHeaderFromBytesArray(raw as never, {
    common,
    skipConsensusFormatValidation: true,
  })
}

export function formatRpcTransaction(
  tx: ReturnType<typeof createTxFromBlockBodyData>,
  blockHashHex: string,
  blockNumber: bigint,
  txIndex: number,
): Record<string, unknown> {
  const json = tx.toJSON()
  return {
    ...json,
    blockHash: blockHashHex,
    blockNumber: quantityHex(blockNumber),
    transactionIndex: quantityHex(BigInt(txIndex)),
    hash: dataHex(tx.hash()),
    from: tx.getSenderAddress().toString(),
    to: tx.to !== undefined ? tx.to.toString() : null,
    gas: quantityHex(tx.gasLimit),
    input: dataHex(tx.data),
  }
}

export function formatRpcBlock(
  stored: StoredRpcBlock,
  chain: ChainConfig,
  hardfork: string,
  fullTx: boolean,
): Record<string, unknown> | null {
  const common = new Common({ chain, hardfork })
  try {
    const header = decodeRpcHeader(stored.headerRlp, chain, hardfork, stored.blockNumber)
    const blockHash = dataHex(stored.blockHash)
    let transactions: (string | Record<string, unknown>)[] = stored.txHashes
    if (fullTx && stored.bodyRlp !== undefined) {
      transactions = []
      const body = RLP.decode(stored.bodyRlp) as unknown
      if (Array.isArray(body) && Array.isArray(body[0])) {
        let idx = 0
        for (const raw of body[0]) {
          const tx = createTxFromBlockBodyData(raw as Uint8Array | Uint8Array[], { common })
          transactions.push(formatRpcTransaction(tx, blockHash, header.number, idx))
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
      withdrawalsRoot:
        header.withdrawalsRoot !== undefined ? dataHex(header.withdrawalsRoot) : undefined,
      blobGasUsed: header.blobGasUsed !== undefined ? quantityHex(header.blobGasUsed) : undefined,
      excessBlobGas:
        header.excessBlobGas !== undefined ? quantityHex(header.excessBlobGas) : undefined,
      parentBeaconBlockRoot:
        header.parentBeaconBlockRoot !== undefined
          ? dataHex(header.parentBeaconBlockRoot)
          : undefined,
      requestsHash: header.requestsHash !== undefined ? dataHex(header.requestsHash) : undefined,
      blockAccessListHash:
        header.blockAccessListHash !== undefined ? dataHex(header.blockAccessListHash) : undefined,
    }
  } catch {
    return null
  }
}
