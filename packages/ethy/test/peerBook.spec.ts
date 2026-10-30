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
})
