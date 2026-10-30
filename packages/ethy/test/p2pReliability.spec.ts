import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { EthMessageCodes } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { bytesToUnprefixedHex, intToUnpaddedBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { chainConfigForNetwork } from '../src/net/chainHardfork.ts'
import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import {
  PEER_TOO_MANY_PEERS_HOLD_MAX_MS,
  PEER_TOO_MANY_PEERS_VIP_CAP_MS,
  type PeerBookRow,
  PeerBookStore,
  peerBookFilePath,
  tooManyPeersHoldMs,
} from '../src/persist/peerBook.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { type InFlightBlockBundle, advanceBlockBundleEthMessage } from '../src/sync/blockBundle.ts'
import { SNAP_RESUME_MAX_GAP, decideSnapResume } from '../src/sync/resumePolicy.ts'

function tempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-p2p-rel-'))
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
    tooManyPeersStreak: 0,
    ...overrides,
  }
}

function openStore(dir: string): SnapPivotStore {
  return SnapPivotStore.open({
    dataDir: dir,
    network: 'sepolia',
    chainId: 11155111n,
    genesisHash: networkGenesisHash('sepolia'),
    enabled: true,
  })
}

describe('[Ethy/P2P]: resume policy', () => {
  it('decideSnapResume covers fresh, gap, and handoff', () => {
    assert.equal(decideSnapResume({ fresh: true, saved: undefined, head: 100n }), 'anchor-fresh')
    assert.equal(
      decideSnapResume({
        fresh: false,
        saved: { pivotBlockNumber: 50n, baseSyncComplete: false, bucketsDoneCount: 3 },
        head: undefined,
      }),
      'wait-for-head',
    )
    assert.equal(
      decideSnapResume({
        fresh: false,
        saved: { pivotBlockNumber: 50n, baseSyncComplete: false, bucketsDoneCount: 8 },
        head: 50n + SNAP_RESUME_MAX_GAP,
      }),
      'resume-snap',
    )
    assert.equal(
      decideSnapResume({
        fresh: false,
        saved: { pivotBlockNumber: 50n, baseSyncComplete: false, bucketsDoneCount: 0 },
        head: 50n + SNAP_RESUME_MAX_GAP + 1n,
      }),
      'reset-stale',
    )
    assert.equal(
      decideSnapResume({
        fresh: false,
        saved: { pivotBlockNumber: 200n, baseSyncComplete: true, bucketsDoneCount: 16 },
        head: 100n,
      }),
      'handoff-catchup',
    )
  })
})

describe('[Ethy/P2P]: bundle message routing', () => {
  it('ignores foreign peer traffic during an in-flight bundle', () => {
    const chain = chainConfigForNetwork('sepolia')
    const bundle: InFlightBlockBundle = {
      peerId: 'aa',
      ethVersion: 71,
      blockNumber: 100n,
      stage: 'headers',
      startedAt: Date.now(),
      headerRequestId: 1,
    }
    const foreign = advanceBlockBundleEthMessage(
      chain,
      bundle,
      { peerId: 'bb', code: EthMessageCodes.BLOCK_HEADERS, payload: new Uint8Array([0x80]) },
      () => {},
    )
    assert.equal(foreign, 'ignore')
    assert.equal(bundle.stage, 'headers')
  })

  it('fails on empty headers from the bundle peer', () => {
    const chain = chainConfigForNetwork('sepolia')
    const bundle: InFlightBlockBundle = {
      peerId: 'aa',
      ethVersion: 71,
      blockNumber: 100n,
      stage: 'headers',
      startedAt: Date.now(),
      headerRequestId: 1,
    }
    const emptyList = RLP.encode([intToUnpaddedBytes(1), []] as never)
    const failed = advanceBlockBundleEthMessage(
      chain,
      bundle,
      { peerId: 'aa', code: EthMessageCodes.BLOCK_HEADERS, payload: emptyList },
      () => {},
    )
    assert.equal(failed, 'failed')
  })
})

