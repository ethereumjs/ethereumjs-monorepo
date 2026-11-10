import { RLP } from '@ethereumjs/rlp'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToUnprefixedHex,
  setLengthLeft,
} from '@ethereumjs/util'

import type { PeerBookStore } from '../persist/peerBook.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import { enqueueProtocol } from '../runtime/lanes.ts'
import {
  bucketCursorsPendingVerify,
  bucketHasActiveRefreshCursors,
  bucketPosition36,
  compareBytes32,
  computeAccountRangeFraction,
  cursorActive,
  cursorBlockedForDispatch,
  cursorSpan36,
  ensureBucketSubRanges,
  snapBucketCursorExhausted,
  spineHasActiveRefreshCursors,
  syncBucketCursorFields,
} from '../spine/buckets.ts'
import { setPhase } from '../spine/createSpine.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine, SnapBucket, SnapRangeCursor } from '../spine/types.ts'
import type { SnapPeerFlightTracker } from './snapFlight.ts'
import type { SnapSchedulePeer } from './snapSchedulePolicy.ts'
import {
  isPeerQuarantineRangeFailure,
  maxInFlightForPeer,
  peerRestAfterTimeout,
  peerRestMsForRangeFailure,
  rangeTimeoutForPeer,
  rankSnapPeers,
  responseBytesForPeer,
} from './snapSchedulePolicy.ts'
import type { SnapTransport } from './snapTransport.ts'
import { snapReplyRequestId } from './snapVerifyJob.ts'
import { SnapVerifyPool } from './snapVerifyWorker.ts'
import {
  incrementKey32,
  ingestedMetaFromBinarySlab,
  peekAccountRangeLastKey,
} from './syntheticPeer.ts'

const STALL_BASE_MS = 2_000
const STALL_MAX_MS = 15_000
/** After this many seconds without new accounts, show 0/s in the TUI. */
const RATE_IDLE_SEC = 2
/** Refresh interval for the smoothed `/min` TUI rate so it stays steady. */
const MIN_RATE_REFRESH_MS = 5_000
/** Rolling window for the `/min` rate calculation. */
const MIN_RATE_WINDOW_MS = 60_000
/** Minimum spacing between rolling history samples. */
const MIN_RATE_SAMPLE_STEP_MS = 1_000
/** Minimum remaining span before bisecting a cursor (one sub-nibble, WP-04h). */
const MIN_SPLIT_SPAN = 0x1_0000_0000

export type InFlightRange = {
  peerId: string
  bucket: number
  cursorId: number
  reqId: bigint
  sentAt: number
  rootGeneration: number
  timeoutMs: number
  origin: Uint8Array
  limit: Uint8Array
  stateRoot: Uint8Array
  pivotBlockNumber: bigint
  /** Cursor origin before speculative peek advance (WP-06e). */
  priorOrigin?: Uint8Array
  /** Last key peeked from RLP before verify completed (WP-06e). */
  speculativeLastKey?: Uint8Array
}

function inFlightKey(peerId: string, reqId: bigint): string {
  return `${peerId}:${reqId.toString()}`
}

function originDedupeKey(bucketIndex: number, origin: Uint8Array): string {
  return `${bucketIndex}:${bytesToUnprefixedHex(origin)}`
}

function segmentJournalKey(origin: Uint8Array): string {
  return bytesToUnprefixedHex(origin).slice(0, 16)
}

export type IngestedAccountMeta = {
  accountHash: Uint8Array
  codeHash: Uint8Array
  storageRoot: Uint8Array
}

export type SnapAccountSynchronizerOpts = {
  spine: EthySpine
  stateManager: FlatStateManager
  transport: SnapTransport
  flightTracker: SnapPeerFlightTracker
  getSnapPeers: () => SnapSchedulePeer[]
  snapStore?: SnapPivotStore
  peerBook?: PeerBookStore
  verifyPool?: SnapVerifyPool
  onAccountsIngested?: (entries: IngestedAccountMeta[]) => void
  onSlabCommitted?: (flight: InFlightRange, lastKey: Uint8Array) => void
  onBucketDone?: (bucketIndex: number) => void
}

export class SnapAccountSynchronizer {
  private readonly spine: EthySpine
  private readonly stateManager: FlatStateManager
  private readonly transport: SnapTransport
  private readonly getSnapPeers: () => SnapSchedulePeer[]
  private readonly flightTracker: SnapPeerFlightTracker
  private readonly snapStore?: SnapPivotStore
  private readonly peerBook?: PeerBookStore
  private readonly verifyPool: SnapVerifyPool
  private readonly onAccountsIngested?: (entries: IngestedAccountMeta[]) => void
  private readonly onSlabCommitted?: (flight: InFlightRange, lastKey: Uint8Array) => void
  private readonly onBucketDone?: (bucketIndex: number) => void
  private reqId = 1n
  private nextCursorId = 256
  private inFlight = new Map<string, InFlightRange>()
  private inFlightOrigins = new Set<string>()
  private stallUntil = new Map<number, number>()
  private stallRepeats = new Map<number, number>()
  private unprovenTimeoutLogged = new Set<string>()
  private peerLeftRepeats = new Map<number, number>()
  private peerRestUntil = new Map<string, number>()
  private detachAccountRange?: () => void
  private tickTimer?: ReturnType<typeof setInterval>
  private syncStart = 0
  private lastAccountCount = 0
  private lastRateAt = 0
  private lastMinRateAt = 0
  private minRateSamples: Array<{ at: number; count: number; frac: number }> = []
  private peerRangeFailureStreak = new Map<string, number>()

