import { assert, describe, it } from 'vitest'

import {
  assignedBucketsClosed,
  custodyBitmask,
  evaluateCustodyCoverage,
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
})