describe('[Ethy/Persist]: VIP peer backoff', () => {
  it('tooManyPeersHoldMs escalates VIP peers gently', () => {
    assert.equal(tooManyPeersHoldMs(true, 0), 15_000)
    assert.equal(tooManyPeersHoldMs(true, 1), 30_000)
    assert.equal(tooManyPeersHoldMs(true, 2), 60_000)
    assert.equal(tooManyPeersHoldMs(true, 3), PEER_TOO_MANY_PEERS_VIP_CAP_MS)
    assert.equal(tooManyPeersHoldMs(false, 3), PEER_TOO_MANY_PEERS_HOLD_MAX_MS)
  })

  it('VIP TOO_MANY_PEERS hold is shorter than one hour', () => {
    const dir = tempDir()
    const book = PeerBookStore.open({
      dataDir: dir,
      network: 'sepolia',
      expectedForkHash: '0xabc',
      enabled: true,
    })
    const now = 1_000_000
    book.putRow(
      sampleRow({
        id: '11'.repeat(32),
        lastSnapSuccessAt: now - 1000,
        snapResponsesOk: 2,
      }),
    )
    book.noteDisconnect('11'.repeat(32), 'TOO_MANY_PEERS', now)
    const row = book.getRow('11'.repeat(32))
    assert.ok(row !== undefined)
    assert.equal(row.dialAfter, now + 15_000)
    assert.isBelow(row.dialAfter - now, 60 * 60 * 1000)
  })

  it('vipDialCandidates prefers snap-proven then STATUS-only peers', () => {
    const dir = tempDir()
    const book = PeerBookStore.open({
      dataDir: dir,
      network: 'sepolia',
      expectedForkHash: '0xabc',
      enabled: true,
    })
    const now = Date.now()
    book.putRow(
      sampleRow({
        id: 'aa',
        lastStatusAt: now,
        snapResponsesOk: 0,
      }),
    )
    book.putRow(
      sampleRow({
        id: 'bb',
        lastSnapSuccessAt: now,
        snapResponsesOk: 1,
      }),
    )
    const vips = book.vipDialCandidates(now)
    assert.equal(vips.length, 2)
    const firstId = bytesToUnprefixedHex(vips[0]!.id as Uint8Array).toLowerCase()
    assert.equal(firstId, 'bb')
  })

  it('vipDialCandidates caps at two per family when several families qualify', () => {
    const dir = tempDir()
    const book = PeerBookStore.open({
      dataDir: dir,
      network: 'sepolia',
      expectedForkHash: '0xabc',
      enabled: true,
    })
    const now = Date.now()
    const nmIds = ['01', '02', '03'].map((n) => `${n.repeat(32)}`)
    const gtIds = ['04', '05'].map((n) => `${n.repeat(32)}`)
    for (let i = 0; i < 3; i++) {
      book.putRow(
        sampleRow({
          id: nmIds[i]!,
          clientFamily: 'Nethermind',
          lastSnapSuccessAt: now - i,
          snapResponsesOk: 3 - i,
        }),
      )
    }
    for (let i = 0; i < 2; i++) {
      book.putRow(
        sampleRow({
          id: gtIds[i]!,
          clientFamily: 'Geth',
          lastSnapSuccessAt: now - i,
          snapResponsesOk: 2 - i,
        }),
      )
    }
    const vips = book.vipDialCandidates(now, 8)
    assert.equal(vips.length, 4)
    const picked = new Set(vips.map((p) => bytesToUnprefixedHex(p.id as Uint8Array).toLowerCase()))
    assert.equal(picked.size, 4)
    assert.isFalse(picked.has(nmIds[2]!.toLowerCase()))
    assert.equal([...picked].filter((id) => nmIds.includes(id)).length, 2)
    assert.equal([...picked].filter((id) => gtIds.includes(id)).length, 2)
  })
})

describe('[Ethy/Persist]: fresh pivot wipe', () => {
  it('discardPivots removes active.json but keeps peers.json', () => {
    const dir = tempDir()
    const store = openStore(dir)
    const spine = createSpine('sepolia', 11155111n)
    const sm = createFlatStateManager()
    store.activatePivot({
      blockNumber: 100n,
      blockHash: new Uint8Array(32),
      stateRoot: new Uint8Array(32),
    })
    store.loadInto(spine, sm)
    const book = PeerBookStore.open({
      dataDir: dir,
      network: 'sepolia',
      expectedForkHash: '0xabc',
      enabled: true,
    })
    book.putRow(sampleRow({ id: 'cc', lastStatusAt: Date.now() }))
    store.discardPivots()
    assert.equal(fs.existsSync(path.join(dir, 'networks/sepolia/active.json')), false)
    assert.equal(fs.existsSync(peerBookFilePath(dir, 'sepolia')), true)
  })
})
