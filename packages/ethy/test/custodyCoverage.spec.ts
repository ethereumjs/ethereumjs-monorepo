import { assert, describe, it } from 'vitest'

import {
  assignedBucketsClosed,
  custodyBitmask,
  evaluateCustodyCoverage,
  pickRedundantEthyPeerToRotate,
} from '../src/custody/custodyCoverage.ts'

describe('custodyCoverage', () => {
  it('empty swarm leaves all buckets uncovered', () => {
    const r = evaluateCustodyCoverage({ closedBucketsMask: 0, peers: [] })
    assert.equal(r.uncoveredBucketsMask, 0xffff)
    assert.equal(r.desiredEthyBucketsMask, 0xffff)
    assert.equal(r.hopBuckets, 0)
    assert.equal(r.minRedundancy, 0)
  })

  it('single peer 8-bit mask fills half the nibble space', () => {
    const r = evaluateCustodyCoverage({
      closedBucketsMask: 0,
      peers: [{ ethySession: true, bucketsBitmask: 0x00ff }],
    })
    assert.equal(r.connectedSwarmBucketsMask, 0x00ff)
    assert.equal(r.uncoveredBucketsMask, 0xff00)
    assert.equal(r.desiredEthyBucketsMask, 0xff00)
    assert.equal(r.hopBuckets, 8)
  })

  it('local closed bucket counts toward redundancy on covered nibble', () => {
    const r = evaluateCustodyCoverage({
      closedBucketsMask: 0xffff,
      peers: [{ ethySession: true, bucketsBitmask: 0x0001 }],
    })
    assert.equal(r.hopBuckets, 16)
    assert.equal(r.minRedundancy, 1)
    assert.equal(r.desiredEthyBucketsMask, 0xfffe)
  })

  it('16/16 hop with a hole still desires the hole', () => {
    const r = evaluateCustodyCoverage({
      closedBucketsMask: 0xfffe,
      peers: [{ ethySession: true, bucketsBitmask: 0xfffe }],
    })
    assert.equal(r.uncoveredBucketsMask, 0x0001)
    assert.equal(r.desiredEthyBucketsMask, 0x0001)
    assert.equal(r.hopBuckets, 15)
  })

  it('custodyBitmask and assignedBucketsClosed', () => {
    assert.equal(custodyBitmask([0, 8]), 0x0101)
    assert.equal(assignedBucketsClosed(0x0101, 0x0101), true)
    assert.equal(assignedBucketsClosed(0x0101, 0x0001), false)
  })

  it('pickRedundantEthyPeerToRotate respects desired overlap and sole-custodian Law 1', () => {
    // Peer a covers desired bucket 0x4 -> never evict
    // Peer b is sole custodian of bucket 0x2 -> never evict
    // Peer c and d both cover bucket 0x1 (redundant) -> evict c or d
    const victim = pickRedundantEthyPeerToRotate({
      closedBucketsMask: 0x0001, // bucket 0 closed locally
      desiredEthyBucketsMask: 0x0010, // want bucket 4
      peers: [
        { id: 'peer-a', ethySession: true, bucketsBitmask: 0x0012 }, // overlaps desired bit 4
        { id: 'peer-b', ethySession: true, bucketsBitmask: 0x0004 }, // sole custodian of bit 2
        { id: 'peer-c', ethySession: true, bucketsBitmask: 0x0002 }, // redundant on bit 1
        { id: 'peer-d', ethySession: true, bucketsBitmask: 0x0002 }, // redundant on bit 1
      ],
    })
    assert.equal(victim, 'peer-c')

    // When every non-desired peer is a sole custodian, return undefined
    const none = pickRedundantEthyPeerToRotate({
      closedBucketsMask: 0,
      desiredEthyBucketsMask: 0x0010,
      peers: [
        { id: 'peer-sole-1', ethySession: true, bucketsBitmask: 0x0002 },
        { id: 'peer-sole-2', ethySession: true, bucketsBitmask: 0x0004 },
      ],
    })
    assert.isUndefined(none)
  })
})
