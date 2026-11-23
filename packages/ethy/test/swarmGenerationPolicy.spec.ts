import { assert, describe, it } from 'vitest'

import { hexToBytes } from '@ethereumjs/util'

import {
  HARD_PREFER_SNAP_AGE_BLOCKS,
  SOFT_REFRESH_AGE_BLOCKS,
  backupElectionStaggerMs,
  computeElectionDelayMs,
  electionWeight,
  evaluateMinterSuppression,
  macroGenerationBlock,
} from '../src/sync/swarmGenerationPolicy.ts'

describe('[Ethy/Sync]: swarm generation policy', () => {
  it('macro grid is 1024 blocks', () => {
    assert.equal(macroGenerationBlock(2000n), 1024n)
    assert.equal(SOFT_REFRESH_AGE_BLOCKS, 1536n)
    assert.equal(HARD_PREFER_SNAP_AGE_BLOCKS, 4096n)
  })

  it('election delay is deterministic, weight-sensitive, and spread across nodeIds', () => {
    const id = hexToBytes(`0x${'ab'.repeat(32)}`)
    const w = electionWeight({
      publicEndpoint: false,
      uptimeMs: 60_000,
      snapPeerCount: 1,
      knownActiveEthyPeers: 4,
    })
    const d1 = computeElectionDelayMs({
      nodeId: id,
      generationBlock: 1024n,
      knownActiveEthyPeers: 4,
      weight: w,
    })
    const d2 = computeElectionDelayMs({
      nodeId: id,
      generationBlock: 1024n,
      knownActiveEthyPeers: 4,
      weight: w,
    })
    assert.equal(d1, d2)
    assert.isAtLeast(d1, 5000)
    assert.isAtMost(d1, 180_000)

    // Across 64 distinct nodeIds, delays must not all collapse to W_MIN_MS
    const delays = new Set<number>()
    let aboveMin = 0
    for (let i = 0; i < 64; i++) {
      const nid = new Uint8Array(32)
      nid[0] = i
      nid[31] = (i * 37) & 0xff
      const d = computeElectionDelayMs({
        nodeId: nid,
        generationBlock: 2048n,
        knownActiveEthyPeers: 20,
        weight: 1,
      })
      delays.add(d)
      if (d > 5_000) aboveMin += 1
    }
    assert.isAbove(delays.size, 10)
    assert.isAbove(aboveMin, 50)
  })

  it('full minter suppresses election', () => {
    const r = evaluateMinterSuppression({
      nowMs: 1_000_000,
      generationBlock: 1024n,
      announcements: [
        {
          peerId: 'a',
          basePivotBlock: 1100n,
          bucketsBitmask: 0xffff,
          connected: true,
          headerVerified: true,
        },
      ],
    })
    assert.equal(r.state, 'suppressed')
    assert.equal(r.suppressorPeerId, 'a')
    assert.deepEqual(r.stalledPeerIds, [])
  })

  it('ignores minters advertising pivots beyond verified head', () => {
    const r = evaluateMinterSuppression({
      nowMs: 1_000_000,
      generationBlock: 1024n,
      bestVerifiedHead: 1050n,
      announcements: [
        {
          peerId: 'future',
          basePivotBlock: 1100n,
          bucketsBitmask: 0xffff,
          connected: true,
          headerVerified: true,
        },
      ],
    })
    assert.equal(r.state, 'clear')
  })

  it('backup stagger sits in 15s..90s band', () => {
    const id = hexToBytes(`0x${'cd'.repeat(32)}`)
    const ms = backupElectionStaggerMs(id, 2048n)
    assert.isAtLeast(ms, 15_000)
    assert.isAtMost(ms, 90_000)
  })
})
