import { createBlockHeaderFromBytesArray } from '@ethereumjs/block'
import type { ChainConfig } from '@ethereumjs/common'
import { Common } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { TransactionType, createTxFromBlockBodyData } from '@ethereumjs/tx'
import type { BALJSONBlockAccessList } from '@ethereumjs/util'
import {
  bytesToBigInt,
  bytesToHex,
  createBlockLevelAccessListFromRLP,
  equalsBytes,
  hexToBigInt,
  hexToBytes,
} from '@ethereumjs/util'

import { EIP1967_IMPLEMENTATION_SLOT, TOPIC } from '../contracts/signatureCatalog.ts'
import { ethyKeccak256 } from '../crypto/keccak.ts'
import type {
  BlobTxRow,
  BlockContractObservations,
  BlockEconomyRecord,
  ContractBlockContribution,
  ContractGasRow,
  ContractRevertRow,
  DelegationTargetRow,
  LogObservation,
  SlotWriteRow,
  TxCallObservation,
  TxObservationSlice,
  TxTypeSplit,
} from './types.ts'

const MAX_CALLS_PER_BLOCK = 64
const MAX_LOGS_PER_BLOCK = 128

export type DecodeBundleInput = {
  blockNumber: bigint
  headerRlp: Uint8Array
  bodyRlp?: Uint8Array
  receiptsEth69Rlp?: Uint8Array
  balJson?: BALJSONBlockAccessList
  balRlp?: Uint8Array
  chain: ChainConfig
  hardfork: string
}

function emptyTxSplit(): TxTypeSplit {
  return {
    legacy: 0,
    accessList: 0,
    feeMarket: 0,
    blob: 0,
    setCode: 0,
    other: 0,
  }
}

function bumpTxType(split: TxTypeSplit, type: number): void {
  switch (type) {
    case TransactionType.Legacy:
      split.legacy += 1
      break
    case TransactionType.AccessListEIP2930:
      split.accessList += 1
      break
    case TransactionType.FeeMarketEIP1559:
      split.feeMarket += 1
      break
    case TransactionType.BlobEIP4844:
      split.blob += 1
      break
    case TransactionType.EOACodeEIP7702:
      split.setCode += 1
      break
    default:
      split.other += 1
  }
}

function receiptStatus(receipt: unknown): bigint | undefined {
  let payload = receipt
  if (payload instanceof Uint8Array && payload.length > 0 && payload[0]! <= 0x7f) {
    try {
      payload = RLP.decode(payload.subarray(1)) as unknown
    } catch {
      return undefined
    }
  }
  if (Array.isArray(payload) && payload.length >= 3) {
    const isEth69 =
      payload.length === 4 && payload[2] instanceof Uint8Array && payload[2].length !== 256
    const statusBytes = isEth69 ? payload[1] : payload[0]
    if (statusBytes instanceof Uint8Array) {
      try {
        return bytesToBigInt(statusBytes)
      } catch {
        return undefined
      }
    }
  }
  return undefined
}

function countReceipts(
  receiptsRlp: Uint8Array,
  txCount: number,
  txSlices?: TxObservationSlice[],
): { success?: number; reverts?: number; firstRevertTo?: string } {
  try {
    const decoded = RLP.decode(receiptsRlp) as unknown
    if (!Array.isArray(decoded) || decoded.length !== txCount) return {}
    let success = 0
    let reverts = 0
    let firstRevertTo: string | undefined
    for (let i = 0; i < decoded.length; i++) {
      const row = decoded[i]
      const status = receiptStatus(row)
      if (status === 1n) success += 1
      else if (status === 0n) {
        reverts += 1
        if (firstRevertTo === undefined && txSlices !== undefined) {
          const to = txSlices[i]?.to
          if (to !== undefined) firstRevertTo = to
        }
      }
    }
    return { success, reverts, firstRevertTo }
  } catch {
    return {}
  }
}

