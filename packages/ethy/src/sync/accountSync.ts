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
      enqueueProtocol(async () => {
        await this.handleAccountRange(peerId, payload)
      })
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
      if (flight.bucket === bucketIndex) return true
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
      this.peerRestUntil.set(flight.peerId, now + peerRestAfterTimeout(schedulePeer))
      if (peerRow !== undefined) peerRow.snapTimeouts++
      this.peerBook?.noteSnapTimeout(flight.peerId)
      this.noteRangeFailure(bucket, flight.peerId, 'account range timed out')
    }
  }

  private hasHealthyAlternatePeer(excludeId: string, now: number): boolean {
    for (const p of this.getSnapPeers().filter((x) => x.caps.some((c) => c.startsWith('snap')))) {
      if (p.id === excludeId) continue
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
    const restMs = peerRestMsForRangeFailure(reason, schedulePeer, streak)
    if (restMs !== undefined) {
      this.peerRestUntil.set(peerId, now + restMs)
    }
    if (quarantine) {
      if (peerRow !== undefined) peerRow.snapTimeouts++
      this.peerBook?.noteSnapTimeout(peerId)
    }
    const alternate = this.hasHealthyAlternatePeer(peerId, now)
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
    const unfinished = this.spine.snapBuckets.filter(
      (b) => b.status !== 'done' && !bucketRangeExhausted(b),
    )
    if (unfinished.length === 0) return
    if (!unfinished.every((b) => this.bucketHasInFlight(b.index))) return
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
      if (this.bucketStealReq.has(b.index)) continue
      const span = bucketPosition36(b.limitHash) - bucketPosition36(b.currentLastHash)
      if (span < 0x1_0000_0000) continue
      if (span > bestSpan) {
        bestSpan = span
        target = b
      }
    }
    if (target === undefined || this.spine.pivotStateRoot === undefined) return
    const mid = midpointKey32(target.currentLastHash, target.limitHash)
    const reqId = this.reqId++
    const maxInFlight = maxInFlightForPeer(stealPeer)
    if (
      !this.flightTracker.tryClaim(
        stealPeer.id,
        { kind: 'account', reqId, sentAt: now },
        maxInFlight,
      )
    ) {
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
      mid,
      target.limitHash,
      RESPONSE_BYTES,
    )
    this.transport.sendAccountRange(stealPeer.id, payload)
  }

  private clearStealForBucket(bucketIndex: number): void {
    this.bucketStealReq.delete(bucketIndex)
    this.bucketStealMid.delete(bucketIndex)
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
    this.verifyingBuckets.add(flight.bucket)
    this.inFlight.delete(key)
    this.flightTracker.release(peerId, replyId)
    const bucket = this.spine.snapBuckets[flight.bucket]
    if (bucket === undefined) {
      this.verifyingBuckets.delete(flight.bucket)
      return
    }
    bucket.status = 'verifying_proof'
    const origin =
      flight.steal === true && flight.stealMid !== undefined
        ? flight.stealMid
        : bucket.currentLastHash
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
    } finally {
      this.verifyingBuckets.delete(flight.bucket)
    }
    if (flight.rootGeneration !== this.flightTracker.rootGeneration) {
      if (bucket.status === 'verifying_proof') bucket.status = 'pending'
      return
    }
    if (result.ok && result.slab !== undefined && result.count > 0) {
      this.stateManager.putSnapBinaryAccountsFromSlab(result.slab)
    }
    if (!result.ok) {
      if (flight.steal === true) this.clearStealForBucket(flight.bucket)
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
        if (result.slab !== undefined) {
          void this.snapStore?.appendVerifiedSlabAsync(
            flight.bucket,
            result.slab,
            this.spine.snapBuckets,
          )
          this.onAccountsIngested?.(ingestedMetaFromBinarySlab(result.slab))
        }
        bucket.accountsLoaded += result.count
        this.spine.totalAccountsSynced += result.count
        this.updateRate()
      }
      bucket.status = 'pending'
      bucket.assignedPeerId = undefined
      this.clearStealForBucket(flight.bucket)
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
    const activeStealMid = this.bucketStealMid.get(flight.bucket)
    if (activeStealMid !== undefined && result.lastKey instanceof Uint8Array) {
      if (compareBytes32(result.lastKey, activeStealMid) >= 0) {
        this.clearStealForBucket(flight.bucket)
      }
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
    bucket.accountsLoaded += result.count
    this.spine.totalAccountsSynced += result.count
    this.updateRate()
    if (result.hasRight && compareBytes32(bucket.currentLastHash, bucket.limitHash) < 0) {
      const lastKey = result.lastKey
      if (lastKey instanceof Uint8Array) {
        bucket.currentLastHash = incrementKey32(lastKey)
        bucket.status = 'pending'
      } else {
        this.noteRangeFailure(bucket, peerId, 'account range missing last key')
        this.schedule()
        return
      }
    } else {
      bucket.currentLastHash = new Uint8Array(bucket.limitHash)
      bucket.status = 'done'
      bucket.lastStallReason = undefined
    }
    if (result.count > 0) {
      this.peerBook?.noteSnapSuccess(peerId, Date.now())
      if (result.slab !== undefined) {
        void this.snapStore?.appendVerifiedSlabAsync(
          flight.bucket,
          result.slab,
          this.spine.snapBuckets,
        )
        this.onAccountsIngested?.(ingestedMetaFromBinarySlab(result.slab))
      }
    } else {
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
  try {
    const decoded = RLP.decode(payload) as unknown[]
    const id = decoded[0]
    if (!(id instanceof Uint8Array)) return undefined
    if (id.length === 0) return 0n
    return bytesToBigInt(id)
  } catch {
    return undefined
  }
}

function midpointKey32(lo: Uint8Array, hi: Uint8Array): Uint8Array {
  const a = bytesToBigInt(lo)
  const b = bytesToBigInt(hi)
  if (b <= a) return incrementKey32(lo)
  const mid = (a + b) / 2n
  if (mid <= a) return incrementKey32(lo)
  return setLengthLeft(bigIntToUnpaddedBytes(mid), 32)
}
