import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { assert, describe, it, vi } from 'vitest'

import { createSnapBuckets } from '../src/spine/buckets.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { SnapAccountSynchronizer, encodeGetAccountRange } from '../src/sync/accountSync.ts'
import { SnapPeerFlightTracker } from '../src/sync/snapFlight.ts'
import type { SnapTransport } from '../src/sync/snapTransport.ts'

function mockSnapTransport(overrides: Partial<SnapTransport> = {}): SnapTransport {
  return {
    snapPeers: () => [],
    sendAccountRange: () => {},
    onAccountRange: () => () => {},
    sendStorageRanges: () => {},
    onStorageRanges: () => () => {},
    sendByteCodes: () => {},
    onByteCodes: () => () => {},
    ...overrides,
  }
}
import {
  SyntheticSnapPeer,
  incrementKey32,
  ingestAccountRangeReply,
} from '../src/sync/syntheticPeer.ts'

describe('[Ethy/Sync]: synthetic snap account range', () => {
  it('ingestAccountRangeReply() rejects an empty range that has no proof', async () => {
    const reply = RLP.encode([new Uint8Array(0), [], []] as never)
    const result = await ingestAccountRangeReply(
      new Uint8Array(32),
      reply,
      () => {},
      new Uint8Array(32),
    )
    assert.equal(result.ok, false)
    assert.equal(result.count, 0)
    assert.match(result.reason ?? '', /without proof/)
  })

  it('ingestAccountRangeReply() rejects a non-byte payload without throwing', async () => {
    const result = await ingestAccountRangeReply(
      new Uint8Array(32),
      { 0: 1, 1: 2 } as unknown as Uint8Array,
      () => {},
    )
    assert.equal(result.ok, false)
    assert.equal(result.count, 0)
  })

  it('live-style origin proof fails when checked from the first account', async () => {
    const peer = await SyntheticSnapPeer.create(2)
    const spine = createSpine('sepolia', 11155111n)
    spine.snapBuckets = createSnapBuckets()
    const bucket = spine.snapBuckets[0]!
    const req = encodeGetAccountRange(
      1n,
      peer.rootHash,
      bucket.currentLastHash,
      bucket.limitHash,
      512 * 1024,
    )
    const reply = await peer.buildAccountRangeReply(req)
    const wrongEdge = await ingestAccountRangeReply(peer.rootHash, reply, () => {})
    const fromOrigin = await ingestAccountRangeReply(
      peer.rootHash,
      reply,
      () => {},
      bucket.currentLastHash,
    )
    assert.equal(wrongEdge.ok, false)
    assert.equal(fromOrigin.ok, true)
    assert.isAbove(fromOrigin.count, 0)
  })

  it('syncs all 16 buckets with one proof retry on 0x3', async () => {
    const t0 = performance.now()
    const peer = await SyntheticSnapPeer.create(10)
    const sm = createFlatStateManager()
    const spine = createSpine('sepolia', 11155111n)
    spine.pivotStateRoot = peer.rootHash
    spine.snapBuckets = createSnapBuckets()
    let proofFailures = 0
    for (const bucket of spine.snapBuckets) {
      let done = false
      let steps = 0
      while (!done) {
        if (++steps > 40) {
          throw new Error(`bucket ${bucket.prefix} did not finish`)
        }
        const req = encodeGetAccountRange(
          1n,
          peer.rootHash,
          bucket.currentLastHash,
          bucket.limitHash,
          512 * 1024,
        )
        const reply = await peer.buildAccountRangeReply(req)
        const accountsRaw = (RLP.decode(reply) as unknown[])[1] as Array<[Uint8Array, Uint8Array]>
        if (!Array.isArray(accountsRaw) || accountsRaw.length === 0) {
          done = true
          continue
        }
        const result = await ingestAccountRangeReply(
          peer.rootHash,
          reply,
          (entries) => sm.putSnapAccountsBatch(entries),
          bucket.currentLastHash,
        )
        if (!result.ok) {
          proofFailures++
          continue
        }
        spine.totalAccountsSynced += result.count
        if (result.count === 0) {
          done = true
        } else if (!result.hasRight) {
          done = true
        } else {
          bucket.currentLastHash = incrementKey32(accountsRaw[accountsRaw.length - 1]![0]!)
        }
      }
      bucket.status = 'done'
    }
    assert.isAtLeast(proofFailures, 1)
    assert.strictEqual(sm.accountCount(), 160)
    // Local runs finish well under a second. Shared CI runners are slower.
    assert.isBelow(performance.now() - t0, 5_000)
  })

  it('shows 0/s after idle without new accounts', () => {
    vi.useFakeTimers()
    try {
      const spine = createSpine('sepolia', 11155111n)
      spine.pivotStateRoot = new Uint8Array(32)
      spine.totalAccountsSynced = 5_000
      spine.accountsPerSec = 5_952
      const sync = new SnapAccountSynchronizer({
        spine,
        stateManager: createFlatStateManager(),
        transport: mockSnapTransport(),
        flightTracker: new SnapPeerFlightTracker(),
        getSnapPeers: () => [],
      })
      sync.start()
      vi.advanceTimersByTime(2_500)
      assert.equal(spine.accountsPerSec, 0)
      sync.stop()
    } finally {
      vi.useRealTimers()
    }
  })

  it('returns a bucket to the queue when its snap peer leaves', async () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.pivotStateRoot = new Uint8Array(32)
    const peers = [{ id: 'aa11', caps: ['eth/72', 'snap/1'] }]
    let sent = 0
    const transport = mockSnapTransport({
      snapPeers: () => peers,
      sendAccountRange() {
        sent++
      },
    })
    const sync = new SnapAccountSynchronizer({
      spine,
      stateManager: {} as never,
      transport,
      flightTracker: new SnapPeerFlightTracker(),
      getSnapPeers: () => peers,
    })
    sync.start()
    assert.equal(sent, 1)
    assert.equal(spine.snapBuckets[0]!.status, 'syncing')
    peers.pop()
    await new Promise((resolve) => setTimeout(resolve, 120))
    sync.stop()
    assert.equal(spine.snapBuckets[0]!.status, 'pending')
    assert.equal(spine.snapBuckets[0]!.lastStallReason, 'snap peer left')
    const message = spine.diagnosticRingBuffer.at(-1)?.message ?? ''
    assert.match(message, /Bucket 0x0: snap peer left/)
  })
})