  constructor(opts: SnapAccountSynchronizerOpts) {
    this.spine = opts.spine
    this.stateManager = opts.stateManager
    this.transport = opts.transport
    this.getSnapPeers = opts.getSnapPeers
    this.flightTracker = opts.flightTracker
    this.snapStore = opts.snapStore
    this.peerBook = opts.peerBook
    this.verifyPool = opts.verifyPool ?? new SnapVerifyPool({ inProcess: true })
    this.onAccountsIngested = opts.onAccountsIngested
    this.onSlabCommitted = opts.onSlabCommitted
    this.onBucketDone = opts.onBucketDone
  }

  /** One-account snap cursor after BAL touched storage/code during account sync (WP-04k). */
  enqueueAccountRefreshCursor(accountHash: Uint8Array): void {
    if (accountHash.length !== 32) return
    const bucketIndex = accountHash[0]! >> 4
    const bucket = this.spine.snapBuckets[bucketIndex]
    if (bucket === undefined) return
    const ranges = ensureBucketSubRanges(bucket)
    const key = bytesToUnprefixedHex(accountHash)
    if (ranges.some((c) => c.refresh && bytesToUnprefixedHex(c.origin) === key)) return
    const origin = new Uint8Array(accountHash)
    const limit = new Uint8Array(accountHash)
    ranges.push({
      id: this.nextCursorId++,
      bucketIndex,
      origin,
      limit,
      journal: `refresh-${key.slice(0, 16)}`,
      refresh: true,
    })
    bucket.subRanges = ranges
    if (bucket.status === 'pending') bucket.status = 'syncing'
    syncBucketCursorFields(bucket)
    this.schedule()
  }

  abortInFlight(): void {
    this.inFlight.clear()
    this.inFlightOrigins.clear()
    this.clearAllCursorFlightFlags()
    this.flightTracker.clearAll()
  }

  bumpRootGeneration(): number {
    this.inFlight.clear()
    this.inFlightOrigins.clear()
    this.clearAllCursorFlightFlags()
    return this.flightTracker.bumpGeneration()
  }

  peerBusy(peerId: string): boolean {
    return this.flightTracker.has(peerId)
  }

  start(): void {
    if (this.detachAccountRange !== undefined) return
    setPhase(this.spine, 'SNAP_SYNCING')
    this.syncStart = Date.now()
    this.lastRateAt = this.syncStart
    this.lastMinRateAt = this.syncStart
    this.lastAccountCount = this.spine.totalAccountsSynced
    this.minRateSamples = [
      {
        at: this.syncStart,
        count: this.spine.totalAccountsSynced,
        frac: computeAccountRangeFraction(this.spine.snapBuckets),
      },
    ]
    for (const bucket of this.spine.snapBuckets) {
      ensureBucketSubRanges(bucket)
    }
    this.detachAccountRange = this.transport.onAccountRange((peerId, payload) => {
      void this.handleAccountRange(peerId, payload)
    })
    this.tickTimer = setInterval(() => this.schedule(), 50)
    this.tickTimer.unref?.()
    this.schedule()
  }

  stop(): void {
    this.detachAccountRange?.()
    this.detachAccountRange = undefined
    if (this.tickTimer !== undefined) clearInterval(this.tickTimer)
    this.snapStore?.flushAll(this.spine.snapBuckets)
  }

  private clearAllCursorFlightFlags(): void {
    for (const bucket of this.spine.snapBuckets) {
      const ranges = bucket.subRanges
      if (ranges === undefined) continue
      for (const c of ranges) {
        c.inFlightReqKey = undefined
        c.verifyingCount = 0
        c.pipelinedVerify = false
      }
    }
  }

  private findCursor(bucketIndex: number, cursorId: number): SnapRangeCursor | undefined {
    const bucket = this.spine.snapBuckets[bucketIndex]
    if (bucket === undefined) return undefined
    return ensureBucketSubRanges(bucket).find((c) => c.id === cursorId)
  }

  private bucketStalled(bucket: SnapBucket, now: number): boolean {
    return bucket.status === 'stalled' && now < (this.stallUntil.get(bucket.index) ?? 0)
  }

  private allCursorsBusy(): boolean {
    for (const bucket of this.spine.snapBuckets) {
      const hasRefresh = bucketHasActiveRefreshCursors(bucket)
      if (bucket.status === 'done' && !hasRefresh) continue
      if (this.bucketStalled(bucket, Date.now())) continue
      for (const c of ensureBucketSubRanges(bucket)) {
        if (!cursorActive(c)) continue
        if (!cursorBlockedForDispatch(c)) {
          return false
        }
      }
    }
    return true
  }

