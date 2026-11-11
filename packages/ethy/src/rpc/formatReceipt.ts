import { createBlockHeaderFromBytesArray } from '@ethereumjs/block'
import type { ChainConfig } from '@ethereumjs/common'
import { Common } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { createTxFromBlockBodyData } from '@ethereumjs/tx'
import {
  bytesToUnprefixedHex,
  createAddressFromString,
  createContractAddress,
} from '@ethereumjs/util'

import type { StoredRpcBlock } from './blockWindowStore.ts'
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

function receiptPayload(receipt: unknown): unknown[] | undefined {
  try {
    let payload = receipt
    if (payload instanceof Uint8Array && payload.length > 0 && payload[0]! <= 0x7f) {
      payload = RLP.decode(payload.subarray(1)) as unknown
    }
    if (!Array.isArray(payload)) return undefined
    return payload
  } catch {
    return undefined
  }
}

function effectiveGasPriceWei(
  common: Common,
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
    const header = createBlockHeaderFromBytesArray(RLP.decode(stored.headerRlp) as never, {
      common,
      skipConsensusFormatValidation: true,
    })
    const tx = createTxFromBlockBodyData(rawTx, { common })
    const decoded = RLP.decode(stored.receiptsEth69Rlp) as unknown
    if (!Array.isArray(decoded) || txIndex >= decoded.length) return null
    const row = decoded[txIndex]
    const parts = receiptPayload(row)
    if (parts === undefined) return null
    const statusPart = parts[0]
    const cumGas = parts[1]
    const logsRaw = parts[parts.length - 1]
    const status =
      statusPart instanceof Uint8Array && statusPart.length > 0
        ? BigInt(statusPart[statusPart.length - 1]!)
        : 1n
    const cumulative =
      cumGas instanceof Uint8Array ? BigInt(`0x${bytesToUnprefixedHex(cumGas)}`) : 0n
    let prevCum = 0n
    if (txIndex > 0) {
      const prev = receiptPayload(decoded[txIndex - 1])
      const prevGas = prev?.[1]
      if (prevGas instanceof Uint8Array) {
        prevCum = BigInt(`0x${bytesToUnprefixedHex(prevGas)}`)
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
    const eff = effectiveGasPriceWei(common, header.baseFeePerGas, tx)
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
  if (stored.bodyRlp === undefined || stored.receiptsEth69Rlp === undefined) return logs
  const common = new Common({ chain, hardfork })
  try {
    const body = RLP.decode(stored.bodyRlp) as unknown
    if (!Array.isArray(body) || !Array.isArray(body[0])) return logs
    let idx = 0
    for (const raw of body[0]) {
      const rawTx = raw instanceof Uint8Array ? raw : (raw as Uint8Array[])[0]
      if (!(rawTx instanceof Uint8Array)) {
        idx += 1
        continue
      }
      const receipt = formatRpcReceipt(stored, idx, rawTx, chain, hardfork)
      if (receipt !== null) logs.push(...receipt.logs)
      idx += 1
    }
  } catch {
    return logs
  }
  return logs
}
