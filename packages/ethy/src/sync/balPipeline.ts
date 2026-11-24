import { highestEthVersion } from '../net/pivotHeader.ts'
import type { EthySpine } from '../spine/types.ts'
import { BAL_BATCH_MIN_GAP, SERVING_TAIL_BLOCKS } from './balBatch.ts'

export const MAX_READY_BAL_BATCHES = 8
export const MAX_CONCURRENT_BAL_FLIGHTS = 6
export const MAX_FLIGHTS_PER_PEER = 2
export const BAL_HEADER_PREFETCH_COUNT = 192
export const BAL_HEADER_QUEUE_TARGET = 256

export function maxConcurrentBalFlights(healthyPeerCount: number): number {
  return Math.min(Math.max(1, healthyPeerCount) * MAX_FLIGHTS_PER_PEER, MAX_CONCURRENT_BAL_FLIGHTS)
}

export function countHealthyBalCatchUpPeers(
  spine: EthySpine,
  peerRestUntil: ReadonlyMap<string, number>,
  now = Date.now(),
): number {
  let bal71 = 0
  let eth69 = 0
  for (const p of spine.peers.values()) {
    if (p.hasHead !== true || p.latestBlock === undefined) continue
    const restUntil = peerRestUntil.get(p.id)
    if (restUntil !== undefined && restUntil > now) continue
    const ver = highestEthVersion(p.caps)
    if (ver >= 71) bal71 += 1
    else if (ver >= 69) eth69 += 1
  }
  return bal71 > 0 ? bal71 : eth69
}

/** Historical catch-up (not snap, not within 64-block serving tail, gap large enough). */
export function balPipelineActive(
  spinePhase: EthySpine['phase'],
  nextBlock: bigint,
  targetHead: bigint,
  gap: bigint,
): boolean {
  if (spinePhase === 'SNAP_SYNCING') return false
  if (gap < BAL_BATCH_MIN_GAP) return false
  const tailStart = targetHead > SERVING_TAIL_BLOCKS ? targetHead - SERVING_TAIL_BLOCKS + 1n : 0n
  return nextBlock < tailStart
}

type BlockRange = { lo: bigint; hi: bigint }

export function occupiedBalBlockRanges(
  inFlight: Iterable<{ startBlock: bigint; count: number }>,
  ready: Iterable<{ startBlock: bigint; blockCount: number }>,
  committing?: { startBlock: bigint; blockCount: number },
): BlockRange[] {
  const ranges: BlockRange[] = []
  for (const b of inFlight) {
    if (b.count <= 0) continue
    ranges.push({ lo: b.startBlock, hi: b.startBlock + BigInt(b.count) - 1n })
  }
  for (const r of ready) {
    if (r.blockCount <= 0) continue
    ranges.push({ lo: r.startBlock, hi: r.startBlock + BigInt(r.blockCount) - 1n })
  }
  if (committing !== undefined && committing.blockCount > 0) {
    ranges.push({
      lo: committing.startBlock,
      hi: committing.startBlock + BigInt(committing.blockCount) - 1n,
    })
  }
  return ranges
}

/** Next block number not covered by in-flight or ready batches (strict in-order commit anchor). */
export function nextBalFlightStartBlock(
  nextCommitBlock: bigint,
  targetHead: bigint,
  ranges: BlockRange[],
): bigint | undefined {
  if (nextCommitBlock > targetHead) return undefined
  let candidate = nextCommitBlock
  for (;;) {
    const hit = ranges.find((r) => candidate >= r.lo && candidate <= r.hi)
    if (hit === undefined) return candidate
    candidate = hit.hi + 1n
    if (candidate > targetHead) return undefined
  }
}

/** Highest block number currently buffered in `ready` (used to distinguish gap-fill from lookahead). */
export function highestReadyBlock(
  ready: Iterable<{ startBlock: bigint; blockCount: number }>,
): bigint | undefined {
  let max: bigint | undefined
  for (const r of ready) {
    if (r.blockCount <= 0) continue
    const end = r.startBlock + BigInt(r.blockCount) - 1n
    if (max === undefined || end > max) max = end
  }
  return max
}

/** Lowest occupied range start strictly greater than `afterBlock` (caps gap-fill width cleanly). */
export function nextOccupiedRangeStart(
  afterBlock: bigint,
  ranges: BlockRange[],
): bigint | undefined {
  let next: bigint | undefined
  for (const r of ranges) {
    if (r.lo > afterBlock && (next === undefined || r.lo < next)) {
      next = r.lo
    }
  }
  return next
}

export function rangeKey(startBlock: bigint): string {
  return startBlock.toString()
}
