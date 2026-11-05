import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { EthMessageCodes } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { bytesToUnprefixedHex, intToUnpaddedBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { chainConfigForNetwork } from '../src/net/chainHardfork.ts'
import {
  VIP_SNAP_PEER_TARGET,
  countSnapPeersTowardVipTarget,
  shouldVipReconnect,
  wantSnapDiscoveryHold,
} from '../src/net/discoveryHold.ts'
import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import {
  PEER_BOOK_STARTUP_DIALS,
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
import {
  MAX_BAL_BRIDGE_BLOCKS,
  SNAP_RESUME_MAX_GAP,
  SNAP_UNSERVED_PIVOT_MS,
  decideSnapResume,
  shouldDeferLivePivotRequest,
  shouldEnsureSnapSync,
  shouldRefreshStaleSnapPivot,
} from '../src/sync/resumePolicy.ts'
import { PROVEN_PEER_REST_MS, peerRestMsForRangeFailure } from '../src/sync/snapSchedulePolicy.ts'

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
  it('wantSnapDiscoveryHold hysteresis for multi-peer snap', () => {
    assert.equal(wantSnapDiscoveryHold({ snapSessions: 0, servingSnapPeers: 0, held: true }), false)
    assert.equal(
      wantSnapDiscoveryHold({ snapSessions: 1, servingSnapPeers: 0, held: false }),
      false,
    )
    assert.equal(
      wantSnapDiscoveryHold({ snapSessions: 1, servingSnapPeers: 1, held: false }),
      false,
    )
    assert.equal(wantSnapDiscoveryHold({ snapSessions: 4, servingSnapPeers: 4, held: false }), true)
    assert.equal(wantSnapDiscoveryHold({ snapSessions: 3, servingSnapPeers: 2, held: true }), true)
    assert.equal(wantSnapDiscoveryHold({ snapSessions: 3, servingSnapPeers: 1, held: true }), false)
  })

  it('shouldVipReconnect dials below VIP_SNAP_PEER_TARGET even when discovery is held', () => {
    assert.equal(VIP_SNAP_PEER_TARGET, 10)
    assert.isTrue(shouldVipReconnect({ snapPeersTowardTarget: 1 }))
    assert.isFalse(shouldVipReconnect({ snapPeersTowardTarget: 10 }))
    assert.equal(
      countSnapPeersTowardVipTarget([
        { snapSession: true, snapResponsesOk: 0 },
        { snapSession: true, snapResponsesOk: 2 },
        { snapSession: false, snapResponsesOk: 2 },
      ]),
      1,
    )
  })

  it('shouldEnsureSnapSync blocks sync until disk hydrate', () => {
    const root = new Uint8Array(32)
    assert.isFalse(
      shouldEnsureSnapSync({ pivotStateRoot: root, diskHydrated: false, handoffCatchup: false }),
    )
    assert.isTrue(
      shouldEnsureSnapSync({ pivotStateRoot: root, diskHydrated: true, handoffCatchup: false }),
    )
  })

  it('PEER_BOOK_STARTUP_DIALS is 6 for warm restarts', () => {
    assert.equal(PEER_BOOK_STARTUP_DIALS, 6)
  })

  it('peerRestMsForRangeFailure drops a below-origin page without resting the peer', () => {
    const unproven = {
      id: 'aa',
      caps: ['snap/1'],
      snapResponsesOk: 0,
      snapTimeouts: 0,
      avgLatencyMs: 0,
    }
    assert.equal(
      peerRestMsForRangeFailure('peer returned accounts below request origin', unproven, 0),
      undefined,
    )
    assert.equal(
      peerRestMsForRangeFailure('firstKey should be less than lastKey', unproven, 0),
      PROVEN_PEER_REST_MS,
    )
    assert.equal(peerRestMsForRangeFailure('account range timed out', unproven, 0), undefined)
    assert.equal(
      peerRestMsForRangeFailure('empty account range without proof', unproven, 1),
      30_000,
    )
  })

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
      'bridge-pivot',
    )
    assert.equal(
      decideSnapResume({
        fresh: false,
        saved: { pivotBlockNumber: 50n, baseSyncComplete: false, bucketsDoneCount: 0 },
        head: 50n + MAX_BAL_BRIDGE_BLOCKS + 1n,
      }),
      'reset-stale',
    )
    assert.equal(
      decideSnapResume({
        fresh: false,
        saved: { pivotBlockNumber: 50n, baseSyncComplete: false, bucketsDoneCount: 0 },
        head: 50n + 1_000n,
        ethyBalTail: true,
      }),
      'bridge-pivot',
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

  it('shouldRefreshStaleSnapPivot replaces a far pivot that nobody is serving', () => {
    const pivot = 100n
    const bridgeHead = pivot + SNAP_RESUME_MAX_GAP + 1n
    const staleHead = pivot + MAX_BAL_BRIDGE_BLOCKS + 1n
    assert.isFalse(
      shouldRefreshStaleSnapPivot({
        phase: 'SNAP_SYNCING',
        handoffCatchup: false,
        pivotBridging: true,
        pivotBlock: pivot,
        headBlock: staleHead,
        servingSnapPeers: 0,
        msSinceProgress: SNAP_UNSERVED_PIVOT_MS,
        msSinceBalProgress: SNAP_UNSERVED_PIVOT_MS,
      }),
    )
    assert.isFalse(
      shouldRefreshStaleSnapPivot({
        phase: 'SNAP_SYNCING',
        handoffCatchup: false,
        pivotBridging: false,
        pivotBlock: pivot,
        headBlock: bridgeHead,
        servingSnapPeers: 0,
        msSinceProgress: SNAP_UNSERVED_PIVOT_MS,
        msSinceBalProgress: SNAP_UNSERVED_PIVOT_MS,
      }),
    )
    assert.isTrue(
      shouldRefreshStaleSnapPivot({
        phase: 'SNAP_SYNCING',
        handoffCatchup: false,
        pivotBridging: false,
        pivotBlock: pivot,
        headBlock: staleHead,
        servingSnapPeers: 0,
        msSinceProgress: SNAP_UNSERVED_PIVOT_MS,
        msSinceBalProgress: SNAP_UNSERVED_PIVOT_MS,
      }),
    )
  })

  it('shouldDeferLivePivotRequest waits for disk hydrate before live pivot', () => {
    const saved = { pivotBlockNumber: 50n, baseSyncComplete: false, bucketsDoneCount: 2 }
    assert.isTrue(
      shouldDeferLivePivotRequest({
        fresh: false,
        diskHydrated: false,
        spinePivotBlockNumber: undefined,
        saved,
      }),
    )
    assert.isFalse(
      shouldDeferLivePivotRequest({
        fresh: false,
        diskHydrated: true,
        spinePivotBlockNumber: undefined,
        saved: undefined,
      }),
    )
    assert.isFalse(
      shouldDeferLivePivotRequest({
        fresh: false,
        diskHydrated: true,
        spinePivotBlockNumber: 50n,
        saved,
      }),
    )
    assert.isFalse(
      shouldDeferLivePivotRequest({
        fresh: true,
        diskHydrated: false,
        spinePivotBlockNumber: undefined,
        saved,
      }),
    )
    assert.isFalse(
      shouldDeferLivePivotRequest({
        fresh: false,
        diskHydrated: true,
        spinePivotBlockNumber: undefined,
        saved,
      }),
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

  it('vipDialCandidates fills limit with top Nethermind proven peers without family cap', () => {
    const dir = tempDir()
    const book = PeerBookStore.open({
      dataDir: dir,
      network: 'sepolia',
      expectedForkHash: '0xabc',
      enabled: true,
    })
    const now = Date.now()
    const nmIds = ['01', '02', '03', '04', '05', '06'].map((n) => `${n.repeat(32)}`)
    for (let i = 0; i < 6; i++) {
      book.putRow(
        sampleRow({
          id: nmIds[i]!,
          clientFamily: 'Nethermind',
          lastSnapSuccessAt: now - i,
          snapResponsesOk: 10 - i,
        }),
      )
    }
    for (let i = 0; i < 2; i++) {
      book.putRow(
        sampleRow({
          id: `${(i + 7).toString(16).padStart(2, '0').repeat(32)}`,
          clientFamily: 'Besu',
          lastStatusAt: now,
          snapTimeouts: 4,
          snapResponsesOk: 0,
        }),
      )
    }
    const vips = book.vipDialCandidates(now, 6)
    assert.equal(vips.length, 6)
    for (const p of vips) {
      const id = bytesToUnprefixedHex(p.id as Uint8Array).toLowerCase()
      assert.isTrue(nmIds.some((nm) => nm.toLowerCase() === id))
    }
  })

  it('noteDialAttempt enforces a 20s hold before redial', () => {
    const dir = tempDir()
    const book = PeerBookStore.open({
      dataDir: dir,
      network: 'sepolia',
      expectedForkHash: '0xabc',
      enabled: true,
    })
    const now = 1_000_000
    book.putRow(sampleRow({ id: 'cc'.repeat(32), lastSnapSuccessAt: now, snapResponsesOk: 1 }))
    book.noteDialAttempt('cc'.repeat(32), now)
    const vips = book.vipDialCandidates(now + 1)
    assert.equal(vips.length, 0)
    const later = book.vipDialCandidates(now + 20_001)
    assert.equal(later.length, 1)
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
