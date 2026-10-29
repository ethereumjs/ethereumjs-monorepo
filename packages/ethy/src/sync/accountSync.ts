import { SnapMessageCodes } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import { bigIntToUnpaddedBytes, bytesToBigInt, setLengthLeft } from '@ethereumjs/util'

import { setPhase } from '../spine/createSpine.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine, SnapBucket } from '../spine/types.ts'
import type { SnapTransport } from './snapTransport.ts'
import { incrementKey32, ingestAccountRangeReply } from './syntheticPeer.ts'

/**
 * Bytes we ask a peer to return. 512 KiB is about 8,000 accounts: public nodes
 * stall long enough to miss a ping, and the next request then piles on.
 */
const RESPONSE_BYTES = 128 * 1024
const RANGE_TIMEOUT_MS = 20_000
const STALL_BASE_MS = 2_000
const STALL_MAX_MS = 15_000
/** After a timeout, skip that peer briefly so its in-flight proof can finish. */
const PEER_REST_MS = 10_000

type InFlightRange = { bucket: number; reqId: bigint; sentAt: number }

export type SnapAccountSynchronizerOpts = {
  spine: EthySpine
  stateManager: FlatStateManager
  transport: SnapTransport
  getSnapPeers: () => Array<{ id: string; caps: string[] }>
}

export class SnapAccountSynchronizer {
  private readonly spine: EthySpine
  private readonly stateManager: FlatStateManager
  private readonly transport: SnapTransport
  private readonly getSnapPeers: () => Array<{ id: string; caps: string[] }>
  private reqId = 1n
  private inFlight = new Map<string, InFlightRange>()
  private stallUntil = new Map<number, number>()
  private stallRepeats = new Map<number, number>()
  private peerRestUntil = new Map<string, number>()
  private detachAccountRange?: () => void
  private tickTimer?: ReturnType<typeof setInterval>
  private syncStart = 0
  private lastAccountCount = 0
  private lastRateAt = 0

  constructor(opts: SnapAccountSynchronizerOpts) {
    this.spine = opts.spine
    this.stateManager = opts.stateManager
    this.transport = opts.transport
    this.getSnapPeers = opts.getSnapPeers
  }

  start(): void {
    if (this.detachAccountRange !== undefined) return
    setPhase(this.spine, 'SNAP_SYNCING')
    this.syncStart = Date.now()
    this.lastRateAt = this.syncStart
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
  }

  private schedule(): void {
    if (this.spine.snapPaused || this.spine.pivotStateRoot === undefined) return
    const now = Date.now()
    const peers = this.getSnapPeers().filter((p) => p.caps.some((c) => c.startsWith('snap')))
    this.expireStaleRanges(new Set(peers.map((p) => p.id)), now)
    if (peers.length === 0) return
    let peerIdx = 0
    for (const bucket of this.spine.snapBuckets) {
      if (bucket.status === 'done') continue
      if (bucket.status === 'stalled' && now < (this.stallUntil.get(bucket.index) ?? 0)) continue
      while (peerIdx < peers.length) {
        const candidate = peers[peerIdx]!
        const resting = now < (this.peerRestUntil.get(candidate.id) ?? 0)
        if (!this.inFlight.has(candidate.id) && !resting) break
        peerIdx++
      }
      if (peerIdx >= peers.length) break
      const peer = peers[peerIdx]!
      peerIdx++
      const reqId = this.reqId++
      bucket.status = 'syncing'
      bucket.assignedPeerId = peer.id
      this.inFlight.set(peer.id, { bucket: bucket.index, reqId, sentAt: now })
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
  }

  private expireStaleRanges(livePeerIds: ReadonlySet<string>, now: number): void {
    for (const [peerId, flight] of this.inFlight) {
      const left = !livePeerIds.has(peerId)
      if (!left && now - flight.sentAt < RANGE_TIMEOUT_MS) continue
      this.inFlight.delete(peerId)
      const bucket = this.spine.snapBuckets[flight.bucket]
      if (bucket === undefined || bucket.status === 'done') continue
      if (left) {
        bucket.status = 'pending'
        bucket.assignedPeerId = undefined
        bucket.lastStallReason = 'snap peer left'
        recordDiagnostic(this.spine, {
          subsystem: 'snap',
          severity: 'warn',
          peerId,
          bucketIndex: bucket.index,
          message: `Bucket ${bucket.prefix}: snap peer left`,
        })
        continue
      }
      this.peerRestUntil.set(peerId, now + PEER_REST_MS)
      const row = this.spine.peers.get(peerId)
      if (row !== undefined) row.snapTimeouts++
      this.noteRangeFailure(bucket, peerId, 'account range timed out')
    }
  }

  private noteRangeFailure(bucket: SnapBucket, peerId: string, reason: string): void {
    const repeats = (this.stallRepeats.get(bucket.index) ?? 0) + 1
    this.stallRepeats.set(bucket.index, repeats)
    const delay = Math.min(STALL_MAX_MS, STALL_BASE_MS * 2 ** Math.min(repeats - 1, 3))
    this.stallUntil.set(bucket.index, Date.now() + delay)
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
    const flight = this.inFlight.get(peerId)
    if (flight === undefined || this.spine.pivotStateRoot === undefined) return
    const replyId = accountRangeRequestId(payload)
    if (replyId === undefined || replyId !== flight.reqId) return
    this.inFlight.delete(peerId)
    const bucket = this.spine.snapBuckets[flight.bucket]
    if (bucket === undefined) return
    bucket.status = 'verifying_proof'
    const origin = bucket.currentLastHash
    let result: { ok: boolean; hasRight: boolean; count: number; reason?: string }
    try {
      result = await ingestAccountRangeReply(
        this.spine.pivotStateRoot,
        payload,
        (entries) => this.stateManager.putSnapAccountsBatch(entries),
        origin,
      )
    } catch (err: unknown) {
      result = {
        ok: false,
        hasRight: false,
        count: 0,
        reason: err instanceof Error ? err.message : String(err),
      }
    }
    if (!result.ok) {
      this.noteRangeFailure(bucket, peerId, result.reason ?? 'range proof failed')
      return
    }
    this.stallRepeats.delete(bucket.index)
    this.stallUntil.delete(bucket.index)
    const row = this.spine.peers.get(peerId)
    if (row !== undefined && result.count > 0) row.snapResponsesOk++
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
      const decoded = RLP.decode(payload) as unknown[]
      const accountsRaw = decoded[1] as Array<[Uint8Array, Uint8Array]>
      const lastKey = accountsRaw[accountsRaw.length - 1]?.[0]
      if (lastKey instanceof Uint8Array) {
        bucket.currentLastHash = incrementKey32(lastKey)
        bucket.status = 'pending'
      } else {
        bucket.status = 'done'
      }
    } else {
      bucket.status = 'done'
    }
  }

  private updateRate(): void {
    const now = Date.now()
    const dt = (now - this.lastRateAt) / 1000
    if (dt >= 1) {
      const delta = this.spine.totalAccountsSynced - this.lastAccountCount
      this.spine.accountsPerSec = delta / dt
      this.lastAccountCount = this.spine.totalAccountsSynced
      this.lastRateAt = now
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

function compareBytes32(a: Uint8Array, b: Uint8Array): number {
  for (let i = 0; i < 32; i++) {
    if (a[i]! !== b[i]!) return a[i]! - b[i]!
  }
  return 0
}
