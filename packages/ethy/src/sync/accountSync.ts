import { SnapMessageCodes } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import { bigIntToUnpaddedBytes, setLengthLeft } from '@ethereumjs/util'

import { setPhase } from '../spine/createSpine.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine } from '../spine/types.ts'
import type { SnapTransport } from './snapTransport.ts'
import { incrementKey32, ingestAccountRangeReply } from './syntheticPeer.ts'

const RESPONSE_BYTES = 512 * 1024

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
  private inFlight = new Map<string, number>()
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
    const peers = this.getSnapPeers().filter((p) => p.caps.some((c) => c.startsWith('snap')))
    if (peers.length === 0) return
    let peerIdx = 0
    for (const bucket of this.spine.snapBuckets) {
      if (bucket.status === 'done') continue
      while (peerIdx < peers.length && this.inFlight.has(peers[peerIdx]!.id)) {
        peerIdx++
      }
      if (peerIdx >= peers.length) break
      const peer = peers[peerIdx]!
      peerIdx++
      bucket.status = 'syncing'
      bucket.assignedPeerId = peer.id
      this.inFlight.set(peer.id, bucket.index)
      const payload = encodeGetAccountRange(
        this.reqId++,
        this.spine.pivotStateRoot,
        bucket.currentLastHash,
        bucket.limitHash,
        RESPONSE_BYTES,
      )
      this.transport.sendAccountRange(peer.id, payload)
    }
  }

  private async handleAccountRange(peerId: string, payload: Uint8Array): Promise<void> {
    const bucketIndex = this.inFlight.get(peerId)
    this.inFlight.delete(peerId)
    if (bucketIndex === undefined || this.spine.pivotStateRoot === undefined) return
    const bucket = this.spine.snapBuckets[bucketIndex]
    if (bucket === undefined) return
    bucket.status = 'verifying_proof'
    const result = await ingestAccountRangeReply(this.spine.pivotStateRoot, payload, (entries) =>
      this.stateManager.putSnapAccountsBatch(entries),
    )
    if (!result.ok) {
      bucket.status = 'stalled'
      bucket.lastStallReason = 'range proof failed'
      recordDiagnostic(this.spine, {
        subsystem: 'snap',
        severity: 'warn',
        peerId,
        bucketIndex,
        message: `Range proof failed for bucket ${bucket.prefix}`,
      })
      return
    }
    bucket.accountsLoaded += result.count
    this.spine.totalAccountsSynced += result.count
    this.updateRate()
    if (result.hasRight && compareBytes32(bucket.currentLastHash, bucket.limitHash) < 0) {
      const decoded = RLP.decode(payload) as unknown[]
      const accountsRaw = decoded[1] as Array<[Uint8Array, Uint8Array]>
      const lastKey = accountsRaw[accountsRaw.length - 1]?.[0]
      if (lastKey !== undefined) {
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

function compareBytes32(a: Uint8Array, b: Uint8Array): number {
  for (let i = 0; i < 32; i++) {
    if (a[i]! !== b[i]!) return a[i]! - b[i]!
  }
  return 0
}
