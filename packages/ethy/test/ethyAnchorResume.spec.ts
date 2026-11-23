import { assert, describe, it } from 'vitest'

import { pickEthyAnchorForStaleResume } from '../src/sync/ethyAnchorResume.ts'
import { planNetworkHeadResume } from '../src/sync/startupStateMachine.ts'

describe('[Ethy/Sync]: anchor-ethy resume', () => {
  it('planNetworkHeadResume prefers anchor-ethy over reset-stale', () => {
    const action = planNetworkHeadResume({
      kind: 'partial-accounts',
      localVerifiedBlock: undefined,
      pivotBlock: 1_000_000n,
      bucketsDoneCount: 2,
      liveHead: 1_050_000n,
      ethyBalTail: false,
      ethyAnchorPeerId: 'aa',
      ethyAnchorPivot: 1_049_000n,
    })
    assert.equal(action.action, 'anchor-ethy')
    if (action.action === 'anchor-ethy') {
      assert.equal(action.targetPivot, 1_049_000n)
    }
  })

  it('pickEthyAnchorForStaleResume requires fresh seeder pivot', () => {
    const peers = [
      {
        id: 'peer1',
        clientId: 't',
        caps: [],
        snapSession: false,
        ethySession: true,
        ethyStatus: {
          basePivotBlock: '10490000',
          basePivotStateRoot: '0x' + '11'.repeat(32),
          bucketsBitmask: '65535',
          balEarliestBlock: '10490001',
          balLatestBlock: '10495000',
          latestBlockHash: '0x' + '22'.repeat(32),
        },
      },
    ] as import('@ethereumjs/devp2p').WorkerPeerSnapshot[]
    const pick = pickEthyAnchorForStaleResume(peers, 10_490_500n, 1_000_000n, 'auto')
    assert.ok(pick !== undefined)
    assert.equal(pick?.basePivotBlock, 10_490_000n)
  })
})