  private listFreeCursors(now: number): SnapRangeCursor[] {
    const out: SnapRangeCursor[] = []
    for (const bucket of this.spine.snapBuckets) {
      const hasRefresh = bucketHasActiveRefreshCursors(bucket)
      if (bucket.status === 'done' && !hasRefresh) continue
      if (this.bucketStalled(bucket, now)) continue
      for (const c of ensureBucketSubRanges(bucket)) {
        if (bucket.status === 'done' && c.refresh !== true) continue
        if (!cursorActive(c)) continue
        if (cursorBlockedForDispatch(c)) continue
        const dedupe = originDedupeKey(bucket.index, c.origin)
        if (this.inFlightOrigins.has(dedupe)) continue
        out.push(c)
      }
    }
    out.sort((a, b) => {
      if (a.bucketIndex !== b.bucketIndex) return a.bucketIndex - b.bucketIndex
      return compareBytes32(a.origin, b.origin)
    })
    return out
  }

  private splitWidestSubRange(): SnapRangeCursor | undefined {
    let best: SnapRangeCursor | undefined
    let bestSpan = MIN_SPLIT_SPAN - 1
    let bestBucket: SnapBucket | undefined
    let bestIndex = -1
    for (const bucket of this.spine.snapBuckets) {
      if (bucket.status === 'done') continue
      const ranges = ensureBucketSubRanges(bucket)
      for (let i = 0; i < ranges.length; i++) {
        const c = ranges[i]!
        if (c.refresh === true) continue
        if (!cursorActive(c)) continue
        if ((c.verifyingCount ?? 0) > 0) continue
        const span = cursorSpan36(c)
        if (span >= MIN_SPLIT_SPAN && span > bestSpan) {
          bestSpan = span
          best = c
          bestBucket = bucket
          bestIndex = i
        }
      }
    }
    if (best === undefined || bestBucket === undefined || bestIndex < 0) return undefined
    const mid = midpointKey32(best.origin, best.limit)
    const oldLimit = new Uint8Array(best.limit)
    best.limit = new Uint8Array(mid)
    const rightOrigin = incrementKey32(mid)
    const right: SnapRangeCursor = {
      id: this.nextCursorId++,
      bucketIndex: best.bucketIndex,
      origin: rightOrigin,
      limit: oldLimit,
      journal: segmentJournalKey(rightOrigin),
    }
    bestBucket.subRanges!.splice(bestIndex + 1, 0, right)
    return right
  }

  private refreshBucketSyncStatus(bucket: SnapBucket): void {
    if (
      snapBucketCursorExhausted(bucket) &&
      !bucketCursorsPendingVerify(bucket) &&
      !this.bucketHasOpenFlight(bucket.index)
    ) {
      syncBucketCursorFields(bucket)
      return
    }
    if (bucket.status === 'done' && bucketHasActiveRefreshCursors(bucket)) {
      return
    }
    const ranges = ensureBucketSubRanges(bucket)
    const busy = ranges.some(
      (c) => c.refresh !== true && (c.inFlightReqKey !== undefined || (c.verifyingCount ?? 0) > 0),
    )
    if (busy) {
      bucket.status = 'syncing'
    } else if (bucket.status !== 'stalled' && bucket.status !== 'done') {
      bucket.status = 'pending'
    }
  }

  private dispatchCursor(peer: SnapSchedulePeer, cursor: SnapRangeCursor, now: number): boolean {
    const bucket = this.spine.snapBuckets[cursor.bucketIndex]
    if (bucket === undefined) return false
    const dedupe = originDedupeKey(cursor.bucketIndex, cursor.origin)
    if (this.inFlightOrigins.has(dedupe)) return false
    const reqId = this.reqId++
    const maxInFlight = maxInFlightForPeer(peer)
    if (
      !this.flightTracker.tryClaim(peer.id, { kind: 'account', reqId, sentAt: now }, maxInFlight)
    ) {
      return false
    }
    const sentOrigin = new Uint8Array(cursor.origin)
    const sentLimit = new Uint8Array(cursor.limit)
    const reqKey = inFlightKey(peer.id, reqId)
    cursor.inFlightReqKey = reqKey
    this.inFlightOrigins.add(dedupe)
    this.inFlight.set(reqKey, {
      peerId: peer.id,
      bucket: cursor.bucketIndex,
      cursorId: cursor.id,
      reqId,
      sentAt: now,
      rootGeneration: this.flightTracker.rootGeneration,
      timeoutMs: rangeTimeoutForPeer(peer),
      origin: sentOrigin,
      limit: sentLimit,
      stateRoot: new Uint8Array(this.spine.pivotStateRoot!),
      pivotBlockNumber: this.spine.pivotBlockNumber ?? 0n,
    })
    if (cursor.refresh !== true) {
      bucket.status = 'syncing'
      bucket.assignedPeerId = peer.id
    }
    const row = this.spine.peers.get(peer.id)
    if (row !== undefined) row.snapRequestsSent++
    const payload = encodeGetAccountRange(
      reqId,
      this.spine.pivotStateRoot!,
      sentOrigin,
      sentLimit,
      responseBytesForPeer(peer),
    )
    this.transport.sendAccountRange(peer.id, payload)
    return true
  }

