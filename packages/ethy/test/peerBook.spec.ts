import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { assert, describe, it } from 'vitest'

import { createEthyNode } from '../src/core/createEthyNode.ts'
import {
  PEER_STALE_SUCCESS_MS,
  type PeerBookRow,
  PeerBookStore,
  peerBookFilePath,
  rankPeerRows,
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
})
