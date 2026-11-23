import { assert, describe, it } from 'vitest'

import {
  BAL_SEGMENT_BLOCKS,
  contiguousRange,
  pruneFloor,
  segmentStart,
} from '../src/sync/balRetentionPolicy.ts'

describe('[Ethy/Sync]: bal retention policy', () => {
  it('segmentStart aligns to 256-block grid', () => {
    assert.equal(segmentStart(0n), 0n)
    assert.equal(segmentStart(255n), 0n)
    assert.equal(segmentStart(256n), 256n)
    assert.equal(segmentStart(300n), 256n)
    assert.equal(BAL_SEGMENT_BLOCKS, 256n)
  })

  it('contiguousRange finds suffix and pivot bridge', () => {
    const r = contiguousRange([100n, 101n, 102n], 99n)
    assert.deepEqual(r, {
      earliest: 100n,
      latest: 102n,
      contiguousFromPivot: true,
    })
    const gapOnly = contiguousRange([100n, 101n, 102n, 104n], 99n)
    assert.equal(gapOnly?.latest, 104n)
    assert.equal(gapOnly?.contiguousFromPivot, false)
    const hole = contiguousRange([105n, 106n], 100n)
    assert.equal(hole?.contiguousFromPivot, false)
  })

  it('pruneFloor respects min chunk block', () => {
    assert.equal(pruneFloor(500n, 10_000n, false), 500n)
  })

  it('pruneFloor uses servable tail when shadow disabled', () => {
    assert.equal(pruneFloor(undefined, 9000n, true), 808n)
  })
})
