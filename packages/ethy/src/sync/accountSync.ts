import { SnapMessageCodes } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import { bigIntToUnpaddedBytes, bytesToBigInt, setLengthLeft } from '@ethereumjs/util'

import type { PeerBookStore } from '../persist/peerBook.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import { enqueueProtocol } from '../runtime/lanes.ts'
import { bucketPosition36, compareBytes32, snapBucketCursorExhausted } from '../spine/buckets.ts'
import { setPhase } from '../spine/createSpine.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine, SnapBucket } from '../spine/types.ts'
import type { SnapPeerFlightTracker } from './snapFlight.ts'
import type { SnapSchedulePeer } from './snapSchedulePolicy.ts'
import {
  isPeerQuarantineRangeFailure,
  maxInFlightForPeer,
  peerRestAfterTimeout,
  peerRestMsForRangeFailure,
  rangeTimeoutForPeer,
  rankSnapPeers,
} from './snapSchedulePolicy.ts'
import type { SnapTransport } from './snapTransport.ts'
import { snapReplyRequestId } from './snapVerifyJob.ts'
import { SnapVerifyPool } from './snapVerifyWorker.ts'
import { incrementKey32, ingestedMetaFromBinarySlab } from './syntheticPeer.ts'

/**
 * Bytes we ask a peer to return. 512 KiB is about 8,000 accounts: public nodes
 * stall long enough to miss a ping, and the next request then piles on.
 */
const RESPONSE_BYTES = 128 * 1024
const STALL_BASE_MS = 2_000
const STALL_MAX_MS = 15_000
/** After this many seconds without new accounts, show 0/s in the TUI. */
const RATE_IDLE_SEC = 2

type InFlightRange = {
  peerId: string
  bucket: number
  reqId: bigint
  sentAt: number
  rootGeneration: number
  timeoutMs: number
  /** Tail work-steal from {@link stealMid} to bucket limit (WP-04f). */
  steal?: boolean
  stealMid?: Uint8Array
}

