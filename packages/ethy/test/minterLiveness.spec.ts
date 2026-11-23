import { assert, describe, it } from 'vitest'

import { hexToBytes } from '@ethereumjs/util'

import type { WorkerPeerSnapshot } from '@ethereumjs/devp2p'
import {
  createMinterLivenessBook,
  noteMinterEthyServe,
  noteMinterStatus,
} from '../src/sync/minterLiveness.ts'
import {
  MINT_LIVENESS_TIMEOUT_MS,
  evaluateMinterSuppression,
} from '../src/sync/swarmGenerationPolicy.ts'
import {
  applyBackupElectionStaggerOnSuppressionLift,
  buildMinterAnnouncements,
  ensureGenerationElectionArmed,
} from '../src/sync/swarmRuntime.ts'

describe('[Ethy/Sync]: minter liveness & suppression', () => {
  it('mask 0 suppresses only within MINT_LIVENESS_TIMEOUT_MS', () => {
    const base = 1_000_000
    const fresh = evaluateMinterSuppression({
      nowMs: base + 60_000,
      generationBlock: 1024n,
      announcements: [
        {
          peerId: 'm',
          basePivotBlock: 1100n,
          bucketsBitmask: 0,
          connected: true,
          headerVerified: true,
          firstZeroMaskAtMs: base,
        },
      ],
    })
    assert.equal(fresh.state, 'suppressed')
    const stale = evaluateMinterSuppression({
      nowMs: base + MINT_LIVENESS_TIMEOUT_MS + 1,
      generationBlock: 1024n,
      announcements: [
        {
          peerId: 'm',
          basePivotBlock: 1100n,
          bucketsBitmask: 0,
          connected: true,
          headerVerified: true,
          firstZeroMaskAtMs: base,
        },
      ],
    })
    assert.equal(stale.state, 'stalled')
    assert.include(stale.stalledPeerIds, 'm')
  })

  it('partial minter needs fresh manifest/chunk serve', () => {
    const now = 5_000_000
    const live = evaluateMinterSuppression({
      nowMs: now,
      generationBlock: 1024n,
      announcements: [
        {
          peerId: 'p',
          basePivotBlock: 2048n,
          bucketsBitmask: 0x3,
          connected: true,
          headerVerified: true,
          lastServeAtMs: now - 60_000,
        },
      ],
    })
    assert.equal(live.state, 'suppressed')
    const dead = evaluateMinterSuppression({
      nowMs: now,
      generationBlock: 1024n,
      announcements: [
        {
          peerId: 'p',
          basePivotBlock: 2048n,
          bucketsBitmask: 0x3,
          connected: true,
          headerVerified: true,
          lastServeAtMs: now - MINT_LIVENESS_TIMEOUT_MS - 1,
        },
      ],
    })
    assert.equal(dead.state, 'stalled')
  })

  it('buildMinterAnnouncements records zero-mask since from STATUS', () => {
    const book = createMinterLivenessBook()
    const peers: WorkerPeerSnapshot[] = [
      {
        id: 'abc',
        clientId: 't',
        caps: ['ethy/0'],
        ethySession: true,
        ethyStatus: {
          basePivotBlock: '2048',
          basePivotStateRoot: 'aa'.repeat(32),
          bucketsBitmask: '0',
          balEarliestBlock: '2049',
          balLatestBlock: '2100',
          latestBlockHash: '0x' + 'bb'.repeat(32),
        },
      },
    ]
    buildMinterAnnouncements({
      peers,
      book,
      generationBlock: 1024n,
      bestVerifiedHead: 3000n,
      nowMs: 1_000,
    })
    noteMinterEthyServe(book, 'abc', 2_000)
    const row = buildMinterAnnouncements({
      peers,
      book,
      generationBlock: 1024n,
      bestVerifiedHead: 3000n,
      nowMs: 2_500,
    })[0]
    assert.equal(row?.firstZeroMaskAtMs, 1_000)
    assert.equal(row?.lastServeAtMs, 2_000)
  })

  it('election arm is stable within the same generation', () => {
    const a = { generationBlock: 1024n, deadlineMs: 9_999 }
    const b = { generationBlock: 1024n, deadlineMs: 1_000 }
    const merged = ensureGenerationElectionArmed(a, b)
    assert.equal(merged?.deadlineMs, 9_999)
    const fresh = ensureGenerationElectionArmed(a, {
      generationBlock: 2048n,
      deadlineMs: 5_000,
    })
    assert.equal(fresh?.generationBlock, 2048n)
    assert.equal(fresh?.deadlineMs, 5_000)
  })

  it('backup stagger extends deadline after suppression lifts', () => {
    const id = hexToBytes(`0x${'ee'.repeat(32)}`)
    const handle = {
      generationBlock: 1024n,
      deadlineMs: 100,
      suppressionWasActive: true,
    }
    const next = applyBackupElectionStaggerOnSuppressionLift({
      handle,
      nodeId: id,
      suppressionState: 'clear',
      nowMs: 200,
    })
    assert.isAbove(next.deadlineMs, 200)
    assert.equal(next.backupStaggerApplied, true)
  })
})
