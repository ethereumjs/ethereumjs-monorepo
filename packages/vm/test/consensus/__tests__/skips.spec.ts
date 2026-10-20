import { describe, expect, it } from 'vitest'

import { defaultSkipCategories, shouldSkipTest } from '../skips.ts'

describe('consensus skips', () => {
  it('skips broken tests by default', () => {
    expect(
      shouldSkipTest('ForkStressTest', 'Prague', {
        skipCategories: defaultSkipCategories(),
        runOnlyCategories: new Set(),
      }),
    ).toBe(true)
  })

  it('runs slow tests when run-skipped=slow', () => {
    expect(
      shouldSkipTest('loopMul', 'Berlin', {
        skipCategories: defaultSkipCategories(),
        runOnlyCategories: new Set(['slow']),
      }),
    ).toBe(false)
  })
})
