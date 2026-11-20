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

  it('election delay is deterministic and clamped', () => {
    const id = hexToBytes(`0x${'ab'.repeat(32)}`)
    const d1 = computeElectionDelayMs({
      nodeId: id,
      generationBlock: 1024n,
      knownActiveEthyPeers: 4,
      weight: electionWeight({
        publicEndpoint: false,
        uptimeMs: 60_000,
        snapPeerCount: 1,
        knownActiveEthyPeers: 4,
      }),
    })
    const d2 = computeElectionDelayMs({
      nodeId: id,
      generationBlock: 1024n,
      knownActiveEthyPeers: 4,
      weight: 2,
    })
    assert.equal(d1, d2)
    assert.isAtLeast(d1, 5000)
    assert.isAtMost(d1, 180_000)
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

  it('backup stagger sits in 15s..90s band', () => {
    const id = hexToBytes(`0x${'cd'.repeat(32)}`)
    const ms = backupElectionStaggerMs(id, 2048n)
    assert.isAtLeast(ms, 15_000)
    assert.isAtMost(ms, 90_000)
  })
})