function decodeExtraDataAscii(extra: Uint8Array): string | undefined {
  if (extra.length < 3) return undefined
  let printable = 0
  let out = ''
  for (const b of extra) {
    if (b >= 0x20 && b <= 0x7e) {
      printable += 1
      out += String.fromCharCode(b)
    }
  }
  if (printable < 3) return undefined
  return out.trim().replace(/\s+/g, ' ')
}

function nibbleTouchesFromBal(bal: BALJSONBlockAccessList): number[] {
  const counts = new Array<number>(16).fill(0)
  for (const acct of bal) {
    try {
      const addr = hexToBytes(acct.address)
      const hash = ethyKeccak256(addr)
      const nibble = hash[0]! >> 4
      counts[nibble]! += 1
    } catch {
      // skip malformed address
    }
  }
  return counts
}

function topicToHex(topic: unknown): string | undefined {
  if (topic instanceof Uint8Array) return `0x${bytesToHex(topic)}`
  return undefined
}

function parseLogRow(row: unknown): LogObservation | undefined {
  try {
    if (!Array.isArray(row) || row.length < 2) return undefined
    const addr = row[0]
    const topicsRaw = row[1]
    const dataRaw = row[2]
    if (!(addr instanceof Uint8Array)) return undefined
    if (!Array.isArray(topicsRaw)) return undefined
    const topics: string[] = []
    for (const t of topicsRaw) {
      const h = topicToHex(t)
      if (h === undefined) return undefined
      topics.push(h)
    }
    if (topics.length === 0) return undefined
    const data = dataRaw instanceof Uint8Array ? dataRaw : new Uint8Array(0)
    const emitter = `0x${bytesToHex(addr)}`.toLowerCase()
    const transferDestinations: string[] = []
    const t0 = topics[0]!.toLowerCase()
    if (t0 === TOPIC.transferErc20.toLowerCase() && topics[2] !== undefined) {
      transferDestinations.push(`0x${topics[2]!.slice(-40)}`.toLowerCase())
    }
    return {
      emitter,
      topic0: topics[0]!,
      topics,
      data,
      transferDestinations,
    }
  } catch {
    return undefined
  }
}

function parseReceiptLogs(receipt: unknown): LogObservation[] {
  const logs: LogObservation[] = []
  try {
    let payload = receipt
    if (payload instanceof Uint8Array && payload.length > 0 && payload[0]! <= 0x7f) {
      payload = RLP.decode(payload.subarray(1)) as unknown
    }
    if (!Array.isArray(payload)) return logs
    const logsField = payload[payload.length - 1]
    if (!Array.isArray(logsField)) return logs
    for (const row of logsField) {
      const parsed = parseLogRow(row)
      if (parsed !== undefined) logs.push(parsed)
    }
  } catch {
    return logs
  }
  return logs
}

function parseBodyTxs(
  bodyRlp: Uint8Array,
  chain: ChainConfig,
  hardfork: string,
): {
  txCount: number
  ethTransferredWei: bigint
  txTypeSplit: TxTypeSplit
  largestTransferWei: bigint
  largestTransferTo?: string
  txSlices: TxObservationSlice[]
  contractCreationCount: number
} {
  let contractCreations = 0
  const out = {
    txCount: 0,
    ethTransferredWei: 0n,
    txTypeSplit: emptyTxSplit(),
    largestTransferWei: 0n,
    largestTransferTo: undefined as string | undefined,
    txSlices: [] as TxObservationSlice[],
    contractCreationCount: 0,
  }
  try {
    const common = new Common({ chain, hardfork })
    const body = RLP.decode(bodyRlp) as unknown
    if (!Array.isArray(body) || !Array.isArray(body[0])) return out
    for (const raw of body[0]) {
      try {
        const tx = createTxFromBlockBodyData(raw as Uint8Array | Uint8Array[], { common })
        out.txCount += 1
        if (!('to' in tx) || tx.to === undefined) contractCreations += 1
        bumpTxType(out.txTypeSplit, tx.type)
        const value = tx.value
        out.ethTransferredWei += value
        if (value > out.largestTransferWei) {
          out.largestTransferWei = value
          const to = 'to' in tx && tx.to !== undefined ? tx.to : undefined
          out.largestTransferTo = to !== undefined ? to.toString() : undefined
        }
        const toAddr =
          'to' in tx && tx.to !== undefined ? tx.to.toString().toLowerCase() : undefined
        const data = tx.data
        let selector: string | undefined
        if (data.length >= 4) {
          selector = `0x${bytesToHex(data.subarray(0, 4))}`
        }
        out.txSlices.push({ to: toAddr, selector, data, logs: [] })
      } catch {
        out.txTypeSplit.other += 1
        out.txCount += 1
        out.txSlices.push({ logs: [] })
      }
    }
  } catch {
    // header-only path may omit body
  }
  out.contractCreationCount = contractCreations
  return out
}