function inFlightKey(peerId: string, reqId: bigint): string {
  return `${peerId}:${reqId.toString()}`
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
  private reqId = 1n
  private inFlight = new Map<string, InFlightRange>()
  private stallUntil = new Map<number, number>()
  private stallRepeats = new Map<number, number>()
  private peerLeftRepeats = new Map<number, number>()
  private peerRestUntil = new Map<string, number>()
  /** Buckets whose reply is still in the proof worker. Not in `inFlight`, but not free to re-request. */
  private readonly verifyingBuckets = new Set<number>()
  private detachAccountRange?: () => void
  private tickTimer?: ReturnType<typeof setInterval>
  private syncStart = 0
  private lastAccountCount = 0
  private lastRateAt = 0
  private peerRangeFailureStreak = new Map<string, number>()
  private bucketStealReq = new Map<number, bigint>()
  private bucketStealMid = new Map<number, Uint8Array>()
  /** Upper half `[origin .. limit]` after tail steal clamps primary `limitHash` (WP-04g). */
  private bucketStealUpper = new Map<number, { origin: Uint8Array; limit: Uint8Array }>()

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
  }

  abortInFlight(): void {
    this.inFlight.clear()
    this.verifyingBuckets.clear()
    this.flightTracker.clearAll()
  }

  bumpRootGeneration(): number {
    this.inFlight.clear()
    this.verifyingBuckets.clear()
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
    this.lastAccountCount = this.spine.totalAccountsSynced
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

  private bucketHasInFlight(bucketIndex: number): boolean {
    for (const flight of this.inFlight.values()) {
      if (flight.bucket === bucketIndex && !flight.steal) return true
    }
    return false
  }

  private schedule(): void {
    if (this.spine.snapPaused || this.spine.pivotStateRoot === undefined) return
    const now = Date.now()
    this.refreshAccountRate(now)
    if (
      this.spine.snapBuckets.length > 0 &&
      this.spine.snapBuckets.every((b) => b.status === 'done')
    ) {
      this.spine.accountsPerSec = 0
      return
    }
    const peers = rankSnapPeers(
      this.getSnapPeers().filter((p) => p.caps.some((c) => c.startsWith('snap'))),
    )
    this.expireStaleRanges(new Set(peers.map((p) => p.id)), now)
    if (peers.length === 0) return
    for (const bucket of this.spine.snapBuckets) {
      if (bucketRangeExhausted(bucket)) {
        bucket.status = 'done'
        bucket.assignedPeerId = undefined
        continue
      }
      if (bucket.status === 'done') continue
      if (bucket.status === 'stalled' && now < (this.stallUntil.get(bucket.index) ?? 0)) continue
      if (bucket.status === 'verifying_proof' || this.verifyingBuckets.has(bucket.index)) continue
      if (this.bucketHasInFlight(bucket.index)) continue
      const peer = peers.find((candidate) => {
        if (now < (this.peerRestUntil.get(candidate.id) ?? 0)) return false
        const cap = maxInFlightForPeer(candidate)
        return this.flightTracker.inFlightCount(candidate.id) < cap
      })
      if (peer === undefined) break
      const reqId = this.reqId++
      bucket.status = 'syncing'
      bucket.assignedPeerId = peer.id
      const maxInFlight = maxInFlightForPeer(peer)
      if (
        !this.flightTracker.tryClaim(peer.id, { kind: 'account', reqId, sentAt: now }, maxInFlight)
      ) {
        continue
      }
      this.inFlight.set(inFlightKey(peer.id, reqId), {
        peerId: peer.id,
        bucket: bucket.index,
        reqId,
        sentAt: now,
        rootGeneration: this.flightTracker.rootGeneration,
        timeoutMs: rangeTimeoutForPeer(peer),
      })
      const row = this.spine.peers.get(peer.id)
      if (row !== undefined) row.snapRequestsSent++
      const payload = encodeGetAccountRange(
        reqId,
        this.spine.pivotStateRoot,
        bucket.currentLastHash,
        bucket.limitHash,
        RESPONSE_BYTES,
      )
      this.transport.sendAccountRange(peer.id, payload)
    }
    this.scheduleStealIfNeeded(peers, now)
  }

  private expireStaleRanges(livePeerIds: ReadonlySet<string>, now: number): void {
    for (const [key, flight] of this.inFlight) {
      const left = !livePeerIds.has(flight.peerId)
      if (!left && now - flight.sentAt < flight.timeoutMs) continue
      this.inFlight.delete(key)
      this.flightTracker.release(flight.peerId, flight.reqId)
      const bucket = this.spine.snapBuckets[flight.bucket]
      if (bucket === undefined || bucket.status === 'done') continue
      if (left) {
        bucket.status = 'pending'
        bucket.assignedPeerId = undefined
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
      if (peerRow !== undefined) peerRow.snapTimeouts++
      this.peerBook?.noteSnapTimeout(flight.peerId)
      if (flight.steal === true) {
        this.bucketStealReq.delete(flight.bucket)
      }
      this.noteRangeFailure(bucket, flight.peerId, 'account range timed out')
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
    const repeats = (this.stallRepeats.get(bucket.index) ?? 0) + 1
    this.stallRepeats.set(bucket.index, repeats)
    const peerRangeMismatch =
      reason.includes('firstKey should be less than lastKey') ||
      reason.includes('peer returned accounts below request origin')
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

  private scheduleStealIfNeeded(peers: SnapSchedulePeer[], now: number): void {
    if (this.spine.pivotStateRoot === undefined) return
    const unfinished = this.spine.snapBuckets.filter((b) => b.status !== 'done')
    if (unfinished.length === 0) return

    // 1. Continue any already-split upper range that has no active request in flight.
    for (const [bucketIndex, upper] of this.bucketStealUpper) {
      if (this.bucketStealReq.has(bucketIndex)) continue
      const stealPeer = peers.find(
        (p) =>
          p.snapResponsesOk >= 2 &&
          now >= (this.peerRestUntil.get(p.id) ?? 0) &&
          this.flightTracker.inFlightCount(p.id) < maxInFlightForPeer(p),
      )
      if (stealPeer === undefined) return
      const reqId = this.reqId++
      const maxInFlight = maxInFlightForPeer(stealPeer)
      if (
        !this.flightTracker.tryClaim(
          stealPeer.id,
          { kind: 'account', reqId, sentAt: now },
          maxInFlight,
        )
      ) {
        continue
      }
      this.inFlight.set(inFlightKey(stealPeer.id, reqId), {
        peerId: stealPeer.id,
        bucket: bucketIndex,
        reqId,
        sentAt: now,
        rootGeneration: this.flightTracker.rootGeneration,
        timeoutMs: rangeTimeoutForPeer(stealPeer),
        steal: true,
        stealMid: new Uint8Array(upper.origin),
      })
      this.bucketStealReq.set(bucketIndex, reqId)
      const row = this.spine.peers.get(stealPeer.id)
      if (row !== undefined) row.snapRequestsSent++
      const payload = encodeGetAccountRange(
        reqId,
        this.spine.pivotStateRoot,
        upper.origin,
        upper.limit,
        RESPONSE_BYTES,
      )
      this.transport.sendAccountRange(stealPeer.id, payload)
    }

    // 2. When all unfinished primary buckets are busy, split the widest remaining bucket for an idle proven peer.
    if (
      !unfinished.every(
        (b) =>
          this.bucketHasInFlight(b.index) ||
          this.verifyingBuckets.has(b.index) ||
          bucketRangeExhausted(b),
      )
    ) {
      return
    }
    const stealPeer = peers.find(
      (p) =>
        p.snapResponsesOk >= 2 &&
        now >= (this.peerRestUntil.get(p.id) ?? 0) &&
        this.flightTracker.inFlightCount(p.id) === 0,
    )
    if (stealPeer === undefined) return
    let target: SnapBucket | undefined
    let bestSpan = 0
    for (const b of unfinished) {
      if (this.bucketStealReq.has(b.index) || this.bucketStealUpper.has(b.index)) continue
      const span = bucketPosition36(b.limitHash) - bucketPosition36(b.currentLastHash)
      if (span < 0x1_0000_0000) continue
      if (span > bestSpan) {
        bestSpan = span
        target = b
      }
    }
    if (target === undefined) return
    const mid = midpointKey32(target.currentLastHash, target.limitHash)
    const savedLimit = new Uint8Array(target.limitHash)
    target.limitHash = new Uint8Array(mid)
    const upper = { origin: new Uint8Array(mid), limit: savedLimit }
    this.bucketStealUpper.set(target.index, upper)
    const reqId = this.reqId++
    const maxInFlight = maxInFlightForPeer(stealPeer)
    if (
      !this.flightTracker.tryClaim(
        stealPeer.id,
        { kind: 'account', reqId, sentAt: now },
        maxInFlight,
      )
    ) {
      target.limitHash = savedLimit
      this.bucketStealUpper.delete(target.index)
      return
    }
    this.inFlight.set(inFlightKey(stealPeer.id, reqId), {
      peerId: stealPeer.id,
      bucket: target.index,
      reqId,
      sentAt: now,
      rootGeneration: this.flightTracker.rootGeneration,
      timeoutMs: rangeTimeoutForPeer(stealPeer),
      steal: true,
      stealMid: mid,
    })
    this.bucketStealReq.set(target.index, reqId)
    this.bucketStealMid.set(target.index, mid)
    const row = this.spine.peers.get(stealPeer.id)
    if (row !== undefined) row.snapRequestsSent++
    const payload = encodeGetAccountRange(
      reqId,
      this.spine.pivotStateRoot,
      upper.origin,
      upper.limit,
      RESPONSE_BYTES,
    )
    this.transport.sendAccountRange(stealPeer.id, payload)
  }

  private clearStealForBucket(bucketIndex: number, restoreLimit = false): void {
    this.bucketStealReq.delete(bucketIndex)
    this.bucketStealMid.delete(bucketIndex)
    if (restoreLimit) {
      const upper = this.bucketStealUpper.get(bucketIndex)
      const bucket = this.spine.snapBuckets[bucketIndex]
      if (upper !== undefined && bucket !== undefined) {
        bucket.limitHash = new Uint8Array(upper.limit)
      }
    }
    this.bucketStealUpper.delete(bucketIndex)
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
    if (!flight.steal) {
      this.verifyingBuckets.add(flight.bucket)
    }
    this.inFlight.delete(key)
    this.flightTracker.release(peerId, replyId)
    const bucket = this.spine.snapBuckets[flight.bucket]
    if (bucket === undefined) {
      this.verifyingBuckets.delete(flight.bucket)
      return
    }
    if (!flight.steal) {
      bucket.status = 'verifying_proof'
    }
    const origin =
      flight.steal === true && flight.stealMid !== undefined
        ? flight.stealMid
        : bucket.currentLastHash
    // Immediately schedule another open bucket on the freed peer slot while the worker verifies!
    this.schedule()

    let result: Awaited<ReturnType<SnapVerifyPool['verifyAccountRange']>>
    try {
      result = await this.verifyPool.verifyAccountRange({
        stateRoot: this.spine.pivotStateRoot,
        origin,
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
          if (!flight.steal) {
            this.verifyingBuckets.delete(flight.bucket)
          }
          this.commitVerifiedAccountRange(peerId, flight, bucket, result)
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
    result: Awaited<ReturnType<SnapVerifyPool['verifyAccountRange']>>,
  ): void {
    if (flight.rootGeneration !== this.flightTracker.rootGeneration) {
      if (bucket.status === 'verifying_proof') bucket.status = 'pending'
      return
    }
    if (result.ok && result.slab !== undefined && result.count > 0) {
      const slab =
        flight.steal === true
          ? filterAccountSlabFromMid(result.slab, flight.stealMid ?? bucket.currentLastHash)
          : filterAccountSlabBeforeMid(result.slab, this.bucketStealMid.get(flight.bucket))
      if (slab.length > 0) {
        this.stateManager.putSnapBinaryAccountsFromSlab(slab)
      }
    }
    if (!result.ok) {
      if (flight.steal === true) {
        this.bucketStealReq.delete(flight.bucket)
        if (!this.bucketHasInFlight(flight.bucket) && bucketRangeExhausted(bucket)) {
          const upper = this.bucketStealUpper.get(flight.bucket)
          if (upper !== undefined) {
            bucket.currentLastHash = new Uint8Array(upper.origin)
            bucket.limitHash = new Uint8Array(upper.limit)
          }
          this.clearStealForBucket(flight.bucket, false)
        }
      }
      this.noteRangeFailure(bucket, peerId, result.reason ?? 'range proof failed')
      this.schedule()
      return
    }
    if (flight.steal === true) {
      this.stallRepeats.delete(bucket.index)
      this.stallUntil.delete(bucket.index)
      const rowSteal = this.spine.peers.get(peerId)
      if (rowSteal !== undefined && result.count > 0) rowSteal.snapResponsesOk++
      if (result.count > 0) {
        this.peerRangeFailureStreak.delete(peerId)
        this.peerBook?.noteSnapSuccess(peerId, Date.now())
        const stealSlab =
          result.slab !== undefined
            ? filterAccountSlabFromMid(result.slab, flight.stealMid ?? bucket.currentLastHash)
            : undefined
        if (stealSlab !== undefined && stealSlab.length > 0) {
          const stealRows = stealSlab.length / 136
          void this.snapStore?.appendVerifiedSlabAsync(
            flight.bucket,
            stealSlab,
            this.spine.snapBuckets,
          )
          this.onAccountsIngested?.(ingestedMetaFromBinarySlab(stealSlab))
          bucket.accountsLoaded += stealRows
          this.spine.totalAccountsSynced += stealRows
          this.updateRate()
        }
      }
      this.bucketStealReq.delete(flight.bucket)
      const upper = this.bucketStealUpper.get(flight.bucket)
      if (
        upper !== undefined &&
        result.hasRight &&
        result.lastKey instanceof Uint8Array &&
        compareBytes32(result.lastKey, upper.limit) < 0
      ) {
        upper.origin = incrementKey32(result.lastKey)
        if (
          !this.bucketHasInFlight(flight.bucket) &&
          !this.verifyingBuckets.has(flight.bucket) &&
          bucketRangeExhausted(bucket)
        ) {
          bucket.currentLastHash = new Uint8Array(upper.origin)
          bucket.limitHash = new Uint8Array(upper.limit)
          this.clearStealForBucket(flight.bucket, false)
          bucket.status = 'pending'
        }
      } else {
        this.clearStealForBucket(flight.bucket, false)
        if (
          !this.bucketHasInFlight(flight.bucket) &&
          !this.verifyingBuckets.has(flight.bucket) &&
          bucketRangeExhausted(bucket)
        ) {
          bucket.status = 'done'
          bucket.assignedPeerId = undefined
          bucket.lastStallReason = undefined
        }
      }
      this.schedule()
      return
    }
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
    const persistSlab =
      result.slab !== undefined
        ? filterAccountSlabBeforeMid(result.slab, this.bucketStealMid.get(flight.bucket))
        : undefined
    const acceptedCount = persistSlab !== undefined ? persistSlab.length / 136 : result.count
    bucket.accountsLoaded += acceptedCount
    this.spine.totalAccountsSynced += acceptedCount
    this.updateRate()
    if (result.hasRight && compareBytes32(bucket.currentLastHash, bucket.limitHash) < 0) {
      const lastKey = result.lastKey
      if (lastKey instanceof Uint8Array) {
        if (compareBytes32(lastKey, bucket.limitHash) >= 0) {
          bucket.currentLastHash = new Uint8Array(bucket.limitHash)
        } else {
          bucket.currentLastHash = incrementKey32(lastKey)
        }
      } else {
        this.noteRangeFailure(bucket, peerId, 'account range missing last key')
        this.schedule()
        return
      }
    } else {
      bucket.currentLastHash = new Uint8Array(bucket.limitHash)
    }
    if (bucketRangeExhausted(bucket)) {
      const upper = this.bucketStealUpper.get(flight.bucket)
      if (upper !== undefined) {
        if (this.bucketStealReq.has(flight.bucket)) {
          bucket.status = 'syncing'
        } else {
          bucket.currentLastHash = new Uint8Array(upper.origin)
          bucket.limitHash = new Uint8Array(upper.limit)
          this.clearStealForBucket(flight.bucket, false)
          bucket.status = 'pending'
        }
      } else {
        bucket.status = 'done'
        bucket.assignedPeerId = undefined
        bucket.lastStallReason = undefined
      }
    } else {
      bucket.status = 'pending'
    }
    if (acceptedCount > 0 && persistSlab !== undefined && persistSlab.length > 0) {
      this.peerBook?.noteSnapSuccess(peerId, Date.now())
      void this.snapStore?.appendVerifiedSlabAsync(
        flight.bucket,
        persistSlab,
        this.spine.snapBuckets,
      )
      this.onAccountsIngested?.(ingestedMetaFromBinarySlab(persistSlab))
    } else if (result.count === 0) {
      this.snapStore?.maybeFlushMetadata(true)
    }
    this.schedule()
  }

  private updateRate(): void {
    this.refreshAccountRate(Date.now())
  }

  /** Keep TUI speed honest when sync pauses; storage count stays on `totalAccountsSynced`. */
  private refreshAccountRate(now: number): void {
    const dt = (now - this.lastRateAt) / 1000
    if (dt < RATE_IDLE_SEC) return
    const delta = this.spine.totalAccountsSynced - this.lastAccountCount
    this.spine.accountsPerSec = delta > 0 ? delta / dt : 0
    this.lastAccountCount = this.spine.totalAccountsSynced
    this.lastRateAt = now
  }
}

function bucketRangeExhausted(bucket: SnapBucket): boolean {
  return snapBucketCursorExhausted(bucket)
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

function filterAccountSlabBeforeMid(slab: Uint8Array, mid: Uint8Array | undefined): Uint8Array {
  if (mid === undefined) return slab
  const rows: Uint8Array[] = []
  for (let offset = 0; offset + ACCOUNT_SLAB_STRIDE <= slab.length; offset += ACCOUNT_SLAB_STRIDE) {
    const hash = slab.subarray(offset, offset + 32)
    if (compareBytes32(hash, mid) < 0) {
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

function filterAccountSlabFromMid(slab: Uint8Array, mid: Uint8Array): Uint8Array {
  const rows: Uint8Array[] = []
  for (let offset = 0; offset + ACCOUNT_SLAB_STRIDE <= slab.length; offset += ACCOUNT_SLAB_STRIDE) {
    const hash = slab.subarray(offset, offset + 32)
    if (compareBytes32(hash, mid) >= 0) {
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
