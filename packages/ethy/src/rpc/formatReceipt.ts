import type { ChainConfig } from '@ethereumjs/common'
import { Common } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { createTxFromBlockBodyData } from '@ethereumjs/tx'
import {
  bytesToBigInt,
  bytesToUnprefixedHex,
  createAddressFromString,
  createContractAddress,
} from '@ethereumjs/util'

import type { StoredRpcBlock } from './blockWindowStore.ts'
import { decodeRpcHeader } from './formatBlock.ts'
import { dataHex, quantityHex } from './quantities.ts'

export type RpcLog = {
  address: string
  topics: string[]
  data: string
  blockNumber: string
  blockHash: string
  transactionHash: string
  transactionIndex: string
  logIndex: string
  removed: boolean
}

export type RpcReceipt = {
  transactionHash: string
  transactionIndex: string
  blockHash: string
  blockNumber: string
  from: string
  to: string | null
  cumulativeGasUsed: string
  gasUsed: string
  contractAddress: string | null
  logs: RpcLog[]
  logsBloom: string
  status: string
  effectiveGasPrice: string
  type: string
}

function receiptFields(
  receipt: unknown,
): { status: bigint; cumulativeGas: bigint; logsRaw: unknown } | undefined {
  try {
    let payload = receipt
    if (payload instanceof Uint8Array && payload.length > 0 && payload[0]! <= 0x7f) {
      payload = RLP.decode(payload.subarray(1)) as unknown
    }
    if (!Array.isArray(payload) || payload.length < 3) return undefined
    // eth/69 (EIP-7642): [txType, postStateOrStatus, cumulativeGas, logs]
    // eth/68: [postStateOrStatus, cumulativeGas, logsBloom(256B), logs] or [postStateOrStatus, cumulativeGas, logs]
    const isEth69 =
      payload.length === 4 && payload[2] instanceof Uint8Array && payload[2].length !== 256
    const statusBytes = isEth69 ? payload[1] : payload[0]
    const cumGasBytes = isEth69 ? payload[2] : payload[1]
    const logsRaw = payload[payload.length - 1]
    const status = statusBytes instanceof Uint8Array ? bytesToBigInt(statusBytes) : 1n
    const cumulativeGas = cumGasBytes instanceof Uint8Array ? bytesToBigInt(cumGasBytes) : 0n
    return { status, cumulativeGas, logsRaw }
  } catch {
    return undefined
  }
}

function effectiveGasPriceWei(
  headerBaseFee: bigint | undefined,
  tx: ReturnType<typeof createTxFromBlockBodyData>,
): bigint {
  if ('maxFeePerGas' in tx && tx.maxFeePerGas !== undefined) {
    const base = headerBaseFee ?? 0n
    const maxPrio = 'maxPriorityFeePerGas' in tx ? (tx.maxPriorityFeePerGas ?? 0n) : 0n
    const cap = base + maxPrio
    return tx.maxFeePerGas < cap ? tx.maxFeePerGas : cap
  }
  return 'gasPrice' in tx && tx.gasPrice !== undefined ? tx.gasPrice : 0n
}

export function formatRpcReceipt(
  stored: StoredRpcBlock,
  txIndex: number,
  rawTx: Uint8Array,
  chain: ChainConfig,
  hardfork: string,
): RpcReceipt | null {
  if (stored.receiptsEth69Rlp === undefined) return null
  const common = new Common({ chain, hardfork })
  try {
    const header = decodeRpcHeader(stored.headerRlp, chain, hardfork, stored.blockNumber)
    const tx = createTxFromBlockBodyData(rawTx, { common })
    const decoded = RLP.decode(stored.receiptsEth69Rlp) as unknown
    if (!Array.isArray(decoded) || txIndex >= decoded.length) return null
    const parsed = receiptFields(decoded[txIndex])
    if (parsed === undefined) return null
    const { status, cumulativeGas: cumulative, logsRaw } = parsed
    let prevCum = 0n
    if (txIndex > 0) {
      const prev = receiptFields(decoded[txIndex - 1])
      if (prev !== undefined) {
        prevCum = prev.cumulativeGas
      }
    }
    const gasUsed = cumulative > prevCum ? cumulative - prevCum : cumulative
    const from = tx.getSenderAddress().toString()
    const to = 'to' in tx && tx.to !== undefined ? tx.to.toString() : null
    let contractAddress: string | null = null
    if (to === null && status === 1n) {
      contractAddress = createContractAddress(createAddressFromString(from), tx.nonce).toString()
    }
    const logs: RpcLog[] = []
    if (Array.isArray(logsRaw)) {
      let logIndex = 0
      for (const logRow of logsRaw) {
        if (!Array.isArray(logRow) || logRow.length < 3) continue
        const addr = logRow[0]
        const topicsRaw = logRow[1]
        const data = logRow[2]
        if (!(addr instanceof Uint8Array)) continue
        const topics: string[] = []
        if (Array.isArray(topicsRaw)) {
          for (const t of topicsRaw) {
            if (t instanceof Uint8Array) topics.push(dataHex(t))
          }
        }
        logs.push({
          address: createAddressFromString(`0x${bytesToUnprefixedHex(addr).slice(-40)}`).toString(),
          topics,
          data: data instanceof Uint8Array ? dataHex(data) : '0x',
          blockNumber: quantityHex(header.number),
          blockHash: dataHex(stored.blockHash),
          transactionHash: dataHex(tx.hash()),
          transactionIndex: quantityHex(BigInt(txIndex)),
          logIndex: quantityHex(BigInt(logIndex)),
          removed: false,
        })
        logIndex += 1
      }
    }
    const eff = effectiveGasPriceWei(header.baseFeePerGas, tx)
    return {
      transactionHash: dataHex(tx.hash()),
      transactionIndex: quantityHex(BigInt(txIndex)),
      blockHash: dataHex(stored.blockHash),
      blockNumber: quantityHex(header.number),
      from,
      to,
      cumulativeGasUsed: quantityHex(cumulative),
      gasUsed: quantityHex(gasUsed),
      contractAddress,
      logs,
      logsBloom: dataHex(header.logsBloom),
      status: quantityHex(status),
      effectiveGasPrice: quantityHex(eff),
      type: quantityHex(BigInt(tx.type)),
    }
  } catch {
    return null
  }
}

export function collectLogsFromBlock(
  stored: StoredRpcBlock,
  chain: ChainConfig,
  hardfork: string,
): RpcLog[] {
  const logs: RpcLog[] = []
  if (stored.receiptsEth69Rlp === undefined || stored.rawTxs.length === 0) return logs
  for (let idx = 0; idx < stored.rawTxs.length; idx++) {
    const rawTx = stored.rawTxs[idx]
    if (rawTx === undefined) continue
    const receipt = formatRpcReceipt(stored, idx, rawTx, chain, hardfork)
    if (receipt !== null) logs.push(...receipt.logs)
  }
  return logs
}
