import { assert, describe, it } from 'vitest'

import { custodyBitmask, selectCustodyBuckets } from '../src/custody/custodyPlan.ts'

describe('custodyPlan', () => {
  const nodeId = new Uint8Array(32).fill(0xab)

  it('selectCustodyBuckets(2) returns two distinct nibbles', () => {
    const buckets = selectCustodyBuckets(nodeId, 2)
    assert.equal(buckets.length, 2)
    assert.notEqual(buckets[0], buckets[1])
    assert.isTrue(buckets.every((b) => b >= 0 && b <= 15))
  })

  it('selectCustodyBuckets(16) is full set', () => {
    const buckets = selectCustodyBuckets(nodeId, 16)
    assert.deepEqual(
      buckets,
      Array.from({ length: 16 }, (_, i) => i),
    )
  })

  it('custodyBitmask sets one bit per bucket', () => {
    assert.equal(custodyBitmask([0, 8]), 0x0101)
  })
})
