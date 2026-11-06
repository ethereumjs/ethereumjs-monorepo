import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { bigIntToUnpaddedBytes, bytesToUnprefixedHex } from '@ethereumjs/util'
import { assert, describe, it, vi } from 'vitest'

import { PeerBookStore } from '../src/persist/peerBook.ts'
import {
  FULL_BUCKET_SPAN_36,
  bucketCursorFraction,
  computeSnapProgressPct,
  createSnapBuckets,
  cursorSpan36,
  ensureBucketSubRanges,
  newPrefixCursor,
} from '../src/spine/buckets.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import type { PeerTelemetry } from '../src/spine/types.ts'
import { SnapAccountSynchronizer, encodeGetAccountRange } from '../src/sync/accountSync.ts'
import { SnapPeerFlightTracker } from '../src/sync/snapFlight.ts'
import type { SnapTransport } from '../src/sync/snapTransport.ts'
import { SnapVerifyPool } from '../src/sync/snapVerifyWorker.ts'
import { SyntheticSnapPeer } from '../src/sync/syntheticPeer.ts'

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

function accountRangeRequestId(payload: Uint8Array): bigint {
  const decoded = RLP.decode(payload) as unknown[]
  const id = decoded[0]
  if (!(id instanceof Uint8Array)) return 0n
  if (id.length === 0) return 0n
  return BigInt('0x' + Buffer.from(id).toString('hex'))
}

function eligibleSnapSchedulePeers(peers: Iterable<PeerTelemetry>) {
  return [...peers].filter((p) => p.snapSession === true && p.hasHead === true)
}