  private fillPeerSlots(peers: SnapSchedulePeer[], now: number): void {
    for (const bucket of this.spine.snapBuckets) {
      ensureBucketSubRanges(bucket)
      if (snapBucketCursorExhausted(bucket)) {
        syncBucketCursorFields(bucket)
      }
    }
    const free = () => this.listFreeCursors(now)
    const pivotBlock = this.spine.pivotBlockNumber ?? 0n
    for (const peer of peers) {
      if (now < (this.peerRestUntil.get(peer.id) ?? 0)) continue
      // Only skip a brand-new unproven peer whose initial STATUS block is far (>32 blocks) behind our pivot;
      // proven peers or peers within the 32-block BLOCK_RANGE_UPDATE interval are already at head!
      if (
        peer.snapResponsesOk === 0 &&
        peer.latestBlock !== undefined &&
        peer.latestBlock > 0n &&
        peer.latestBlock + 32n < pivotBlock
      ) {
        continue
      }
      const maxInFlight = maxInFlightForPeer(peer)
      while (this.flightTracker.inFlightCount(peer.id) < maxInFlight) {
        let cursor: SnapRangeCursor | undefined = free()[0]
        const canSplit =
          peer.snapResponsesOk >= 2 || this.flightTracker.inFlightCount(peer.id) === 0
        if (cursor === undefined && canSplit && this.allCursorsBusy()) {
          cursor = this.splitWidestSubRange()
        }
        if (cursor === undefined) break
        if (!this.dispatchCursor(peer, cursor, now)) break
      }
    }
  }

  private schedule(): void {
    if (
      this.spine.snapPaused ||
      this.spine.pivotBridging !== undefined ||
      this.spine.pivotStateRoot === undefined
    ) {
      return
    }
    const now = Date.now()
    this.refreshAccountRate(now)
    if (
      this.spine.snapBuckets.length > 0 &&
      this.spine.snapBuckets.every((b) => b.status === 'done') &&
      !spineHasActiveRefreshCursors(this.spine.snapBuckets)
    ) {
      this.spine.accountsPerSec = 0
      this.spine.accountsPerMin = 0
      this.spine.snapEtaMinutes = undefined
      return
    }
    const peers = rankSnapPeers(
      this.getSnapPeers().filter((p) => p.caps.some((c) => c.startsWith('snap'))),
    )
    this.expireStaleRanges(new Set(peers.map((p) => p.id)), now)
    let resting = 0
    for (const peer of peers) {
      if (now < (this.peerRestUntil.get(peer.id) ?? 0)) resting++
    }
    this.spine.snapPeersResting = resting
    if (peers.length === 0) return
    this.fillPeerSlots(peers, now)
  }

  private clearCursorFlight(cursor: SnapRangeCursor | undefined): void {
    if (cursor === undefined) return
    cursor.inFlightReqKey = undefined
    cursor.verifyingCount = 0
    cursor.pipelinedVerify = false
    const dedupe = originDedupeKey(cursor.bucketIndex, cursor.origin)
    this.inFlightOrigins.delete(dedupe)
  }

  private bucketHasOpenFlight(bucketIndex: number): boolean {
    for (const flight of this.inFlight.values()) {
      if (flight.bucket === bucketIndex) return true
    }
    return false
  }

  private beginCursorVerify(cursor: SnapRangeCursor, pipelined: boolean): void {
    cursor.verifyingCount = (cursor.verifyingCount ?? 0) + 1
    if (pipelined) {
      cursor.pipelinedVerify = true
    }
  }

  private endCursorVerify(cursor: SnapRangeCursor | undefined): void {
    if (cursor === undefined) return
    const next = (cursor.verifyingCount ?? 1) - 1
    cursor.verifyingCount = next > 0 ? next : 0
    if (cursor.verifyingCount === 0) {
      cursor.pipelinedVerify = false
    }
  }

  private cancelSuccessorFlights(cursorId: number, bucketIndex: number, keepReqId: bigint): void {
    for (const [key, flight] of [...this.inFlight.entries()]) {
      if (flight.cursorId !== cursorId || flight.bucket !== bucketIndex) continue
      if (flight.reqId === keepReqId) continue
      this.inFlight.delete(key)
      this.flightTracker.release(flight.peerId, flight.reqId)
      this.inFlightOrigins.delete(originDedupeKey(flight.bucket, flight.origin))
      const cursor = this.findCursor(flight.bucket, flight.cursorId)
      if (cursor !== undefined && cursor.inFlightReqKey === key) {
        cursor.inFlightReqKey = undefined
      }
    }
  }

