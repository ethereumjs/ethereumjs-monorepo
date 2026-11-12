import type { ChainConfig } from '@ethereumjs/common'
import {
  type BALJSONBlockAccessList,
  createBlockLevelAccessListFromRLP,
  equalsBytes,
} from '@ethereumjs/util'

import {
  EthMessageCodes,
  type ParsedBatchHeader,
  encodeGetBlockAccessListsBatchPayload,
  encodeGetBlockBodiesBatchPayload,
  encodeGetBlockHeadersRangePayload,
  encodeGetReceiptsBatchPayload,
  ethReplyRequestId,
  highestEthVersion,
  parseBlockAccessListsBatchPayload,
  parseBlockBodiesBatchPayload,
  parseBlockHeadersBatchPayload,
  parseBlockReceiptsBatchPayload,
  peerIdToBytes,
} from '../net/pivotHeader.ts'
import type { EthySpine, PeerTelemetry } from '../spine/types.ts'

export const BAL_BATCH_SIZE = 32
export const BAL_BATCH_MIN_GAP = 4n
export const SERVING_TAIL_BLOCKS = 64n
export const TAIL_BUNDLE_BATCH_SIZE = 8
export const BAL_BATCH_PEER_REST_MS = 15_000

export type BalBatchMode = 'fast' | 'full'

export type BalBatchStage = 'headers' | 'bodies' | 'receipts' | 'bal'

export type InFlightBalBatch = {
  peerId: string
  ethVersion: number
  startBlock: bigint
  count: number
  mode: BalBatchMode
  stage: BalBatchStage
  startedAt: number
  headerRequestId: number
  bodiesRequestId?: number
  receiptsRequestId?: number
  balRequestId?: number
  headers?: ParsedBatchHeader[]
  bodiesRlp?: Uint8Array[]
  receiptsEth69?: Uint8Array[]
  balRlp?: Uint8Array[]
}

export type VerifiedBalBatchBlock = {
  header: ParsedBatchHeader
  balRlp?: Uint8Array
  bodyRlp?: Uint8Array
  receiptsEth69Rlp?: Uint8Array
  balJson?: BALJSONBlockAccessList
}

export function pickBalCatchUpPeer(
  spine: EthySpine,
  peerRestUntil: ReadonlyMap<string, number>,
  minBlock?: bigint,
  now = Date.now(),
): { id: string; ethVersion: number; latestBlock: bigint } | undefined {
  let targetHead = 0n
  for (const p of spine.peers.values()) {
    if (p.hasHead !== true || p.latestBlock === undefined) continue
    if (p.latestBlock > targetHead) targetHead = p.latestBlock
  }
  if (targetHead === 0n) return undefined
  const filterCandidates = (minEthVersion: number, allowRollingEthy: boolean): PeerTelemetry[] => {
    const out: PeerTelemetry[] = []
    for (const p of spine.peers.values()) {
      if (p.hasHead !== true || p.latestBlock === undefined) continue
      if (highestEthVersion(p.caps) < minEthVersion) continue
      if (minBlock !== undefined && p.latestBlock < minBlock) continue
      if (
        !allowRollingEthy &&
        p.ethySession === true &&
        minBlock !== undefined &&
        minBlock + SERVING_TAIL_BLOCKS < p.latestBlock
      ) {
        continue
      }
      const rest = peerRestUntil.get(p.id)
      if (rest !== undefined && now < rest) continue
      out.push(p)
    }
    return out
  }
  let candidates = filterCandidates(71, false)
  if (candidates.length === 0) candidates = filterCandidates(71, true)
  if (candidates.length === 0) candidates = filterCandidates(69, false)
  if (candidates.length === 0) candidates = filterCandidates(69, true)
  if (candidates.length === 0) return undefined
  const effectiveRtt = (p: PeerTelemetry): number => (p.avgLatencyMs > 0 ? p.avgLatencyMs : 250)
  let best = candidates[0]!
  for (const p of candidates) {
    if (effectiveRtt(p) < effectiveRtt(best)) best = p
  }
  return {
    id: best.id,
    ethVersion: highestEthVersion(best.caps),
    latestBlock: targetHead,
  }
}

export function restBalCatchUpPeer(
  peerRestUntil: Map<string, number>,
  peerId: string,
  now = Date.now(),
) {
  peerRestUntil.set(peerId, now + BAL_BATCH_PEER_REST_MS)
}

/** Blocks still to download before `targetHead`. */
export function balGapBlocks(tip: bigint, targetHead: bigint): bigint {
  return targetHead > tip ? targetHead - tip : 0n
}