function buildObservations(
  body: ReturnType<typeof parseBodyTxs>,
  receiptsRlp: Uint8Array | undefined,
  balJson: BALJSONBlockAccessList | undefined,
): BlockContractObservations {
  const calls: TxCallObservation[] = []
  const logs: LogObservation[] = []
  const blockAddresses = new Set<string>()
  if (receiptsRlp !== undefined && body.txCount > 0) {
    try {
      const decoded = RLP.decode(receiptsRlp) as unknown
      if (Array.isArray(decoded)) {
        for (let i = 0; i < decoded.length && i < body.txSlices.length; i++) {
          const txLogs = parseReceiptLogs(decoded[i])
          body.txSlices[i]!.logs = txLogs
        }
      }
    } catch {
      // ignore malformed receipts
    }
  }
  for (const slice of body.txSlices) {
    if (
      slice.to !== undefined &&
      slice.selector !== undefined &&
      calls.length < MAX_CALLS_PER_BLOCK
    ) {
      calls.push({
        to: slice.to,
        selector: slice.selector,
        data: slice.data ?? new Uint8Array(0),
      })
    }
    for (const log of slice.logs) {
      if (logs.length >= MAX_LOGS_PER_BLOCK) break
      logs.push(log)
    }
  }
  if (balJson !== undefined) {
    for (const acct of balJson) {
      blockAddresses.add(acct.address.toLowerCase())
    }
  }
  return {
    calls,
    logs,
    blockAddresses: [...blockAddresses],
    txSlices: body.txSlices,
  }
}

function contractContributionsFromBal(balJson: BALJSONBlockAccessList): {
  activeAccounts: number
  storageWrites: number
  storageReads: number
  newDeployments: number
  contributions: ContractBlockContribution[]
} {
  let storageWrites = 0
  let storageReads = 0
  let newDeployments = 0
  const contributions: ContractBlockContribution[] = []
  for (const acct of balJson) {
    const writes = acct.storageChanges.reduce((n, row) => n + row.slotChanges.length, 0)
    const reads = acct.storageReads.length
    const codeChanged = acct.codeChanges.length > 0
    if (codeChanged) newDeployments += 1
    storageWrites += writes
    storageReads += reads
    if (writes === 0 && reads === 0 && !codeChanged) continue
    let postBalance: bigint | undefined
    if (acct.balanceChanges.length > 0) {
      const last = acct.balanceChanges[acct.balanceChanges.length - 1]!
      try {
        postBalance = hexToBigInt(last.postBalance)
      } catch {
        postBalance = undefined
      }
    }
    contributions.push({
      address: acct.address.toLowerCase(),
      writes,
      reads,
      codeChanged,
      postBalance,
    })
  }
  return {
    activeAccounts: balJson.length,
    storageWrites,
    storageReads,
    newDeployments,
    contributions,
  }
}