  private expireStaleRanges(livePeerIds: ReadonlySet<string>, now: number): void {
    for (const [key, flight] of this.inFlight) {
      const left = !livePeerIds.has(flight.peerId) && !this.spine.peers.has(flight.peerId)
      if (!left && now - flight.sentAt < flight.timeoutMs) continue
      this.inFlight.delete(key)
      this.flightTracker.release(flight.peerId, flight.reqId)
      this.inFlightOrigins.delete(originDedupeKey(flight.bucket, flight.origin))
      const cursor = this.findCursor(flight.bucket, flight.cursorId)
      if (cursor !== undefined) {
        if (cursor.inFlightReqKey === key) {
          cursor.inFlightReqKey = undefined
        }
        if ((cursor.verifyingCount ?? 0) === 0) {
          cursor.pipelinedVerify = false
        }
      }
      const bucket = this.spine.snapBuckets[flight.bucket]
      if (bucket === undefined || bucket.status === 'done') continue
      if (left) {
        bucket.lastStallReason = 'snap peer left'
        const repeats = (this.peerLeftRepeats.get(bucket.index) ?? 0) + 1
        this.peerLeftRepeats.set(bucket.index, repeats)
        if (repeats === 1 || repeats % 5 === 0) {
          const times = repeats > 1 ? ` (×${repeats})` : ''
          recordDiagnostic(this.spine, {
            subsystem: 'snap',
            severity: 'warn',
            peerId: flight.peerId,
            bucketIndex: bucket.index,
            message: `Bucket ${bucket.prefix}: snap peer left${times}`,
          })
        }
        this.refreshBucketSyncStatus(bucket)
        continue
      }
      const peerRow = this.spine.peers.get(flight.peerId)
      const schedulePeer: SnapSchedulePeer = {
        id: flight.peerId,
        caps: peerRow?.caps ?? [],
        snapResponsesOk: peerRow?.snapResponsesOk ?? 0,
        snapTimeouts: peerRow?.snapTimeouts ?? 0,
        avgLatencyMs: peerRow?.avgLatencyMs ?? 0,
      }
      const alternate = this.hasHealthyAlternatePeer(flight.peerId, now)
      if (schedulePeer.snapResponsesOk === 0 || alternate) {
        this.peerRestUntil.set(flight.peerId, now + peerRestAfterTimeout(schedulePeer))
      }
      if (schedulePeer.snapResponsesOk === 0 && !this.unprovenTimeoutLogged.has(flight.peerId)) {
        this.unprovenTimeoutLogged.add(flight.peerId)
        recordDiagnostic(this.spine, {
          subsystem: 'snap',
          severity: 'warn',
          peerId: flight.peerId,
          bucketIndex: flight.bucket,
          message: 'Account range timed out before any snap response (peer resting)',
        })
      }
      if (peerRow !== undefined) peerRow.snapTimeouts++
      this.peerBook?.noteSnapTimeout(flight.peerId)
      this.noteRangeFailure(bucket, flight.peerId, 'account range timed out')
      this.refreshBucketSyncStatus(bucket)
    }
  }

  private hasHealthyAlternatePeer(excludeId: string, now: number): boolean {
    for (const p of this.getSnapPeers().filter((x) => x.caps.some((c) => c.startsWith('snap')))) {
      if (p.id === excludeId) continue
      if ((p.snapResponsesOk ?? 0) === 0) continue
      if (now < (this.peerRestUntil.get(p.id) ?? 0)) continue
      return true
    }
    return false
  }

  private noteRangeFailure(bucket: SnapBucket, peerId: string, reason: string): void {
    const now = Date.now()
    const peerRow = this.spine.peers.get(peerId)
    const schedulePeer: SnapSchedulePeer = {
      id: peerId,
      caps: peerRow?.caps ?? [],
      snapResponsesOk: peerRow?.snapResponsesOk ?? 0,
      snapTimeouts: peerRow?.snapTimeouts ?? 0,
      avgLatencyMs: peerRow?.avgLatencyMs ?? 0,
    }
    const quarantine = isPeerQuarantineRangeFailure(reason)
    const streak = quarantine ? (this.peerRangeFailureStreak.get(peerId) ?? 0) + 1 : 0
    if (quarantine) this.peerRangeFailureStreak.set(peerId, streak)
    const alternate = this.hasHealthyAlternatePeer(peerId, now)
    const restMs = peerRestMsForRangeFailure(reason, schedulePeer, streak)
    if (restMs !== undefined && (schedulePeer.snapResponsesOk === 0 || alternate || streak >= 3)) {
      this.peerRestUntil.set(peerId, now + restMs)
    }
    if (quarantine) {
      if (peerRow !== undefined) peerRow.snapTimeouts++
      this.peerBook?.noteSnapTimeout(peerId)
    }
    if (schedulePeer.snapResponsesOk === 0) {
      bucket.status = 'pending'
      bucket.assignedPeerId = undefined
      bucket.lastStallReason = reason
      return
    }
    if ((quarantine || reason.includes('account range timed out')) && alternate) {
      bucket.status = 'pending'
      bucket.assignedPeerId = undefined
      bucket.lastStallReason = reason
      return
    }
    const otherCursorActive = ensureBucketSubRanges(bucket).some(
      (c) => c.inFlightReqKey !== undefined || (c.verifyingCount ?? 0) > 0,
    )
    if (otherCursorActive) {
      bucket.lastStallReason = reason
      return
    }
    const repeats = (this.stallRepeats.get(bucket.index) ?? 0) + 1
    this.stallRepeats.set(bucket.index, repeats)
    const peerRangeMismatch =
      reason.includes('firstKey should be less than lastKey') ||
      reason.includes('peer returned accounts below request origin') ||
      reason.includes('empty account range without proof')
    const delay = peerRangeMismatch
      ? 500
      : Math.min(STALL_MAX_MS, STALL_BASE_MS * 2 ** Math.min(repeats - 1, 3))
    this.stallUntil.set(bucket.index, now + delay)
    bucket.status = 'stalled'
    bucket.lastStallReason = reason
    if (repeats === 1 || repeats % 5 === 0) {
      const times = repeats > 1 ? ` (×${repeats})` : ''
      recordDiagnostic(this.spine, {
        subsystem: 'snap',
        severity: 'warn',
        peerId,
        bucketIndex: bucket.index,
        message: `Bucket ${bucket.prefix}: ${reason}${times}`,
      })
    }
  }

