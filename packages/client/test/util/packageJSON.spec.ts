import { assert, describe, it } from 'vitest'

import { getClientVersion, getPackageJSON } from '../../src/util/index.js'

describe('[Util/index.ts]', () => {
  it('getClientVersion', () => {
    assert.doesNotThrow(getClientVersion)
  })
  it('getPackageJSON', () => {
    assert.doesNotThrow(getPackageJSON)
  })
})