function resolveBalJson(
  headerRlp: Uint8Array,
  balJson?: BALJSONBlockAccessList,
  balRlp?: Uint8Array,
  chain?: ChainConfig,
  hardfork?: string,
): BALJSONBlockAccessList | undefined {
  if (balJson !== undefined) return balJson
  if (
    balRlp === undefined ||
    balRlp.length === 0 ||
    chain === undefined ||
    hardfork === undefined
  ) {
    return undefined
  }
  try {
    const common = new Common({ chain, hardfork })
    const raw = RLP.decode(headerRlp) as never
    const header = createBlockHeaderFromBytesArray(raw, {
      common,
      skipConsensusFormatValidation: true,
    })
    const balHash = header.blockAccessListHash
    if (balHash === undefined || balHash.length === 0) return undefined
    const bal = createBlockLevelAccessListFromRLP(balRlp)
    if (!equalsBytes(bal.hash(), balHash)) return undefined
    return bal.toJSON()
  } catch {
    return undefined
  }
}

function parseHeaderWithFallback(
  headerRlp: Uint8Array,
  chain: ChainConfig,
  hardfork: string,
  fallbackNumber: bigint,
) {
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
          : fallbackNumber
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

const DELEGATION_PREFIX = hexToBytes('0xef0100')
const MAX_BLOB_TXS = 32
const MAX_CONTRACT_GAS_ROWS = 32
const MAX_SLOT_WRITES = 64

function percentileBigInt(sorted: bigint[], pct: number): bigint | undefined {
  if (sorted.length === 0) return undefined
  const idx = Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * pct))
  return sorted[idx]
}

function topGasAndRevertRows(
  gasMap: Map<string, bigint>,
  revMap: Map<string, number>,
): { gas: ContractGasRow[]; reverts: ContractRevertRow[] } {
  const gas = [...gasMap.entries()]
    .sort((a, b) => (b[1] > a[1] ? 1 : b[1] < a[1] ? -1 : 0))
    .slice(0, MAX_CONTRACT_GAS_ROWS)
    .map(([address, gasUsed]) => ({ address, gasUsed }))
  const reverts = [...revMap.entries()]
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_CONTRACT_GAS_ROWS)
    .map(([address, reverts]) => ({ address, reverts }))
  return { gas, reverts }
}

function mergeDelegationTargets(
  map: Map<string, { count: number; revocations: number }>,
): DelegationTargetRow[] {
  return [...map.entries()].map(([target, row]) => ({
    target,
    count: row.count,
    revocations: row.revocations,
  }))
}

function slotWritesFromBal(bal: BALJSONBlockAccessList): SlotWriteRow[] {
  const out: SlotWriteRow[] = []
  const seen = new Set<string>()
  for (const acct of bal) {
    const address = acct.address.toLowerCase()
    for (const slotRow of acct.storageChanges) {
      if (slotRow.slotChanges.length === 0) continue
      const slot = slotRow.slot.toLowerCase()
      const key = `${address}:${slot}`
      if (seen.has(key)) continue
      seen.add(key)
      const last = slotRow.slotChanges[slotRow.slotChanges.length - 1]!
      try {
        const postValue = hexToBigInt(last.postValue)
        out.push({ address, slot, postValue })
        if (out.length >= MAX_SLOT_WRITES) return out
      } catch {
        // skip malformed slot value
      }
    }
  }
  return out
}

const ZERO_ADDR = '0x0000000000000000000000000000000000000000'

function delegationFromBalCode(
  bal: BALJSONBlockAccessList,
): Map<string, { count: number; revocations: number }> {
  const balDelegates = new Map<string, { count: number; revocations: number }>()
  for (const acct of bal) {
    for (const ch of acct.codeChanges) {
      try {
        const code = hexToBytes(ch.newCode)
        if (code.length >= 23 && equalsBytes(code.subarray(0, 3), DELEGATION_PREFIX)) {
          const target = bytesToHex(code.subarray(3, 23)).toLowerCase()
          const row = balDelegates.get(target) ?? { count: 0, revocations: 0 }
          row.count += 1
          balDelegates.set(target, row)
        }
      } catch {
        // skip
      }
    }
  }
  return balDelegates
}