  private async handleAccountRange(peerId: string, payload: Uint8Array): Promise<void> {
    const replyId = accountRangeRequestId(payload)
    if (replyId === undefined || this.spine.pivotStateRoot === undefined) return
    const key = inFlightKey(peerId, replyId)
    const flight = this.inFlight.get(key)
    if (flight === undefined) return
    if (flight.rootGeneration !== this.flightTracker.rootGeneration) {
      this.inFlight.delete(key)
      this.flightTracker.release(peerId, replyId)
      return
    }
    const cursor = this.findCursor(flight.bucket, flight.cursorId)
    if (cursor !== undefined) {
      flight.priorOrigin = new Uint8Array(cursor.origin)
    }
    const peek = peekAccountRangeLastKey(payload)
    let pipelined = false
    if (cursor !== undefined && peek !== undefined) {
      if (
        compareBytes32(peek.lastKey, flight.origin) >= 0 &&
        compareBytes32(peek.lastKey, cursor.limit) < 0
      ) {
        flight.speculativeLastKey = new Uint8Array(peek.lastKey)
        cursor.origin = incrementKey32(peek.lastKey)
        pipelined = true
        cursor.inFlightReqKey = undefined
        this.inFlightOrigins.delete(
          originDedupeKey(flight.bucket, flight.priorOrigin ?? flight.origin),
        )
        this.inFlightOrigins.add(originDedupeKey(flight.bucket, cursor.origin))
      }
    }
    if (cursor !== undefined) {
      this.beginCursorVerify(cursor, pipelined)
      if (!pipelined) {
        cursor.inFlightReqKey = undefined
      }
    }
    this.inFlight.delete(key)
    if (!pipelined) {
      this.inFlightOrigins.delete(originDedupeKey(flight.bucket, flight.origin))
    }
    this.flightTracker.release(peerId, replyId)
    const bucket = this.spine.snapBuckets[flight.bucket]
    if (bucket === undefined) {
      this.endCursorVerify(cursor)
      return
    }
    if (
      (cursor === undefined || !pipelined) &&
      cursor?.refresh !== true &&
      bucket.status !== 'done'
    ) {
      bucket.status = 'verifying_proof'
    }
    this.schedule()

    let result: Awaited<ReturnType<SnapVerifyPool['verifyAccountRange']>>
    try {
      result = await this.verifyPool.verifyAccountRange({
        stateRoot: flight.stateRoot,
        origin: flight.origin,
        payload,
      })
    } catch (err: unknown) {
      result = {
        ok: false,
        hasRight: false,
        count: 0,
        reason: err instanceof Error ? err.message : String(err),
      }
    }

    await new Promise<void>((resolve) => {
      enqueueProtocol(() => {
        try {
          this.commitVerifiedAccountRange(peerId, flight, bucket, cursor, result)
        } finally {
          resolve()
        }
      })
    })
  }

