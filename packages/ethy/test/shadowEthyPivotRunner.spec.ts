import { assert, describe, it } from 'vitest'

import { shadowEthySeedMaskSatisfied } from '../src/sync/shadowPivotRunner.ts'

describe('[Ethy/Sync]: shadow ethy pivot runner', () => {
  it('shadowEthySeedMaskSatisfied respects seeder mask', () => {
    const done = new Set([0, 1, 2])
    assert.isTrue(shadowEthySeedMaskSatisfied(0b111, done))
    assert.isFalse(shadowEthySeedMaskSatisfied(0b1111, done))
    assert.isTrue(shadowEthySeedMaskSatisfied(0xffff, new Set([...Array(16).keys()])))
  })
})