function enrichFromBodyReceiptsAndBal(
  base: BlockEconomyRecord,
  header: ReturnType<typeof parseHeaderWithFallback> | undefined,
  input: DecodeBundleInput,
  bodyRlp?: Uint8Array,
  bal?: BALJSONBlockAccessList,
): void {
  try {
    if (header !== undefined) {
      try {
        if (header.excessBlobGas !== undefined) {
          base.blobBaseFeeWei = header.getBlobGasPrice()
        }
      } catch {
        // skip blob fee
      }
    }
    const delegateMap = new Map<string, { count: number; revocations: number }>()
    const blobRows: BlobTxRow[] = []
    let totalBlobCount = 0
    const tips: bigint[] = []
    const senderCounts = new Map<string, number>()
    const gasByContract = new Map<string, bigint>()
    const revertsByContract = new Map<string, number>()
    const baseFee = base.baseFeeWei ?? 0n

    if (bodyRlp !== undefined) {
      try {
        const common = new Common({ chain: input.chain, hardfork: input.hardfork })
        const body = RLP.decode(bodyRlp) as unknown
        if (Array.isArray(body) && Array.isArray(body[0])) {
          const txs: ReturnType<typeof createTxFromBlockBodyData>[] = []
          for (const raw of body[0]) {
            try {
              const tx = createTxFromBlockBodyData(raw as Uint8Array | Uint8Array[], { common })
              txs.push(tx)
              const from = tx.getSenderAddress().toString().toLowerCase()
              senderCounts.set(from, (senderCounts.get(from) ?? 0) + 1)
              if (tx.type === TransactionType.EOACodeEIP7702 && 'authorizationList' in tx) {
                const list = tx.authorizationList as readonly (readonly Uint8Array[])[]
                for (const item of list) {
                  if (item.length < 2 || !(item[1] instanceof Uint8Array)) continue
                  const target = bytesToHex(item[1]).toLowerCase()
                  if (target === ZERO_ADDR) {
                    const row = delegateMap.get(ZERO_ADDR) ?? { count: 0, revocations: 0 }
                    row.revocations += 1
                    delegateMap.set(ZERO_ADDR, row)
                  } else {
                    const row = delegateMap.get(target) ?? { count: 0, revocations: 0 }
                    row.count += 1
                    delegateMap.set(target, row)
                  }
                }
              }
              if (tx.type === TransactionType.BlobEIP4844) {
                const to =
                  'to' in tx && tx.to !== undefined
                    ? tx.to.toString().toLowerCase()
                    : '0x0000000000000000000000000000000000000000'
                const blobCount =
                  'blobVersionedHashes' in tx && tx.blobVersionedHashes !== undefined
                    ? tx.blobVersionedHashes.length
                    : 0
                totalBlobCount += blobCount
                if (blobRows.length < MAX_BLOB_TXS) {
                  blobRows.push({
                    to,
                    blobCount,
                    maxFeePerBlobGas:
                      'maxFeePerBlobGas' in tx && tx.maxFeePerBlobGas !== undefined
                        ? tx.maxFeePerBlobGas
                        : undefined,
                  })
                }
              }
              if ('maxFeePerGas' in tx && tx.maxFeePerGas !== undefined) {
                const maxPrio =
                  'maxPriorityFeePerGas' in tx && tx.maxPriorityFeePerGas !== undefined
                    ? tx.maxPriorityFeePerGas
                    : 0n
                const cap = baseFee + maxPrio
                const effective = tx.maxFeePerGas < cap ? tx.maxFeePerGas : cap
                const tip = effective > baseFee ? effective - baseFee : 0n
                if (tip > 0n) tips.push(tip)
              } else if ('gasPrice' in tx && tx.gasPrice !== undefined && tx.gasPrice > baseFee) {
                tips.push(tx.gasPrice - baseFee)
              }
            } catch {
              // skip malformed tx
            }
          }
          if (input.receiptsEth69Rlp !== undefined && txs.length > 0) {
            try {
              const decoded = RLP.decode(input.receiptsEth69Rlp) as unknown
              if (Array.isArray(decoded) && decoded.length === txs.length) {
                let prevCum = 0n
                for (let i = 0; i < decoded.length; i++) {
                  const row = decoded[i]
                  const status = receiptStatus(row)
                  let cum = 0n
                  let payload = row
                  if (payload instanceof Uint8Array && payload.length > 0 && payload[0]! <= 0x7f) {
                    payload = RLP.decode(payload.subarray(1)) as unknown
                  }
                  if (Array.isArray(payload)) {
                    const isEth69 =
                      payload.length === 4 &&
                      payload[2] instanceof Uint8Array &&
                      payload[2].length !== 256
                    const cumGasBytes = isEth69 ? payload[2] : payload[1]
                    if (cumGasBytes instanceof Uint8Array) {
                      cum = bytesToBigInt(cumGasBytes)
                    }
                  }
                  const gasUsed = cum > prevCum ? cum - prevCum : 0n
                  prevCum = cum
                  const tx = txs[i]
                  const to =
                    tx !== undefined && 'to' in tx && tx.to !== undefined
                      ? tx.to.toString().toLowerCase()
                      : undefined
                  if (to !== undefined && gasUsed > 0n) {
                    gasByContract.set(to, (gasByContract.get(to) ?? 0n) + gasUsed)
                  }
                  if (status === 0n && to !== undefined) {
                    revertsByContract.set(to, (revertsByContract.get(to) ?? 0) + 1)
                  }
                }
              }
            } catch {
              // skip receipt gas walk
            }
          }
        }
      } catch {
        // skip body enrich
      }
    }

    if (bal !== undefined) {
      const balDelegates = delegationFromBalCode(bal)
      // Prefer authoritative BAL code writes when present (avoid 2x double-counting with authList)
      if (balDelegates.size > 0) {
        const revocations = delegateMap.get(ZERO_ADDR)
        delegateMap.clear()
        for (const [k, v] of balDelegates) delegateMap.set(k, v)
        if (revocations !== undefined) delegateMap.set(ZERO_ADDR, revocations)
      }
      const slots = slotWritesFromBal(bal)
      if (slots.length > 0) base.slotWrites = slots
      for (const acct of bal) {
        const n = acct.nonceChanges?.length ?? 0
        if (n >= 3) {
          base.sameSenderBursts = base.sameSenderBursts ?? []
          if (!base.sameSenderBursts.includes(acct.address.toLowerCase())) {
            base.sameSenderBursts.push(acct.address.toLowerCase())
          }
        }
      }
    }

    if (tips.length > 0) {
      const sorted = [...tips].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
      base.medianPriorityTipWei = percentileBigInt(sorted, 0.5)
      base.p90PriorityTipWei = percentileBigInt(sorted, 0.9)
    }
    if (blobRows.length > 0) {
      base.blobTxs = blobRows
      base.totalBlobCount = totalBlobCount
      if (base.blobGasUsed !== undefined && base.blobBaseFeeWei !== undefined) {
        base.blobFeeBurnedWei = base.blobGasUsed * base.blobBaseFeeWei
      }
    }
    const mergedDelegates = mergeDelegationTargets(delegateMap)
    if (mergedDelegates.length > 0) base.delegationTargets = mergedDelegates
    const { gas, reverts } = topGasAndRevertRows(gasByContract, revertsByContract)
    if (gas.length > 0) base.gasUsedByContract = gas
    if (reverts.length > 0) base.revertsByContract = reverts
    const bursts = [...senderCounts.entries()].filter(([, n]) => n >= 3).map(([a]) => a)
    if (bursts.length > 0) {
      base.sameSenderBursts = [...new Set([...(base.sameSenderBursts ?? []), ...bursts])]
    }
  } catch {
    // enrich must never throw
  }
}