  private commitVerifiedAccountRange(
    peerId: string,
    flight: InFlightRange,
    bucket: SnapBucket,
    cursor: SnapRangeCursor | undefined,
    result: Awaited<ReturnType<SnapVerifyPool['verifyAccountRange']>>,
  ): void {
    if (flight.rootGeneration !== this.flightTracker.rootGeneration) {
      this.endCursorVerify(cursor)
      cursor && (cursor.inFlightReqKey = undefined)
      this.refreshBucketSyncStatus(bucket)
      return
    }
    const clipLimit =
      cursor !== undefined
        ? compareBytes32(flight.limit, cursor.limit) <= 0
          ? flight.limit
          : cursor.limit
        : flight.limit

    if (!result.ok) {
      this.cancelSuccessorFlights(flight.cursorId, flight.bucket, flight.reqId)
      if (cursor?.refresh === true) {
        this.inFlightOrigins.delete(originDedupeKey(flight.bucket, cursor.origin))
        this.inFlightOrigins.delete(originDedupeKey(flight.bucket, flight.origin))
        this.endCursorVerify(cursor)
        this.removeCursor(bucket, cursor.id)
        this.refreshBucketSyncStatus(bucket)
        this.schedule()
        return
      }
      if (cursor !== undefined && flight.priorOrigin !== undefined) {
        this.inFlightOrigins.delete(originDedupeKey(flight.bucket, cursor.origin))
        this.inFlightOrigins.delete(originDedupeKey(flight.bucket, flight.priorOrigin))
        cursor.origin = new Uint8Array(flight.priorOrigin)
        cursor.inFlightReqKey = undefined
        cursor.pipelinedVerify = false
      } else {
        this.inFlightOrigins.delete(originDedupeKey(flight.bucket, flight.origin))
      }
      this.endCursorVerify(cursor)
      this.noteRangeFailure(bucket, peerId, result.reason ?? 'range proof failed')
      this.refreshBucketSyncStatus(bucket)
      this.schedule()
      return
    }

    this.inFlightOrigins.delete(originDedupeKey(flight.bucket, flight.origin))

    this.stallRepeats.delete(bucket.index)
    this.stallUntil.delete(bucket.index)
    this.peerLeftRepeats.delete(bucket.index)
    const row = this.spine.peers.get(peerId)
    if (row !== undefined && result.count > 0) {
      row.snapResponsesOk++
      this.peerRangeFailureStreak.delete(peerId)
    }
    if (result.count > 0 && bucket.accountsLoaded === 0) {
      recordDiagnostic(this.spine, {
        subsystem: 'snap',
        severity: 'info',
        peerId,
        bucketIndex: bucket.index,
        message: `Bucket ${bucket.prefix} accepted ${result.count} accounts`,
      })
    }

    let persistSlab: Uint8Array | undefined
    if (result.slab !== undefined && result.count > 0) {
      persistSlab = filterAccountSlabWithin(result.slab, flight.origin, clipLimit)
      if (persistSlab.length > 0) {
        this.stateManager.putSnapBinaryAccountsFromSlab(persistSlab)
      }
    }
    const isRefresh = cursor?.refresh === true
    const acceptedCount = persistSlab !== undefined ? persistSlab.length / 136 : result.count
    if (acceptedCount > 0) {
      if (!isRefresh) {
        bucket.accountsLoaded += acceptedCount
        this.spine.totalAccountsSynced += acceptedCount
      }
      this.updateRate()
      this.peerBook?.noteSnapSuccess(peerId, Date.now())
      if (persistSlab !== undefined && persistSlab.length > 0) {
        if (!isRefresh) {
          const proof =
            result.proofNodes !== undefined &&
            result.rangeOrigin !== undefined &&
            result.lastKey instanceof Uint8Array
              ? {
                  slabByteOffset: 0,
                  slabByteLength: persistSlab.length,
                  originHash: result.rangeOrigin,
                  lastHash: result.lastKey,
                  hasRight: result.hasRight ? 1 : 0,
                  chunkStateRoot: flight.stateRoot,
                  chunkBlockNumber: flight.pivotBlockNumber,
                  proofNodes: result.proofNodes,
                }
              : undefined
          void this.snapStore?.appendVerifiedSlabAsync(
            flight.bucket,
            persistSlab,
            this.spine.snapBuckets,
            cursor?.journal ?? 'prefix',
            proof,
          )
        }
        this.onAccountsIngested?.(ingestedMetaFromBinarySlab(persistSlab))
      }
      if (result.hasRight && result.lastKey instanceof Uint8Array) {
        this.onSlabCommitted?.(flight, result.lastKey)
      }
    } else if (result.count === 0) {
      this.snapStore?.maybeFlushMetadata(true)
    }

    if (cursor !== undefined) {
      if (flight.speculativeLastKey !== undefined) {
        this.inFlightOrigins.delete(
          originDedupeKey(flight.bucket, incrementKey32(flight.speculativeLastKey)),
        )
      }
      this.reconcileCursorAfterCommit(cursor, bucket, flight, result)
      this.endCursorVerify(cursor)
    }
    const wasDone = bucket.status === 'done'
    syncBucketCursorFields(bucket)
    this.refreshBucketSyncStatus(bucket)
    if (bucket.status === 'done' && !wasDone) {
      this.snapStore?.flushBuckets(this.spine.snapBuckets)
      this.onBucketDone?.(bucket.index)
    }
    this.schedule()
  }

  private reconcileCursorAfterCommit(
    cursor: SnapRangeCursor,
    bucket: SnapBucket,
    flight: InFlightRange,
    result: Awaited<ReturnType<SnapVerifyPool['verifyAccountRange']>>,
  ): void {
    const hasSuccessor = [...this.inFlight.values()].some(
      (f) => f.cursorId === cursor.id && f.bucket === flight.bucket && f.reqId !== flight.reqId,
    )
    if (!(result.hasRight && result.lastKey instanceof Uint8Array)) {
      if (!hasSuccessor) {
        this.removeCursor(bucket, cursor.id)
      }
      return
    }
    const verifiedLast = result.lastKey
    const speculative = flight.speculativeLastKey
    if (speculative !== undefined) {
      const cmpSpec = compareBytes32(verifiedLast, speculative)
      if (cmpSpec === 0) {
        // origin already at incrementKey32(speculative) from peek
      } else if (cmpSpec < 0) {
        if (hasSuccessor) {
          this.insertRepairCursor(bucket, incrementKey32(verifiedLast), new Uint8Array(speculative))
        } else if (compareBytes32(verifiedLast, flight.origin) >= 0) {
          cursor.origin = incrementKey32(verifiedLast)
        }
      } else if (!hasSuccessor) {
        cursor.origin = incrementKey32(verifiedLast)
      }
    } else if (compareBytes32(verifiedLast, cursor.limit) >= 0) {
      if (!hasSuccessor) {
        this.removeCursor(bucket, cursor.id)
      }
      return
    } else if (compareBytes32(verifiedLast, flight.origin) >= 0) {
      cursor.origin = incrementKey32(verifiedLast)
    } else if (compareBytes32(cursor.origin, cursor.limit) > 0) {
      // If an earlier reply's lastKey was below a tightened split limit, keep the cursor alive from flight.origin
    }
    if (!cursorActive(cursor) && !hasSuccessor) {
      this.removeCursor(bucket, cursor.id)
    }
  }

  private insertRepairCursor(bucket: SnapBucket, origin: Uint8Array, limit: Uint8Array): void {
    if (compareBytes32(origin, limit) > 0) return
    const ranges = ensureBucketSubRanges(bucket)
    ranges.push({
      id: this.nextCursorId++,
      bucketIndex: bucket.index,
      origin: new Uint8Array(origin),
      limit: new Uint8Array(limit),
      journal: segmentJournalKey(origin),
    })
    bucket.subRanges = ranges
  }

