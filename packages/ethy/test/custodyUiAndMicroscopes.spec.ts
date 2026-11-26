import { assert, describe, it } from 'vitest'

import { createSpine, setPhase } from '../src/spine/createSpine.ts'
import { ethyOverviewWidget } from '../src/tools/diagnose.ts'
import { machineMicroscopeWidget } from '../src/tools/machineTools.ts'
import { stripAnsi } from '../src/tui/ansi.ts'
import { createInitialViewState } from '../src/tui/prompt.ts'
import { renderFrame } from '../src/tui/renderFrame.ts'

describe('[Ethy/WP-16g]: Custody cockpit and /ethy + /machine microscopes', () => {
  it('renders honest custody stages, 5-plane row, and clean Served spacing in cockpit', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.custodyBuckets = [0x2, 0xa]
    spine.closedBucketsMask = 1 << 0xa
    spine.ethyBucketsBitmask = 1 << 0xa
    spine.custodyBucketSyncPct = { 0x2: 62 }
    spine.lastVerifiedBlockNumber = 8_000_000n
    spine.bestPeerHead = 8_000_000n
    spine.custodyResolve = { local: 94, tombstone: 0, ethyProof: 4, ethyChunk: 2, snap: 0 }
    spine.serving = {
      blocksStored: 64,
      headersServed: 0,
      bodiesServed: 0,
      receiptsServed: 0,
      accessListsServed: 0,
      totalRequestsServed: 12,
      totalBytesServed: 4096,
      ethyChunksServed: 14,
      ethyBalBlocksServed: 1200,
      ethyBytesServed: 4096,
      ethyStorageServed: 0,
      ethyCodesServed: 88,
      ethyWitnessesServed: 42,
    }
    setPhase(spine, 'HEAD_FOLLOWING')
    spine.machine = {
      mode: 'custody-sync',
      modeReason: 'background custody sync',
      nextEventSummary: 'Live',
      planes: { eth: 'active', ethy: 'active', snap: 'off', discovery: 'active', cl: 'active' },
      servingEthy: 'serving',
      ethyDiscoveryTag: true,
      transitions: [],
      vipTarget: 8,
      discoveryMode: 'active',
      desiredEthyBucketsMask: 0x00ff,
      uncoveredBucketsMask: 0x0001,
      hopBuckets: 15,
      snapDormancyReason: 'default-off',
      subtreeApplyMs: 3,
    }

    const view = createInitialViewState()
    const syncFrame = stripAnsi(renderFrame(spine, view, 180, 36).join('\n'))
    assert.include(syncFrame, '★ Live · Custody 1/2 (#2 62%)')
    assert.include(syncFrame, '15/16 1-hop · 94% local · 0 snap')
    assert.include(syncFrame, 'eth ● · ethy ● · snap ○ · disc ● · cl ●')
    assert.include(syncFrame, 'BALs 1,200 · ETHY 42 prf / 14 ch / 88 code')
    const servedLine = syncFrame.split('\n').find((l) => l.includes('Served')) ?? ''
    assert.notInclude(servedLine, '  ·')
    assert.notInclude(servedLine, '  (')

    // Flip to custody-live-calm: first Flat (no trie mask), then Trie ✓
    spine.closedBucketsMask = (1 << 0x2) | (1 << 0xa)
    spine.ethyBucketsBitmask = spine.closedBucketsMask
    spine.machine.mode = 'custody-live-calm'
    spine.machine.hopBuckets = 16
    const flatFrame = stripAnsi(renderFrame(spine, view, 180, 36).join('\n'))
    assert.include(flatFrame, '★ Live · Custody 2/16 (#2,#a · Flat)')

    spine.ethyTrieBucketsBitmask = spine.closedBucketsMask
    const trieFrame = stripAnsi(renderFrame(spine, view, 180, 36).join('\n'))
    assert.include(trieFrame, '★ Live · Custody 2/16 (#2,#a · Trie ✓)')

    // Full 16/16 (Private)
    spine.custodyBuckets = Array.from({ length: 16 }, (_, i) => i)
    spine.closedBucketsMask = 0xffff
    spine.ethyBucketsBitmask = 0xffff
    spine.ethyTrieBucketsBitmask = 0xffff
    const fullFrame = stripAnsi(renderFrame(spine, view, 180, 36).join('\n'))
    assert.include(fullFrame, '★ Live · Full 16/16 (Private)')

    // Rolling BALs during custody-bal-warmup
    setPhase(spine, 'BAL_CATCHUP')
    spine.machine.mode = 'custody-bal-warmup'
    spine.balCatchUp = { fromBlock: 7_996_000n, applied: 3200, total: 4100 }
    const warmupFrame = stripAnsi(renderFrame(spine, view, 180, 36).join('\n'))
    assert.include(warmupFrame, 'Rolling BALs 3,200/4,100')
  })

  it('/ethy renders 16-bucket custody matrix, preface, and debug page', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.custodyBuckets = [0, 8]
    spine.closedBucketsMask = 1 << 0
    spine.ethyBucketsBitmask = 1 << 0
    spine.ethyCodeBucketsBitmask = 1 << 0
    spine.ethyStorageBucketsBitmask = 1 << 0
    spine.ethyTrieBucketsBitmask = 1 << 0
    spine.custodyBucketSyncPct = { 8: 62 }
    spine.custodyLastAssembly = { anchorBlock: '8000032', assembled: true, viaBootstrap: false }
    spine.custodyAssemblyLog = ['#8000032 assembled (16/16 h_b)']
    spine.custodyResolve = { local: 10, tombstone: 2, ethyProof: 3, ethyChunk: 1, snap: 0 }
    spine.peers.set('peer-trie', {
      id: 'peer-trie',
      clientName: 'ethy',
      caps: ['eth71', 'ethy0'],
      ethySession: true,
      ethyStatus: {
        basePivotBlock: '8000000',
        basePivotStateRoot: '0x00',
        bucketsBitmask: '256', // bucket 8
        balEarliestBlock: '7999000',
        balLatestBlock: '8000032',
        latestBlockHash: '0x00',
        storageBucketsBitmask: '256',
        codeBucketsBitmask: '256',
        trieBucketsBitmask: '256',
      },
      snapRequestsSent: 0,
      snapResponsesOk: 0,
      snapTimeouts: 0,
      avgLatencyMs: 20,
    })
    spine.peers.set('peer-flat', {
      id: 'peer-flat',
      clientName: 'ethy',
      caps: ['eth71', 'ethy0'],
      ethySession: true,
      ethyStatus: {
        basePivotBlock: '8000000',
        basePivotStateRoot: '0x00',
        bucketsBitmask: '256', // bucket 8
        balEarliestBlock: '7999000',
        balLatestBlock: '8000032',
        latestBlockHash: '0x00',
        trieBucketsBitmask: '0',
      },
      snapRequestsSent: 0,
      snapResponsesOk: 0,
      snapTimeouts: 0,
      avgLatencyMs: 25,
    })

    const widget = ethyOverviewWidget(spine)
    assert.equal(widget.kind, 'table')
    if (widget.kind !== 'table') return
    assert.equal(widget.title, 'ETHY/0 custody matrix')
    assert.equal(widget.rows.length, 16)
    assert.deepEqual(widget.rows[0], [
      '0x0',
      'Closed + Trie ✓',
      'Acc · Code · Stor',
      '0 peers',
      '🔒 Private',
    ])
    assert.deepEqual(widget.rows[8], [
      '0x8',
      'Syncing 62%',
      '— · — · —',
      '1 trie · 1 flat',
      '1-hop',
    ])
    assert.deepEqual(widget.rows[1], ['0x1', 'Open', '— · — · —', '0 peers', 'Uncovered'])
    assert.ok(
      widget.preface?.some(
        (p) => p.key === 'RootNode assembly' && p.value.includes('16/16 assembled'),
      ),
    )
    assert.ok(
      widget.preface?.some((p) => p.key === 'Resolve breakdown' && p.value.includes('tomb 2')),
    )
    assert.ok(widget.secondaryTable !== undefined)
    assert.ok(widget.debugPage?.some((s) => s.title === 'Connected ETHY/0 peers'))
    assert.ok(widget.debugPage?.some((s) => s.title === 'Root assembly log (recent)'))
  })

  it('/machine surfaces coverage masks, snap dormancy, subtree apply latency, and cl plane', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.machine = {
      mode: 'custody-live-calm',
      modeReason: 'custody live steady',
      nextEventSummary: 'Live',
      planes: { eth: 'active', ethy: 'active', snap: 'off', discovery: 'standby', cl: 'active' },
      servingEthy: 'serving',
      ethyDiscoveryTag: true,
      transitions: [],
      vipTarget: 6,
      discoveryMode: 'quiet',
      desiredEthyBucketsMask: 0x0004,
      uncoveredBucketsMask: 0x0000,
      hopBuckets: 16,
      snapDormancyReason: 'default-off',
      subtreeApplyMs: 4,
    }
    const widget = machineMicroscopeWidget(spine)
    assert.equal(widget.kind, 'table')
    if (widget.kind !== 'table') return
    const map = new Map(widget.rows.map((r) => [r[0], r[1]]))
    assert.include(map.get('Planes') ?? '', 'cl ●')
    assert.equal(map.get('Coverage'), 'desired 0x4 · uncovered 0x0 · hop 16/16')
    assert.equal(map.get('Snap dormancy'), 'default-off')
    assert.equal(map.get('Subtree apply'), '4 ms/block')
  })
})
