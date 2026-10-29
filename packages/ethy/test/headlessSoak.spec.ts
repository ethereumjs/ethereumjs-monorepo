import { assert, describe, it } from 'vitest'

import { ethyCallerModuleUrl } from '../src/net/workerModuleUrl.ts'

describe('[Ethy/CLI]: headless helpers', () => {
  it('ethyCallerModuleUrl() returns an ESM module URL', () => {
    const url = ethyCallerModuleUrl()
    assert.match(url, /^file:/)
    assert.include(url, 'ethy')
  })
})
