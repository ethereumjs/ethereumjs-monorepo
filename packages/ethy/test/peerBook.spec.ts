import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { assert, describe, it } from 'vitest'

import { createEthyNode } from '../src/core/createEthyNode.ts'
import {
  PEER_FRESH_STATUS_WINDOW_MS,
  PEER_SNAP_TIER_FRESH_MS,
  PEER_STALE_SUCCESS_MS,
  PEER_TOO_MANY_PEERS_HOLD_MAX_MS,
  type PeerBookRow,
  PeerBookStore,
  peerBookFilePath,
  rankPeerRows,
  timeoutHoldMs,
  tooManyPeersHoldMs,
} from '../src/persist/peerBook.ts'

function tempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-peers-'))
}

function sampleRow(overrides: Partial<PeerBookRow> & Pick<PeerBookRow, 'id'>): PeerBookRow {
  return {
    address: '203.0.113.10',
    udpPort: 30303,
    tcpPort: 30303,
    snapResponsesOk: 0,
    snapTimeouts: 0,
    dialAfter: 0,
    resetStreak: 0,
    ...overrides,
  }
}

function openBook(dir: string, enabled = true): PeerBookStore {
  return PeerBookStore.open({
    dataDir: dir,
    network: 'sepolia',
    expectedForkHash: '0xabc',
    enabled,
  })
}

