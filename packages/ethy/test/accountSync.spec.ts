import { RLP } from '@ethereumjs/rlp'
import {
  SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE,
  createFlatStateManager,
} from '@ethereumjs/statemanager'
import { equalsBytes } from '@ethereumjs/util'
import { assert, describe, it, vi } from 'vitest'

import { createSnapBuckets } from '../src/spine/buckets.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { SnapAccountSynchronizer, encodeGetAccountRange } from '../src/sync/accountSync.ts'
import { SnapPeerFlightTracker } from '../src/sync/snapFlight.ts'
import type { SnapTransport } from '../src/sync/snapTransport.ts'
import { SnapVerifyPool } from '../src/sync/snapVerifyWorker.ts'

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
import { verifyAccountRangeJob } from '../src/sync/snapVerifyJob.ts'
import {
  SyntheticSnapPeer,
  incrementKey32,
  ingestAccountRangeReply,
  parseAccountRangeReply,
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

  it('verifyAccountRangeJob() slab matches parseAccountRangeReply rows', async () => {
    const peer = await SyntheticSnapPeer.create(4)
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
    const parsed = parseAccountRangeReply(reply)
    assert.isDefined(parsed)
    assert.isAbove(parsed!.entries.length, 0)
    const verified = await verifyAccountRangeJob({
      stateRoot: peer.rootHash,
      payload: reply,
      origin: bucket.currentLastHash,
    })
    assert.equal(verified.ok, true)
    assert.isDefined(verified.slab)
    assert.equal(verified.count, parsed!.entries.length)
    assert.isDefined(verified.lastKey)
    assert.notEqual(
      verified.lastKey!.buffer,
      parsed!.entries[parsed!.entries.length - 1]!.accountHash.buffer,
    )
    for (let i = 0; i < parsed!.entries.length; i++) {
      const offset = i * SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE
      const row = parsed!.entries[i]!
      assert.ok(
        equalsBytes(verified.slab!.subarray(offset, offset + 32), row.accountHash),
        `account hash row ${i}`,
      )
      assert.ok(
        equalsBytes(
          verified.slab!.subarray(offset + 32, offset + SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE),
          row.binaryAccount,
        ),
        `binary account row ${i}`,
      )
    }
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
          (entries) => sm.putSnapBinaryAccountsBatch(entries),
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
    const peers = [
      {
        id: 'aa11',
        caps: ['eth/72', 'snap/1'],
        snapResponsesOk: 0,
        snapTimeouts: 0,
        avgLatencyMs: 40,
      },
    ]
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

  it('does not re-request a bucket while its range proof is still verifying', async () => {
    const trie = await SyntheticSnapPeer.create(2)
    const spine = createSpine('sepolia', 11155111n)
    spine.pivotStateRoot = trie.rootHash
    const peers = [
      {
        id: 'aa11',
        caps: ['snap/1'],
        snapResponsesOk: 0,
        snapTimeouts: 0,
        avgLatencyMs: 10,
      },
    ]
    const sent: Uint8Array[] = []
    let onRange: (peerId: string, payload: Uint8Array) => void = () => {}
    let release: () => void = () => {}
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    let entered = false
    const inner = new SnapVerifyPool({ inProcess: true })
    const sync = new SnapAccountSynchronizer({
      spine,
      stateManager: createFlatStateManager(),
      transport: mockSnapTransport({
        snapPeers: () => peers,
        onAccountRange(cb) {
          onRange = cb
          return () => {}
        },
        sendAccountRange(_peerId, payload) {
          sent.push(payload)
        },
      }),
      flightTracker: new SnapPeerFlightTracker(),
      getSnapPeers: () => peers,
      verifyPool: {
        verifyAccountRange: async (opts: Parameters<SnapVerifyPool['verifyAccountRange']>[0]) => {
          entered = true
          await gate
          return inner.verifyAccountRange(opts)
        },
        close: async () => {},
      } as unknown as SnapVerifyPool,
    })
    const originOf = (payload: Uint8Array) => {
      const decoded = RLP.decode(payload) as Uint8Array[]
      return Buffer.from(decoded[2]!).toString('hex')
    }
    sync.start()
    assert.equal(sent.length, 1)
    const firstOrigin = originOf(sent[0]!)
    const reply = await trie.buildAccountRangeReply(sent[0]!)
    onRange('aa11', reply)
    await vi.waitFor(() => {
      assert.equal(entered, true)
    })
    await new Promise((resolve) => setTimeout(resolve, 120))
    const sameOrigin = sent.filter((payload) => originOf(payload) === firstOrigin)
    assert.equal(sameOrigin.length, 1)
    release()
    await vi.waitFor(() => {
      assert.isAbove(spine.totalAccountsSynced, 0)
    })
    sync.stop()
    await inner.close()
  })

  it('schedules proven snap peers across stepped pivots and skips only unproven peers lagging >32 blocks', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.pivotStateRoot = new Uint8Array(32).fill(0x11)
    spine.pivotBlockNumber = 12_071_041n

    const peers = [
      // Unproven peer lagging >32 blocks behind pivot -> skipped
      {
        id: 'lagging-unproven',
        caps: ['snap/1'],
        snapResponsesOk: 0,
        snapTimeouts: 0,
        avgLatencyMs: 20,
        latestBlock: 12_070_900n,
      },
      // Proven peer whose latestBlock hasn't received the next 32-block update yet -> scheduled!
      {
        id: 'proven-slightly-behind',
        caps: ['snap/1'],
        snapResponsesOk: 10,
        snapTimeouts: 0,
        avgLatencyMs: 20,
        latestBlock: 12_071_000n,
      },
      // Newly connected snap/1 peer within the 32-block window -> scheduled!
      {
        id: 'new-within-window',
        caps: ['snap/1'],
        snapResponsesOk: 0,
        snapTimeouts: 0,
        avgLatencyMs: 20,
        latestBlock: 12_071_020n,
      },
    ]

    const dispatchedTo: string[] = []
    const sync = new SnapAccountSynchronizer({
      spine,
      stateManager: createFlatStateManager(),
      transport: mockSnapTransport({
        snapPeers: () => peers,
        sendAccountRange(peerId) {
          dispatchedTo.push(peerId)
        },
      }),
      flightTracker: new SnapPeerFlightTracker(),
      getSnapPeers: () => peers,
    })
    sync.start()
    sync.stop()

    assert.isFalse(dispatchedTo.includes('lagging-unproven'))
    assert.isTrue(dispatchedTo.includes('proven-slightly-behind'))
    assert.isTrue(dispatchedTo.includes('new-within-window'))
  })

  it('does not falsely declare snap peer left if a peer stays in spine.peers while temporarily absent from getSnapPeers', async () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.pivotStateRoot = new Uint8Array(32).fill(0x22)
    spine.peers.set('aa11', {
      id: 'aa11',
      clientName: 'Geth/v1',
      caps: ['eth/71', 'snap/1'],
      snapSession: true,
      ethySession: false,
      hasHead: true,
      snapRequestsSent: 0,
      snapResponsesOk: 1,
      snapTimeouts: 0,
      avgLatencyMs: 25,
    })
    const peers = [
      {
        id: 'aa11',
        caps: ['eth/71', 'snap/1'],
        snapResponsesOk: 1,
        snapTimeouts: 0,
        avgLatencyMs: 25,
      },
    ]
    let sent = 0
    const sync = new SnapAccountSynchronizer({
      spine,
      stateManager: createFlatStateManager(),
      transport: mockSnapTransport({
        snapPeers: () => peers,
        sendAccountRange() {
          sent++
        },
      }),
      flightTracker: new SnapPeerFlightTracker(),
      getSnapPeers: () => peers,
    })
    sync.start()
    assert.equal(sent, 1)
    assert.equal(spine.snapBuckets[0]!.status, 'syncing')
    // Temporarily remove from getSnapPeers while still present in spine.peers
    peers.pop()
    await new Promise((resolve) => setTimeout(resolve, 120))
    assert.equal(spine.snapBuckets[0]!.status, 'syncing')
    assert.notEqual(spine.snapBuckets[0]!.lastStallReason, 'snap peer left')
    // Now actually remove from spine.peers
    spine.peers.delete('aa11')
    await new Promise((resolve) => setTimeout(resolve, 120))
    sync.stop()
    assert.equal(spine.snapBuckets[0]!.status, 'pending')
    assert.equal(spine.snapBuckets[0]!.lastStallReason, 'snap peer left')
  })
})
