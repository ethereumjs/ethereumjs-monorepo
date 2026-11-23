import { assert, describe, it } from 'vitest'

import { createSnapBuckets } from '../src/spine/buckets.ts'
import {
  computePartialMinterMask,
  createShadowMintBuckets,
  nextShadowMintBucketCap,
  shadowSnapMintReadyToFlip,
} from '../src/sync/shadowSnapMint.ts'

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
})