describe('[Ethy/Sync]: multi-peer swarm (WP-04f)', () => {
  it('quarantines empty-reply peer without stalling buckets for a healthy peer', async () => {
    const trie = await SyntheticSnapPeer.create(8)
    trie.faultedBucket3 = true
    const spine = createSpine('sepolia', 11155111n)
    spine.pivotStateRoot = trie.rootHash
    const peerA = {
      id: 'aa'.repeat(32),
      caps: ['snap/1'],
      snapResponsesOk: 1,
      snapTimeouts: 0,
      avgLatencyMs: 10,
    }
    const peerB = {
      id: 'bb'.repeat(32),
      caps: ['snap/1'],
      snapResponsesOk: 0,
      snapTimeouts: 0,
      avgLatencyMs: 10,
    }
    spine.peers.set(peerA.id, {
      id: peerA.id,
      clientName: 'geth',
      caps: peerA.caps,
      snapResponsesOk: 1,
      snapTimeouts: 0,
      avgLatencyMs: 10,
      snapRequestsSent: 0,
    })
    spine.peers.set(peerB.id, {
      id: peerB.id,
      clientName: 'geth',
      caps: peerB.caps,
      snapResponsesOk: 0,
      snapTimeouts: 0,
      avgLatencyMs: 10,
      snapRequestsSent: 0,
    })
    let onRange: (peerId: string, payload: Uint8Array) => void = () => {}
    const roster: Array<typeof peerA> = [peerA, peerB]
    const sync = new SnapAccountSynchronizer({
      spine,
      stateManager: createFlatStateManager(),
      transport: mockSnapTransport({
        onAccountRange(cb) {
          onRange = cb
          return () => {}
        },
        sendAccountRange(peerId, payload) {
          if (peerId === peerB.id) {
            const reqId = accountRangeRequestId(payload)
            onRange(peerB.id, RLP.encode([bigIntReqId(reqId), [], []] as never))
            return
          }
          void trie.buildAccountRangeReply(payload).then((reply) => onRange(peerA.id, reply))
        },
      }),
      flightTracker: new SnapPeerFlightTracker(),
      getSnapPeers: () => roster,
      verifyPool: new SnapVerifyPool({ inProcess: true }),
    })
    sync.start()
    await vi.waitFor(
      () => {
        assert.isAtLeast(spine.totalAccountsSynced, 8)
      },
      { timeout: 8_000 },
    )
    await vi.waitFor(
      () => {
        assert.isAtLeast(spine.peers.get(peerB.id)?.snapTimeouts ?? 0, 1)
        const stalled = spine.snapBuckets.filter((b) => b.status === 'stalled').length
        assert.isBelow(stalled, spine.snapBuckets.length)
        assert.isAtLeast(spine.totalAccountsSynced, 8)
      },
      { timeout: 8_000 },
    )
    sync.stop()
  }, 20_000)

  it('keeps bucketCursorFraction monotonic when a bucket splits into sub-ranges', () => {
    const bucket = createSnapBuckets()[0]!
    const before = bucketCursorFraction(bucket)
    const mid = new Uint8Array(bucket.limitHash)
    mid[1] = 0x80
    const left = ensureBucketSubRanges(bucket)[0]!
    left.limit = new Uint8Array(mid)
    const rightOrigin = new Uint8Array(mid)
    rightOrigin[1] = 0x81
    bucket.subRanges!.push(newPrefixCursor(0, rightOrigin, bucket.limitHash, 999))
    const after = bucketCursorFraction(bucket)
    assert.isAtLeast(after, before)
    assert.approximately(
      cursorSpan36(left) + cursorSpan36(bucket.subRanges![1]!),
      FULL_BUCKET_SPAN_36 - 1,
      FULL_BUCKET_SPAN_36,
    )
  })

  it('keeps bucketCursorFraction and computeSnapProgressPct monotonic across sub-nibbles', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhaseSnap(spine)
    const b = spine.snapBuckets[0]!
    const mk = (b0: number, b1 = 0, b2 = 0, b3 = 0) => {
      const h = new Uint8Array(32)
      h[0] = b0
      h[1] = b1
      h[2] = b2
      h[3] = b3
      return h
    }
    const cursors = [mk(0x00), mk(0x08), mk(0x0f, 0xff, 0xff, 0xff)]
    let lastFrac = -1
    let lastPct = -1
    for (const cur of cursors) {
      b.currentLastHash = cur
      b.subRanges![0]!.origin = new Uint8Array(cur)
      const frac = bucketCursorFraction(b)
      const pct = computeSnapProgressPct(spine)
      assert.isAtLeast(frac, lastFrac)
      assert.isAtLeast(pct, lastPct)
      lastFrac = frac
      lastPct = pct
    }
  })

  it('vipDialCandidates rotates after TOO_MANY_PEERS and dial holds', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-swarm-'))
    const book = PeerBookStore.open({
      dataDir: dir,
      network: 'sepolia',
      expectedForkHash: '0xabc',
      enabled: true,
    })
    const now = 2_000_000
    const ids = Array.from({ length: 12 }, (_, i) =>
      (i + 1).toString(16).padStart(2, '0').repeat(32),
    )
    for (let i = 0; i < 12; i++) {
      book.putRow({
        id: ids[i]!,
        address: `10.0.0.${i + 1}`,
        udpPort: 30303,
        tcpPort: 30303,
        snapResponsesOk: 1,
        snapTimeouts: 0,
        dialAfter: 0,
        resetStreak: 0,
        clientFamily: i < 6 ? 'Geth' : 'Nethermind',
        lastSnapSuccessAt: now - i,
      })
    }
    for (let i = 0; i < 4; i++) {
      book.noteDisconnect(ids[i]!, 'TOO_MANY_PEERS', now)
    }
    const first = book.vipDialCandidates(now + 1, 8)
    assert.isAtLeast(first.length, 2)
    for (const p of first) {
      const id = bytesToUnprefixedHex(p.id as Uint8Array)
      book.noteDialAttempt(id, now + 1)
    }
    const second = book.vipDialCandidates(now + 2, 8)
    for (const p of second) {
      const id = bytesToUnprefixedHex(p.id as Uint8Array)
      assert.isFalse(first.some((f) => bytesToUnprefixedHex(f.id as Uint8Array) === id))
    }
  })

  it('requires ETH STATUS (hasHead) before snap scheduling peers qualify', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.peers.set('aa', {
      id: 'aa',
      clientName: 'geth',
      caps: ['snap/1'],
      snapSession: true,
      hasHead: false,
      snapRequestsSent: 0,
      snapResponsesOk: 0,
      snapTimeouts: 0,
      avgLatencyMs: 0,
    })
    assert.equal(eligibleSnapSchedulePeers(spine.peers.values()).length, 0)
    spine.peers.get('aa')!.hasHead = true
    assert.equal(eligibleSnapSchedulePeers(spine.peers.values()).length, 1)
  })

  it('schedules account ranges across three proven peers concurrently', async () => {
    const trie = await SyntheticSnapPeer.create(6)
    const spine = createSpine('sepolia', 11155111n)
    spine.pivotStateRoot = trie.rootHash
    const peers = ['11', '22', '33'].map((n) => ({
      id: n.repeat(32),
      caps: ['snap/1'],
      snapResponsesOk: 4,
      snapTimeouts: 0,
      avgLatencyMs: 15,
    }))
    const sends = new Map<string, number>()
    let onRange: (peerId: string, payload: Uint8Array) => void = () => {}
    const sync = new SnapAccountSynchronizer({
      spine,
      stateManager: createFlatStateManager(),
      transport: mockSnapTransport({
        onAccountRange(cb) {
          onRange = cb
          return () => {}
        },
        sendAccountRange(peerId, payload) {
          sends.set(peerId, (sends.get(peerId) ?? 0) + 1)
          void trie.buildAccountRangeReply(payload).then((reply) => onRange(peerId, reply))
        },
      }),
      flightTracker: new SnapPeerFlightTracker(),
      getSnapPeers: () => peers,
      verifyPool: new SnapVerifyPool({ inProcess: true }),
    })
    sync.start()
    await vi.waitFor(
      () => {
        assert.isAtLeast(
          [...sends.values()].reduce((a, b) => a + b, 0),
          6,
        )
      },
      { timeout: 8_000 },
    )
    assert.isAtLeast(sends.size, 2)
    sync.stop()
  }, 15_000)

  it('fills more than 16 concurrent range slots across eight proven peers without duplicate origins', async () => {
    const accountsPerBucket = 10
    const accountCount = accountsPerBucket * 16
    const trie = await SyntheticSnapPeer.create(accountsPerBucket)
    const spine = createSpine('sepolia', 11155111n)
    spine.pivotStateRoot = trie.rootHash
    const peers = Array.from({ length: 8 }, (_, i) => ({
      id: (i + 1).toString(16).padStart(2, '0').repeat(32),
      caps: ['snap/1'],
      snapResponsesOk: 4,
      snapTimeouts: 0,
      avgLatencyMs: 5 + i,
    }))
    const origins: Array<{ peerId: string; origin: string }> = []
    let onRange: (peerId: string, payload: Uint8Array) => void = () => {}
    let releaseReplies = false
    const pendingReplies: Array<{ peerId: string; payload: Uint8Array }> = []
    const sync = new SnapAccountSynchronizer({
      spine,
      stateManager: createFlatStateManager(),
      transport: mockSnapTransport({
        onAccountRange(cb) {
          onRange = cb
          return () => {}
        },
        sendAccountRange(peerId, payload) {
          const decoded = RLP.decode(payload) as unknown[]
          const origin = decoded[2] as Uint8Array
          origins.push({ peerId, origin: Buffer.from(origin).toString('hex') })
          if (releaseReplies) {
            void trie.buildAccountRangeReply(payload).then((reply) => onRange(peerId, reply))
          } else {
            pendingReplies.push({ peerId, payload })
          }
        },
      }),
      flightTracker: new SnapPeerFlightTracker(),
      getSnapPeers: () => peers,
      verifyPool: new SnapVerifyPool({ inProcess: true }),
    })
    sync.start()
    await vi.waitFor(
      () => {
        assert.isAbove(origins.length, 16)
      },
      { timeout: 3_000 },
    )
    const uniquePeers = new Set(origins.map((o) => o.peerId))
    assert.equal(uniquePeers.size, 8)
    const uniqueOrigins = new Set(origins.map((o) => o.origin))
    assert.equal(uniqueOrigins.size, origins.length)
    releaseReplies = true
    for (const pending of pendingReplies) {
      const reply = await trie.buildAccountRangeReply(pending.payload)
      onRange(pending.peerId, reply)
      await new Promise((resolve) => setTimeout(resolve, 5))
    }
    await vi.waitFor(
      () => {
        assert.equal(spine.totalAccountsSynced, accountCount)
      },
      { timeout: 45_000 },
    )
    sync.stop()
  }, 90_000)
})

function setPhaseSnap(spine: ReturnType<typeof createSpine>): void {
  spine.phase = 'SNAP_SYNCING'
  spine.snapBuckets = createSnapBuckets()
}

function bigIntReqId(reqId: bigint): Uint8Array {
  return bigIntToUnpaddedBytes(reqId)
}
