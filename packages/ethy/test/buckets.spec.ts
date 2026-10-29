import { assert, describe, it } from 'vitest'
import {
  createSnapBuckets,
  formatSnapCapabilityLabel,
  formatSnapRangePulse,
  snapBucketsDoneCount,
} from '../src/spine/buckets.ts'
import type { EthyPhase } from '../src/spine/types.ts'

describe('snap range display', () => {
  it('snapBucketsDoneCount() counts only finished ranges', () => {
    const buckets = createSnapBuckets()
    buckets[0]!.accountsLoaded = 1_000_000
    buckets[0]!.status = 'pending'
    buckets[1]!.status = 'done'
    assert.equal(snapBucketsDoneCount(buckets), 1)
  })

  it('formatSnapRangePulse() reports complete when all ranges are done', () => {
    const buckets = createSnapBuckets()
    for (const b of buckets) b.status = 'done'
    const line = formatSnapRangePulse(buckets, { peerCount: 2, phase: 'SNAP_SYNCING' })
    assert.include(line, 'done')
    assert.notInclude(line, '/16')
  })

  it('formatSnapRangePulse() does not treat cached accounts as complete', () => {
    const buckets = createSnapBuckets()
    for (const b of buckets) {
      b.accountsLoaded = 100
      b.status = 'pending'
    }
    const line = formatSnapRangePulse(buckets, { peerCount: 0, phase: 'SNAP_SYNCING' })
    assert.include(line, '0/16 paused')
    assert.notInclude(line, '16/16')
  })

  it('formatSnapCapabilityLabel() matches paused state with no peers', () => {
    const buckets = createSnapBuckets()
    buckets[3]!.status = 'syncing'
    const opts = { peerCount: 0, phase: 'SNAP_SYNCING' as EthyPhase }
    assert.equal(formatSnapCapabilityLabel(buckets, opts), '0/16 complete')
  })
})
