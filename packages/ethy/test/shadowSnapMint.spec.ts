import { createFlatStateManager } from '@ethereumjs/statemanager'
import { assert, describe, it } from 'vitest'

import { createSnapBuckets } from '../src/spine/buckets.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { SnapAccountSynchronizer } from '../src/sync/accountSync.ts'
import {
  computePartialMinterMask,
  createShadowMintBuckets,
  nextShadowMintBucketCap,
  selectShadowMintPivotBlock,
  shadowSnapMintReadyToFlip,
} from '../src/sync/shadowSnapMint.ts'
import { SnapPeerFlightTracker } from '../src/sync/snapFlight.ts'
import type { SnapTransport } from '../src/sync/snapTransport.ts'
import { SnapVerifyPool } from '../src/sync/snapVerifyWorker.ts'
import { SyntheticSnapPeer } from '../src/sync/syntheticPeer.ts'

describe('[Ethy/Sync]: shadow SNAP mint pacing', () => {
  it('createShadowMintBuckets starts bucket 0 only', () => {
    const buckets = createShadowMintBuckets()
    assert.equal(buckets[0]?.status, 'syncing')
    assert.equal(buckets[1]?.status, 'pending')
  })

  it('nextShadowMintBucketCap advances as buckets finish', () => {
    const buckets = createShadowMintBuckets()
    assert.equal(nextShadowMintBucketCap(buckets), 0)
    buckets[0]!.status = 'done'
    assert.equal(nextShadowMintBucketCap(buckets), 1)
    buckets[1]!.status = 'done'
    assert.equal(nextShadowMintBucketCap(buckets), 2)
  })

  it('computePartialMinterMask sets bits for done buckets', () => {
    const buckets = createShadowMintBuckets()
    buckets[0]!.status = 'done'
    buckets[2]!.status = 'done'
    assert.equal(computePartialMinterMask(buckets), 0b101)
  })

  it('shadowSnapMintReadyToFlip needs all buckets done', () => {
    const buckets = createSnapBuckets()
    for (const b of buckets) b.status = 'done'
    assert.isTrue(shadowSnapMintReadyToFlip(buckets))
    buckets[15]!.status = 'syncing'
    assert.isFalse(shadowSnapMintReadyToFlip(buckets))
  })

  it('selectShadowMintPivotBlock uses macro grid when fresh and falls back to 32-block canonical grid mid-generation', () => {
    // 16 blocks past 12,201,984 (= 11916 * 1024): fresh enough for snap/1
    assert.equal(selectShadowMintPivotBlock(12_202_000n), 12_201_984n)
    // 64 blocks past macro grid: still within retention threshold
    assert.equal(selectShadowMintPivotBlock(12_202_048n), 12_201_984n)
    // 110 blocks past macro grid: falls back to latest 32-block canonical grid (14 blocks behind head)
    assert.equal(selectShadowMintPivotBlock(12_202_094n), 12_202_080n)
  })

  it('background SnapAccountSynchronizer commits to shadow accountBuckets without mutating live spine or stateManager', async () => {
    const trie = await SyntheticSnapPeer.create(12)
    const spine = createSpine('sepolia', 11155111n)
    for (const b of spine.snapBuckets) b.status = 'done'
    spine.totalAccountsSynced = 999
    const liveStateManager = createFlatStateManager()
    const shadowBuckets = createShadowMintBuckets()
    // Sync bucket 0xf (rightmost nibble) so real Merkle range proofs return hasRight=false
    for (let i = 0; i < 15; i++) shadowBuckets[i]!.status = 'done'
    shadowBuckets[15]!.status = 'syncing'
    const peers = [
      {
        id: 'aa11',
        caps: ['snap/1'],
        snapResponsesOk: 0,
        snapTimeouts: 0,
        avgLatencyMs: 10,
      },
    ]

    let onRange: (peerId: string, payload: Uint8Array) => void = () => {}
    const doneBuckets: number[] = []
    const transport: SnapTransport = {
      snapPeers: () => peers,
      onAccountRange(cb) {
        onRange = cb
        return () => {}
      },
      sendAccountRange(peerId, payload) {
        void trie.buildAccountRangeReply(payload).then((reply) => {
          onRange(peerId, reply)
        })
      },
      sendStorageRanges: () => {},
      onStorageRanges: () => () => {},
      sendByteCodes: () => {},
      onByteCodes: () => () => {},
    }

    const sync = new SnapAccountSynchronizer({
      spine,
      stateManager: liveStateManager,
      transport,
      flightTracker: new SnapPeerFlightTracker(),
      getSnapPeers: () => peers,
      verifyPool: new SnapVerifyPool({ inProcess: true }),
      accountBuckets: shadowBuckets,
      pivotAnchor: { blockNumber: 12_202_080n, stateRoot: trie.rootHash },
      backgroundMode: true,
      mintBucketCap: 15,
      onBucketDone: (idx) => {
        doneBuckets.push(idx)
      },
    })

    sync.start()
    const bucket15 = shadowBuckets[15]!
    const deadline = Date.now() + 2_000
    while (bucket15.status !== 'done' && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 10))
    }
    sync.stop()

    assert.equal(
      bucket15.status,
      'done',
      `status=${bucket15.status} loaded=${bucket15.accountsLoaded} stall=${bucket15.lastStallReason ?? 'none'}`,
    )
    assert.equal(bucket15.accountsLoaded, 12)
    assert.deepEqual(doneBuckets, [15])
    assert.equal(spine.totalAccountsSynced, 999)
    assert.equal(liveStateManager.accountCount(), 0)
  })
})