  private removeCursor(bucket: SnapBucket, cursorId: number): void {
    const ranges = bucket.subRanges
    if (ranges === undefined) return
    bucket.subRanges = ranges.filter((c) => c.id !== cursorId)
  }

  private updateRate(): void {
    this.refreshAccountRate(Date.now())
  }

  /** Keep TUI speed honest when sync pauses; storage count stays on `totalAccountsSynced`. */
  private refreshAccountRate(now: number): void {
    const dt = (now - this.lastRateAt) / 1000
    if (dt >= RATE_IDLE_SEC) {
      const delta = this.spine.totalAccountsSynced - this.lastAccountCount
      this.spine.accountsPerSec = delta > 0 ? delta / dt : 0
      this.lastAccountCount = this.spine.totalAccountsSynced
      this.lastRateAt = now
    }
    const lastSample = this.minRateSamples[this.minRateSamples.length - 1]
    if (lastSample === undefined || now - lastSample.at >= MIN_RATE_SAMPLE_STEP_MS) {
      const frac = computeAccountRangeFraction(this.spine.snapBuckets)
      this.minRateSamples.push({ at: now, count: this.spine.totalAccountsSynced, frac })
      const cutoff = now - MIN_RATE_WINDOW_MS
      while (this.minRateSamples.length > 2 && this.minRateSamples[1]!.at <= cutoff) {
        this.minRateSamples.shift()
      }
    }
    if (now - this.lastMinRateAt >= MIN_RATE_REFRESH_MS) {
      const anchor = this.minRateSamples[0]
      if (anchor !== undefined && now > anchor.at) {
        const windowSec = (now - anchor.at) / 1000
        const windowDelta = this.spine.totalAccountsSynced - anchor.count
        const rawPerMin = windowDelta > 0 && windowSec > 0 ? (windowDelta / windowSec) * 60 : 0
        const prev = this.spine.accountsPerMin ?? 0
        const smoothedPerMin =
          rawPerMin <= 0 ? 0 : prev > 0 ? 0.65 * prev + 0.35 * rawPerMin : rawPerMin
        this.spine.accountsPerMin = smoothedPerMin

        const curFrac = computeAccountRangeFraction(this.spine.snapBuckets)
        const fracDelta = curFrac - anchor.frac
        if (curFrac >= 0.005 && curFrac < 1 && smoothedPerMin > 0) {
          // Because keccak256(address) is uniform across 0x00..0xff, range fraction f
          // directly predicts remaining accounts = totalAccountsSynced * (1 - f) / f!
          const remainingFromDensity = this.spine.totalAccountsSynced * ((1 - curFrac) / curFrac)
          const rawEtaMin =
            fracDelta > 0.0005 && windowSec >= 5
              ? (1 - curFrac) / (fracDelta / windowSec) / 60
              : remainingFromDensity / smoothedPerMin
          const prevEta = this.spine.snapEtaMinutes
          this.spine.snapEtaMinutes =
            prevEta !== undefined && prevEta > 0 ? 0.7 * prevEta + 0.3 * rawEtaMin : rawEtaMin
        } else if (curFrac >= 1 || smoothedPerMin <= 0) {
          this.spine.snapEtaMinutes = undefined
        }
      }
      this.lastMinRateAt = now
    }
  }
}

export function encodeGetAccountRange(
  reqId: bigint,
  rootHash: Uint8Array,
  origin: Uint8Array,
  limit: Uint8Array,
  responseBytes: number,
): Uint8Array {
  const input = [
    bigIntToUnpaddedBytes(reqId),
    setLengthLeft(rootHash, 32),
    setLengthLeft(origin, 32),
    setLengthLeft(limit, 32),
    bigIntToUnpaddedBytes(BigInt(responseBytes)),
  ]
  return RLP.encode(input as never)
}

function accountRangeRequestId(payload: Uint8Array): bigint | undefined {
  return snapReplyRequestId(payload)
}

const ACCOUNT_SLAB_STRIDE = 136

function filterAccountSlabWithin(
  slab: Uint8Array,
  origin: Uint8Array,
  limit: Uint8Array,
): Uint8Array {
  const rows: Uint8Array[] = []
  for (let offset = 0; offset + ACCOUNT_SLAB_STRIDE <= slab.length; offset += ACCOUNT_SLAB_STRIDE) {
    const hash = slab.subarray(offset, offset + 32)
    if (compareBytes32(hash, origin) >= 0 && compareBytes32(hash, limit) <= 0) {
      rows.push(slab.subarray(offset, offset + ACCOUNT_SLAB_STRIDE))
    }
  }
  if (rows.length === 0) return new Uint8Array(0)
  const out = new Uint8Array(rows.length * ACCOUNT_SLAB_STRIDE)
  let o = 0
  for (const row of rows) {
    out.set(row, o)
    o += ACCOUNT_SLAB_STRIDE
  }
  return out
}

function midpointKey32(lo: Uint8Array, hi: Uint8Array): Uint8Array {
  const a = bytesToBigInt(lo)
  const b = bytesToBigInt(hi)
  if (b <= a) return incrementKey32(lo)
  const mid = (a + b) / 2n
  if (mid <= a) return incrementKey32(lo)
  return setLengthLeft(bigIntToUnpaddedBytes(mid), 32)
}