/** Pure decode of one bundle into a block economy record (never throws). */
export function decodeBundle(input: DecodeBundleInput): BlockEconomyRecord {
  const base: BlockEconomyRecord = {
    blockNumber: input.blockNumber,
    hasTxBody: false,
    gasFullPct: 0,
    txCount: 0,
    ethTransferredWei: 0n,
    txTypeSplit: emptyTxSplit(),
    largestTransferWei: 0n,
    contractContributions: [],
  }
  let headerRef: ReturnType<typeof parseHeaderWithFallback> | undefined
  try {
    headerRef = parseHeaderWithFallback(
      input.headerRlp,
      input.chain,
      input.hardfork,
      input.blockNumber,
    )
    if (headerRef.number !== input.blockNumber) {
      // still use provided block number for ring ordering
    }
    if (headerRef.baseFeePerGas !== undefined) {
      base.baseFeeWei = headerRef.baseFeePerGas
    }
    if (headerRef.gasLimit > 0n) {
      base.gasFullPct = Number((headerRef.gasUsed * 100n) / headerRef.gasLimit)
    }
    if (headerRef.blobGasUsed !== undefined) {
      base.blobGasUsed = headerRef.blobGasUsed
    }
    if (headerRef.timestamp !== undefined) {
      base.timestamp = Number(headerRef.timestamp)
    }
    const extra = headerRef.extraData
    if (extra.length > 0) {
      base.extraDataHex = `0x${bytesToHex(extra)}`
      const ascii = decodeExtraDataAscii(extra)
      if (ascii !== undefined) base.extraDataAscii = ascii
    }
  } catch {
    return base
  }

  let bal: BALJSONBlockAccessList | undefined
  let bodyParse: ReturnType<typeof parseBodyTxs> | undefined
  if (input.bodyRlp !== undefined) {
    base.hasTxBody = true
    bodyParse = parseBodyTxs(input.bodyRlp, input.chain, input.hardfork)
    base.txCount = bodyParse.txCount
    base.ethTransferredWei = bodyParse.ethTransferredWei
    base.txTypeSplit = bodyParse.txTypeSplit
    base.largestTransferWei = bodyParse.largestTransferWei
    base.largestTransferTo = bodyParse.largestTransferTo
    base.contractCreationCount = bodyParse.contractCreationCount
    if (input.receiptsEth69Rlp !== undefined && bodyParse.txCount > 0) {
      const rc = countReceipts(input.receiptsEth69Rlp, bodyParse.txCount, bodyParse.txSlices)
      base.receiptSuccess = rc.success
      base.receiptReverts = rc.reverts
      base.firstRevertTo = rc.firstRevertTo
    }
  }

  bal = resolveBalJson(input.headerRlp, input.balJson, input.balRlp, input.chain, input.hardfork)
  if (bal !== undefined) {
    const heat = contractContributionsFromBal(bal)
    base.activeAccounts = heat.activeAccounts
    base.storageWrites = heat.storageWrites
    base.storageReads = heat.storageReads
    base.newDeployments = heat.newDeployments
    base.contractContributions = heat.contributions
    const implSlot = EIP1967_IMPLEMENTATION_SLOT.toLowerCase()
    const snaps: Array<{ address: string; code?: Uint8Array; implSlot?: string }> = []
    for (const acct of bal) {
      const address = acct.address.toLowerCase()
      let code: Uint8Array | undefined
      if (acct.codeChanges.length > 0) {
        const last = acct.codeChanges[acct.codeChanges.length - 1]!
        try {
          code = hexToBytes(last.newCode)
        } catch {
          code = undefined
        }
      }
      let slotVal: string | undefined
      for (const slotRow of acct.storageChanges) {
        if (slotRow.slot.toLowerCase() !== implSlot) continue
        const lastChange = slotRow.slotChanges[slotRow.slotChanges.length - 1]
        if (lastChange !== undefined) slotVal = lastChange.postValue
      }
      if (code !== undefined || slotVal !== undefined) {
        snaps.push({ address, code, implSlot: slotVal })
      }
    }
    if (snaps.length > 0) base.balSnapshots = snaps
    base.nibbleTouches = nibbleTouchesFromBal(bal)
    base.resolvedBalJson = bal
  }

  if (bodyParse !== undefined) {
    base.observations = buildObservations(bodyParse, input.receiptsEth69Rlp, bal)
  }

  enrichFromBodyReceiptsAndBal(base, headerRef, input, input.bodyRlp, bal)

  return base
}
