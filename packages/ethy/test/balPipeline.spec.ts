import { assert, describe, it } from 'vitest'

import {
  balPipelineActive,
  maxConcurrentBalFlights,
  nextBalFlightStartBlock,
  occupiedBalBlockRanges,
} from '../src/sync/balPipeline.ts'

describe('[Ethy/BalPipeline]: WP-14 scheduler helpers', () => {
  it('maxConcurrentBalFlights() scales peers up to 6', () => {
    assert.equal(maxConcurrentBalFlights(0), 2)
    assert.equal(maxConcurrentBalFlights(1), 2)
    assert.equal(maxConcurrentBalFlights(2), 4)
    assert.equal(maxConcurrentBalFlights(10), 6)
  })

  it('nextBalFlightStartBlock() skips occupied ranges', () => {
    const ranges = occupiedBalBlockRanges(
      [{ startBlock: 100n, count: 32 }],
      [{ startBlock: 200n, blockCount: 32 }],
    )
    assert.equal(nextBalFlightStartBlock(100n, 500n, ranges), 132n)
    assert.equal(nextBalFlightStartBlock(132n, 500n, ranges), 132n)
    assert.equal(nextBalFlightStartBlock(133n, 500n, ranges), 133n)
    assert.equal(nextBalFlightStartBlock(232n, 500n, ranges), 232n)
  })

  it('balPipelineActive() is false in snap and within 64-block tail', () => {
    assert.isFalse(balPipelineActive('SNAP_SYNCING', 100n, 10_000n, 100n))
    assert.isFalse(balPipelineActive('BAL_CATCHUP', 9_950n, 10_000n, 50n))
    assert.isTrue(balPipelineActive('BAL_CATCHUP', 100n, 10_000n, 100n))
  })
})