export function shouldUseBalBatch(gap: bigint): boolean {
  return gap >= BAL_BATCH_MIN_GAP
}

export function planBalBatch(
  nextBlock: bigint,
  targetHead: bigint,
  gap: bigint,
): { count: number; mode: BalBatchMode } | undefined {
  if (gap < BAL_BATCH_MIN_GAP) return undefined
  const tailStart = targetHead > SERVING_TAIL_BLOCKS ? targetHead - SERVING_TAIL_BLOCKS + 1n : 0n
  if (nextBlock >= tailStart) {
    const tailGap = targetHead >= nextBlock ? Number(targetHead - nextBlock + 1n) : 0
    const count = Math.min(TAIL_BUNDLE_BATCH_SIZE, tailGap, Number(gap))
    return count > 0 ? { count, mode: 'full' } : undefined
  }
  const histEnd = tailStart - 1n
  const maxHist = histEnd >= nextBlock ? Number(histEnd - nextBlock + 1n) : 0
  const count = Math.min(BAL_BATCH_SIZE, maxHist, Number(gap))
  return count > 0 ? { count, mode: 'fast' } : undefined
}

export function startBalBatch(
  sendEth: (peerId: string, code: number, payload: Uint8Array) => void,
  peerId: string,
  ethVersion: number,
  startBlock: bigint,
  count: number,
  mode: BalBatchMode,
): InFlightBalBatch {
  const headerRequestId = 1
  sendEth(
    peerId,
    EthMessageCodes.GET_BLOCK_HEADERS,
    encodeGetBlockHeadersRangePayload(ethVersion, startBlock, count, headerRequestId),
  )
  return {
    peerId,
    ethVersion,
    startBlock,
    count,
    mode,
    stage: 'headers',
    startedAt: Date.now(),
    headerRequestId,
  }
}

function requestIdMatches(
  ethVersion: number,
  payload: Uint8Array,
  expected: number | undefined,
): boolean {
  if (expected === undefined) return true
  const got = ethReplyRequestId(ethVersion, payload)
  return got === expected
}

export function advanceBalBatchEthMessage(
  chain: ChainConfig,
  batch: InFlightBalBatch,
  msg: { peerId: string; code: number; payload: Uint8Array },
  sendEth: (peerId: string, code: number, payload: Uint8Array) => void,
  priorTipHash?: Uint8Array,
): 'progress' | 'complete' | 'failed' | 'ignore' {
  if (msg.peerId !== batch.peerId) return 'ignore'
  if (msg.code === EthMessageCodes.BLOCK_HEADERS && batch.stage === 'headers') {
    if (!requestIdMatches(batch.ethVersion, msg.payload, batch.headerRequestId)) return 'ignore'
    const headers = parseBlockHeadersBatchPayload(
      batch.ethVersion,
      msg.payload,
      batch.startBlock,
      chain,
      priorTipHash,
    )
    if (headers === null || headers.length === 0) return 'failed'
    batch.headers = headers
    batch.count = headers.length
    if (batch.mode === 'fast') {
      const expectsBal = headers.some(
        (h) => h.blockAccessListHash !== undefined && h.blockAccessListHash.length > 0,
      )
      if (!expectsBal || batch.ethVersion < 71) {
        batch.balRlp = headers.map(() => new Uint8Array(0))
        return 'complete'
      }
      batch.stage = 'bal'
      batch.startedAt = Date.now()
      const balRequestId = 4
      batch.balRequestId = balRequestId
      const hashes = headers.map((h) => h.hash)
      sendEth(
        batch.peerId,
        EthMessageCodes.GET_BLOCK_ACCESS_LISTS,
        encodeGetBlockAccessListsBatchPayload(batch.ethVersion, hashes, balRequestId),
      )
      return 'progress'
    }
    batch.stage = 'bodies'
    batch.startedAt = Date.now()
    const bodiesRequestId = 2
    batch.bodiesRequestId = bodiesRequestId
    sendEth(
      batch.peerId,
      EthMessageCodes.GET_BLOCK_BODIES,
      encodeGetBlockBodiesBatchPayload(
        batch.ethVersion,
        headers.map((h) => h.hash),
        bodiesRequestId,
      ),
    )
    return 'progress'
  }
  if (msg.code === EthMessageCodes.BLOCK_BODIES && batch.stage === 'bodies') {
    if (!requestIdMatches(batch.ethVersion, msg.payload, batch.bodiesRequestId)) return 'ignore'
    const bodies = parseBlockBodiesBatchPayload(msg.payload)
    if (bodies === null || bodies.length === 0) return 'failed'
    batch.bodiesRlp = bodies
    batch.stage = 'receipts'
    batch.startedAt = Date.now()
    const receiptsRequestId = 3
    batch.receiptsRequestId = receiptsRequestId
    const hashes = batch.headers!.map((h) => h.hash)
    sendEth(
      batch.peerId,
      EthMessageCodes.GET_RECEIPTS,
      encodeGetReceiptsBatchPayload(batch.ethVersion, hashes, receiptsRequestId),
    )
    return 'progress'
  }
  if (msg.code === EthMessageCodes.RECEIPTS && batch.stage === 'receipts') {
    if (!requestIdMatches(batch.ethVersion, msg.payload, batch.receiptsRequestId)) return 'ignore'
    const receipts = parseBlockReceiptsBatchPayload(batch.ethVersion, msg.payload)
    if (receipts === null || receipts.length === 0) return 'failed'
    if (receipts.some((r) => r.lastBlockIncomplete)) return 'failed'
    batch.receiptsEth69 = receipts.map((r) => r.receiptsListRlp)
    const expectsBal = batch.headers!.some(
      (h) => h.blockAccessListHash !== undefined && h.blockAccessListHash.length > 0,
    )
    if (!expectsBal || batch.ethVersion < 71) {
      batch.balRlp = batch.headers!.map(() => new Uint8Array(0))
      return 'complete'
    }
    batch.stage = 'bal'
    batch.startedAt = Date.now()
    const balRequestId = 4
    batch.balRequestId = balRequestId
    sendEth(
      batch.peerId,
      EthMessageCodes.GET_BLOCK_ACCESS_LISTS,
      encodeGetBlockAccessListsBatchPayload(
        batch.ethVersion,
        batch.headers!.map((h) => h.hash),
        balRequestId,
      ),
    )
    return 'progress'
  }
  if (msg.code === EthMessageCodes.BLOCK_ACCESS_LISTS && batch.stage === 'bal') {
    if (!requestIdMatches(batch.ethVersion, msg.payload, batch.balRequestId)) return 'ignore'
    const lists = parseBlockAccessListsBatchPayload(msg.payload)
    if (lists === null) return 'failed'
    batch.balRlp = lists
    return 'complete'
  }
  return 'ignore'
}