describe('[Ethy/Persist]: peer book', () => {
  it('ranks snap success ahead of STATUS-only', () => {
    const now = Date.now()
    const statusOnly = sampleRow({
      id: 'aa',
      lastStatusAt: now,
    })
    const snapPeer = sampleRow({
      id: 'bb',
      lastStatusAt: now - 1000,
      lastSnapSuccessAt: now - 2000,
      snapResponsesOk: 2,
    })
    const ranked = rankPeerRows([statusOnly, snapPeer], now)
    assert.equal(ranked[0]!.id, 'bb')
  })

  it('skips rows until dial-after', () => {
    const now = 1_000_000
    const cooled = sampleRow({
      id: 'cc',
      lastStatusAt: now - 100,
      dialAfter: now + tooManyPeersHoldMs(false, 0),
    })
    const ready = sampleRow({
      id: 'dd',
      lastStatusAt: now - 100,
    })
    const ranked = rankPeerRows([cooled, ready], now)
    assert.equal(ranked.length, 1)
    assert.equal(ranked[0]!.id, 'dd')
  })

  it('drops fork mismatch on start', () => {
    const dir = tempDir()
    const book = openBook(dir)
    book.putRow(
      sampleRow({
        id: 'ee',
        lastStatusAt: Date.now(),
        forkHash: '0xdead',
      }),
    )
    const reopened = openBook(dir)
    reopened.pruneOnStart(Date.now())
    assert.equal(reopened.getRow('ee'), undefined)
  })

  it('round-trips id and endpoint through disk', () => {
    const dir = tempDir()
    const id = '0f'.repeat(32)
    const book = openBook(dir)
    book.putRow(
      sampleRow({
        id,
        address: '198.51.100.4',
        udpPort: 30304,
        tcpPort: 30305,
        lastSnapSuccessAt: Date.now(),
      }),
    )
    const raw = JSON.parse(fs.readFileSync(peerBookFilePath(dir, 'sepolia'), 'utf8')) as Record<
      string,
      PeerBookRow
    >
    assert.equal(raw[id.toLowerCase()]!.tcpPort, 30305)

    const again = openBook(dir)
    const row = again.getRow(id)
    assert.equal(row?.address, '198.51.100.4')
    assert.equal(row?.id, id.toLowerCase())
  })

  it('demo mode does not write the book', () => {
    const dir = tempDir()
    const node = createEthyNode({
      network: 'sepolia',
      chainId: 11155111n,
      demo: true,
      dataDir: dir,
    })
    node.peerBook?.noteTelemetryPeer(
      {
        id: '11'.repeat(32),
        clientId: 'Geth/v1',
        caps: ['eth/69'],
        bestHash: '0x' + '22'.repeat(32),
        address: '203.0.113.1',
        tcpPort: 30303,
        udpPort: 30303,
      },
      Date.now(),
    )
    assert.equal(fs.existsSync(peerBookFilePath(dir, 'sepolia')), false)
  })

  it('prunes rows with no recent success on start', () => {
    const dir = tempDir()
    const book = openBook(dir)
    book.putRow(
      sampleRow({
        id: 'ff',
        lastStatusAt: Date.now() - PEER_STALE_SUCCESS_MS - 1,
      }),
    )
    const reopened = openBook(dir)
    reopened.pruneOnStart(Date.now())
    assert.equal(reopened.getRow('ff'), undefined)
  })

  it('does not poison snapCapable=false on pre-HELLO telemetry and self-heals poisoned rows from disk', () => {
    const dir = tempDir()
    const book = openBook(dir)
    const now = Date.now()
    const id = 'a1'.repeat(32)

    // Pre-HELLO telemetry (clientId === '', snapSession === false) must not mark snapCapable=false
    book.noteTelemetryPeer(
      {
        id,
        clientId: '',
        caps: [],
        snapSession: false,
        address: '203.0.113.50',
        tcpPort: 30303,
        udpPort: 30303,
      },
      now,
    )
    assert.equal(book.getRow(id)?.snapCapable, undefined)

    // Write a row with snapCapable=false and lastStatusAt=0 (poisoned before HELLO/STATUS)
    fs.mkdirSync(path.dirname(peerBookFilePath(dir, 'sepolia')), { recursive: true })
    fs.writeFileSync(
      peerBookFilePath(dir, 'sepolia'),
      JSON.stringify({
        [id]: {
          id,
          address: '203.0.113.50',
          udpPort: 30303,
          tcpPort: 30303,
          snapResponsesOk: 0,
          snapTimeouts: 0,
          dialAfter: 0,
          resetStreak: 0,
          snapCapable: false,
        },
      }),
    )
    const reopened = openBook(dir)
    assert.equal(reopened.getRow(id)?.snapCapable, undefined)
  })

  it('excludes reth without proven snap and marks snapCapable false after repeated timeouts', () => {
    const dir = tempDir()
    const book = openBook(dir)
    const now = 1_000_000
    const rethId = 'd4'.repeat(32)
    book.putRow(
      sampleRow({
        id: rethId,
        clientFamily: 'Reth',
        lastStatusAt: now,
        snapCapable: true,
      }),
    )
    assert.equal(book.dialCandidates(now).length, 0)
    book.putRow(
      sampleRow({
        id: rethId,
        clientFamily: 'Reth',
        lastStatusAt: now,
        lastSnapSuccessAt: now,
        snapResponsesOk: 1,
        snapCapable: true,
      }),
    )
    assert.equal(book.dialCandidates(now).length, 1)

    const besuId = 'e5'.repeat(32)
    book.putRow(
      sampleRow({
        id: besuId,
        clientFamily: 'Besu',
        lastStatusAt: now,
        snapCapable: true,
      }),
    )
    book.noteSnapTimeout(besuId)
    book.noteSnapTimeout(besuId)
    assert.equal(book.getRow(besuId)?.snapCapable, false)
  })

  it('excludes non-snap client families and clears dialAfter on proven snap peers at startup', () => {
    const dir = tempDir()
    const book = openBook(dir)
    const now = 1_000_000
    const nonSnapId = 'b2'.repeat(32)
    const provenSnapId = 'c3'.repeat(32)
    book.putRow(
      sampleRow({
        id: nonSnapId,
        clientFamily: 'eri' + 'gon',
        lastStatusAt: now,
        snapCapable: true,
      }),
    )
    book.putRow(
      sampleRow({
        id: provenSnapId,
        clientFamily: 'Nethermind',
        lastStatusAt: now,
        lastSnapSuccessAt: now,
        snapResponsesOk: 50,
        dialAfter: now + 60_000,
        snapCapable: true,
      }),
    )
    book.pruneOnStart(now)
    assert.equal(book.getRow(provenSnapId)?.dialAfter, 0)
    const candidates = book.dialCandidates(now)
    assert.equal(candidates.length, 1)
  })

  it('never deletes proven or snapCapable VIP peers on repeated ECONNRESET and retains HELLO-proven snapCapable peers across pruneOnStart', () => {
    const dir = tempDir()
    const book = openBook(dir)
    const now = 1_000_000
    const vipId = 'f1'.repeat(32)
    const helloSnapId = 'f2'.repeat(32)

    book.putRow(
      sampleRow({
        id: vipId,
        clientFamily: 'Nethermind',
        lastStatusAt: now,
        lastSnapSuccessAt: now,
        snapResponsesOk: 500,
        snapCapable: true,
      }),
    )
    book.putRow(
      sampleRow({
        id: helloSnapId,
        clientFamily: 'Nethermind',
        snapCapable: true,
        tooManyPeersStreak: 15,
      }),
    )

    // 5 consecutive TCP resets must apply backoff, never delete the VIP peer!
    for (let i = 0; i < 5; i++) {
      book.noteDisconnect(vipId, 'Remote 1.2.3.4:30303: peer unreachable (ECONNRESET)', now + i)
    }
    const survived = book.getRow(vipId)
    assert.isDefined(survived)
    assert.equal(survived?.snapResponsesOk, 500)
    assert.isAbove(survived!.dialAfter, now)

    // noteSnapSuccess resets resetStreak and dialAfter
    book.noteSnapSuccess(vipId, now + 100)
    assert.equal(book.getRow(vipId)?.resetStreak, 0)
    assert.equal(book.getRow(vipId)?.dialAfter, 0)

    // pruneOnStart keeps helloSnapId (Tier 1 snapCapable) and resets tooManyPeersStreak
    book.pruneOnStart(now + 200)
    assert.isDefined(book.getRow(helloSnapId))
    assert.equal(book.getRow(helloSnapId)?.tooManyPeersStreak, 0)
    assert.equal(book.vipDialCandidates(now + 200, 10).length, 2)
  })

  it('backs off dead VIP peers exponentially on Connection timeout and demotes them behind live peers', () => {
    const dir = tempDir()
    const book = openBook(dir)
    const now = 2_000_000
    const deadVip = 'aa'.repeat(32)
    const liveVip = 'bb'.repeat(32)
    const unproven = 'cc'.repeat(32)

    assert.equal(timeoutHoldMs(0), 30_000)
    assert.equal(timeoutHoldMs(1), 60_000)
    assert.equal(timeoutHoldMs(2), 120_000)
    assert.equal(timeoutHoldMs(3), PEER_TOO_MANY_PEERS_HOLD_MAX_MS)

    book.putRow(
      sampleRow({
        id: deadVip,
        clientFamily: 'Nethermind',
        lastStatusAt: now - 10_000,
        lastSnapSuccessAt: now - 10_000,
        snapResponsesOk: 25_000,
        snapCapable: true,
      }),
    )
    book.putRow(
      sampleRow({
        id: liveVip,
        clientFamily: 'Nethermind',
        lastStatusAt: now - 10_000,
        lastSnapSuccessAt: now - 10_000,
        snapResponsesOk: 100,
        snapCapable: true,
      }),
    )
    book.putRow(
      sampleRow({
        id: unproven,
        lastStatusAt: now - 10_000,
        snapResponsesOk: 0,
      }),
    )

    // Before timeout, deadVip ranks #1 because of 25k snapResponsesOk
    assert.equal((book.vipDialCandidates(now, 10)[0]!.id as Uint8Array)[0], 0xaa)

    // First Connection timeout backs deadVip off by 30s and bumps resetStreak
    book.noteDisconnect(deadVip, 'Connection timeout', now)
    assert.equal(book.getRow(deadVip)?.resetStreak, 1)
    assert.equal(book.getRow(deadVip)?.dialAfter, now + 30_000)
    // liveVip is now dialed first instead of hammering deadVip
    assert.equal((book.vipDialCandidates(now + 1_000, 10)[0]!.id as Uint8Array)[0], 0xbb)

    // After backoff expires, deadVip still ranks behind liveVip due to resetStreak penalty
    assert.equal((book.vipDialCandidates(now + 35_000, 10)[0]!.id as Uint8Array)[0], 0xbb)

    // 4th consecutive timeout hits the full 5-minute cap without deleting proven VIP peer
    book.noteDisconnect(deadVip, 'Connection timeout', now + 40_000)
    book.noteDisconnect(deadVip, 'Connection timeout', now + 110_000)
    book.noteDisconnect(deadVip, 'Connection timeout', now + 240_000)
    assert.isDefined(book.getRow(deadVip))
    assert.equal(book.getRow(deadVip)?.dialAfter, now + 240_000 + PEER_TOO_MANY_PEERS_HOLD_MAX_MS)

    // Unproven non-snap peer is removed after 3 consecutive Connection timeouts
    book.noteDisconnect(unproven, 'Connection timeout', now)
    book.noteDisconnect(unproven, 'Connection timeout', now + 35_000)
    book.noteDisconnect(unproven, 'Connection timeout', now + 100_000)
    assert.isUndefined(book.getRow(unproven))
  })

  it('ranks recently active STATUS peers ahead of multi-day stale SNAP peers', () => {
    const now = 10_000_000_000
    const staleSnapPeer = sampleRow({
      id: '11'.repeat(32),
      clientFamily: 'Nethermind',
      lastSnapSuccessAt: now - PEER_SNAP_TIER_FRESH_MS - 60_000,
      lastStatusAt: now - PEER_FRESH_STATUS_WINDOW_MS - 60_000,
      snapResponsesOk: 12_000,
      snapCapable: true,
    })
    const recentLivePeer = sampleRow({
      id: '22'.repeat(32),
      clientFamily: 'Geth',
      lastStatusAt: now - 3_600_000,
      snapResponsesOk: 0,
      snapCapable: true,
    })
    const ranked = rankPeerRows([staleSnapPeer, recentLivePeer], now)
    assert.equal(ranked[0]!.id, recentLivePeer.id)
    assert.equal(ranked[1]!.id, staleSnapPeer.id)
  })

  it('does not poison snapCapable=false when local profile omits snap1 and redials ETH-only peers when requireSnap is false', () => {
    const dir = tempDir()
    const book = openBook(dir)
    const now = 5_000_000
    const ethOnlyId = '77'.repeat(32)

    // When WP-13 turns snap off in live-calm / bal-catchup, snapSession is false because WE omitted snap1.
    book.noteTelemetryPeer(
      {
        id: ethOnlyId,
        clientId: 'Geth/v1.17.9',
        caps: ['eth/72'],
        bestHash: '0x' + '33'.repeat(32),
        snapSession: false,
        address: '203.0.113.77',
        tcpPort: 30303,
        udpPort: 30303,
      },
      now,
      { localSnapAdvertised: false },
    )
    assert.equal(book.getRow(ethOnlyId)?.snapCapable, undefined)
    assert.equal(book.dialCandidates(now, 10, { requireSnap: true }).length, 1)

    // Even if a peer genuinely lacks snap1, BAL_CATCHUP / HEAD_FOLLOWING (requireSnap: false) still redials it.
    book.noteTelemetryPeer(
      {
        id: ethOnlyId,
        clientId: 'Geth/v1.17.9',
        caps: ['eth/72'],
        bestHash: '0x' + '33'.repeat(32),
        snapSession: false,
        address: '203.0.113.77',
        tcpPort: 30303,
        udpPort: 30303,
      },
      now + 1000,
      { localSnapAdvertised: true },
    )
    assert.equal(book.getRow(ethOnlyId)?.snapCapable, false)
    assert.equal(book.dialCandidates(now + 1000, 10, { requireSnap: true }).length, 0)
    assert.equal(book.dialCandidates(now + 1000, 10, { requireSnap: false }).length, 1)
  })
})
