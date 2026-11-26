import { assert, describe, it } from 'vitest'

import { deferEthyWitnessToMain } from '../../src/worker/ethyServePolicy.ts'

describe('ethyServePolicy (WP-16f)', () => {
  it('defers GET_STATE_WITNESS only when live-proof mode is armed', () => {
    assert.isFalse(deferEthyWitnessToMain(false, 'GET_STATE_WITNESS'))
    assert.isTrue(deferEthyWitnessToMain(true, 'GET_STATE_WITNESS'))
    assert.isFalse(deferEthyWitnessToMain(true, 'GET_SUBTREE_ROOTS'))
  })
})