export function materializeBalBatch(
  batch: InFlightBalBatch,
): { ok: true; blocks: VerifiedBalBatchBlock[] } | { ok: false; reason: string } {
  const headers = batch.headers
  if (headers === undefined || headers.length === 0) {
    return { ok: false, reason: 'missing headers' }
  }
  const balLists = batch.balRlp ?? []
  const m =
    batch.mode === 'full'
      ? Math.min(
          headers.length,
          balLists.length,
          batch.bodiesRlp?.length ?? 0,
          batch.receiptsEth69?.length ?? 0,
        )
      : Math.min(headers.length, balLists.length)
  if (m === 0) return { ok: false, reason: 'empty batch' }

  const blocks: VerifiedBalBatchBlock[] = []
  for (let i = 0; i < m; i++) {
    const header = headers[i]!
    const balRlp = balLists[i]
    if (balRlp === undefined || balRlp.length === 0) {
      if (header.blockAccessListHash !== undefined && header.blockAccessListHash.length > 0) {
        return { ok: false, reason: 'missing BAL' }
      }
      blocks.push({ header, balRlp: undefined })
      continue
    }
    const balHash = header.blockAccessListHash
    if (balHash === undefined || balHash.length === 0) {
      blocks.push({ header, balRlp })
      continue
    }
    const bal = createBlockLevelAccessListFromRLP(balRlp)
    if (!equalsBytes(bal.hash(), balHash)) {
      return { ok: false, reason: 'BAL hash mismatch' }
    }
    blocks.push({
      header,
      balRlp,
      bodyRlp: batch.bodiesRlp?.[i],
      receiptsEth69Rlp: batch.receiptsEth69?.[i],
      balJson: bal.toJSON(),
    })
  }
  return { ok: true, blocks }
}

export function sendBalBatchFromClient(
  client: { sendEthMessage: (peerId: Uint8Array, code: number, payload: Uint8Array) => void },
  batch: InFlightBalBatch,
): void {
  const peerBytes = peerIdToBytes(batch.peerId)
  if (batch.stage === 'headers') {
    client.sendEthMessage(
      peerBytes,
      EthMessageCodes.GET_BLOCK_HEADERS,
      encodeGetBlockHeadersRangePayload(
        batch.ethVersion,
        batch.startBlock,
        batch.count,
        batch.headerRequestId,
      ),
    )
  }
}
