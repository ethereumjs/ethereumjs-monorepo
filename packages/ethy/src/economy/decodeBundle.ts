import { createBlockHeaderFromBytesArray } from '@ethereumjs/block'
import type { ChainConfig } from '@ethereumjs/common'
import { Common } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { TransactionType, createTxFromBlockBodyData } from '@ethereumjs/tx'
import type { BALJSONBlockAccessList } from '@ethereumjs/util'
import {
  bytesToBigInt,
  createBlockLevelAccessListFromRLP,
  equalsBytes,
  hexToBigInt,
} from '@ethereumjs/util'

import type { BlockEconomyRecord, ContractBlockContribution, TxTypeSplit } from './types.ts'

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
  if (receipt instanceof Uint8Array && receipt.length > 0 && receipt[0]! <= 0x7f) {
    try {
      const inner = RLP.decode(receipt.subarray(1)) as unknown
      if (Array.isArray(inner) && inner[0] instanceof Uint8Array) {
        return bytesToBigInt(inner[0])
      }
    } catch {
      return undefined
    }
  }
  if (Array.isArray(receipt) && receipt[0] instanceof Uint8Array) {
    try {
      return bytesToBigInt(receipt[0])
    } catch {
      return undefined
    }
  }
  return undefined
}

function countReceipts(
  receiptsRlp: Uint8Array,
  txCount: number,
): { success?: number; reverts?: number } {
  try {
    const decoded = RLP.decode(receiptsRlp) as unknown
    if (!Array.isArray(decoded) || decoded.length !== txCount) return {}
    let success = 0
    let reverts = 0
    for (const row of decoded) {
      const status = receiptStatus(row)
      if (status === 1n) success += 1
      else if (status === 0n) reverts += 1
    }
    return { success, reverts }
  } catch {
    return {}
  }
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
} {
  const out = {
    txCount: 0,
    ethTransferredWei: 0n,
    txTypeSplit: emptyTxSplit(),
    largestTransferWei: 0n,
    largestTransferTo: undefined as string | undefined,
  }
  try {
    const common = new Common({ chain, hardfork })
    const body = RLP.decode(bodyRlp) as unknown
    if (!Array.isArray(body) || !Array.isArray(body[0])) return out
    for (const raw of body[0]) {
      try {
        const tx = createTxFromBlockBodyData(raw as Uint8Array | Uint8Array[], { common })
        out.txCount += 1
        bumpTxType(out.txTypeSplit, tx.type)
        const value = tx.value
        out.ethTransferredWei += value
        if (value > out.largestTransferWei) {
          out.largestTransferWei = value
          const to = 'to' in tx && tx.to !== undefined ? tx.to : undefined
          out.largestTransferTo = to !== undefined ? to.toString() : undefined
        }
      } catch {
        out.txTypeSplit.other += 1
        out.txCount += 1
      }
    }
  } catch {
    // header-only path may omit body
  }
  return out
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
  try {
    const common = new Common({ chain: input.chain, hardfork: input.hardfork })
    const raw = RLP.decode(input.headerRlp) as never
    const header = createBlockHeaderFromBytesArray(raw, {
      common,
      skipConsensusFormatValidation: true,
    })
    if (header.number !== input.blockNumber) {
      // still use provided block number for ring ordering
    }
    if (header.baseFeePerGas !== undefined) {
      base.baseFeeWei = header.baseFeePerGas
    }
    if (header.gasLimit > 0n) {
      base.gasFullPct = Number((header.gasUsed * 100n) / header.gasLimit)
    }
    if (header.blobGasUsed !== undefined) {
      base.blobGasUsed = header.blobGasUsed
    }
  } catch {
    return base
  }

  if (input.bodyRlp !== undefined) {
    base.hasTxBody = true
    const body = parseBodyTxs(input.bodyRlp, input.chain, input.hardfork)
    base.txCount = body.txCount
    base.ethTransferredWei = body.ethTransferredWei
    base.txTypeSplit = body.txTypeSplit
    base.largestTransferWei = body.largestTransferWei
    base.largestTransferTo = body.largestTransferTo
    if (input.receiptsEth69Rlp !== undefined && body.txCount > 0) {
      const rc = countReceipts(input.receiptsEth69Rlp, body.txCount)
      base.receiptSuccess = rc.success
      base.receiptReverts = rc.reverts
    }
  }

  const bal = resolveBalJson(
    input.headerRlp,
    input.balJson,
    input.balRlp,
    input.chain,
    input.hardfork,
  )
  if (bal !== undefined) {
    const heat = contractContributionsFromBal(bal)
    base.activeAccounts = heat.activeAccounts
    base.storageWrites = heat.storageWrites
    base.storageReads = heat.storageReads
    base.newDeployments = heat.newDeployments
    base.contractContributions = heat.contributions
  }

  return base
}
