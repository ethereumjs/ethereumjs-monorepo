import { assert, afterEach, beforeEach, describe, it } from 'vitest'

import { isDebugEnabled } from '../src/index.ts'

describe('isDebugEnabled', () => {
  let savedProcess: typeof globalThis.process

  beforeEach(() => {
    savedProcess = globalThis.process
  })

  afterEach(() => {
    globalThis.process = savedProcess
  })

  it('returns false when globalThis.process is undefined (browser/worker)', () => {
    ;(globalThis as any).process = undefined
    assert.isFalse(isDebugEnabled('ethjs'))
  })

  it('returns false when DEBUG is not set', () => {
    ;(globalThis as any).process = { env: {} }
    assert.isFalse(isDebugEnabled('ethjs'))
  })

  it('returns true when DEBUG includes the namespace', () => {
    ;(globalThis as any).process = { env: { DEBUG: 'ethjs' } }
    assert.isTrue(isDebugEnabled('ethjs'))
  })

  it('returns false when DEBUG does not include the namespace', () => {
    ;(globalThis as any).process = { env: { DEBUG: 'other' } }
    assert.isFalse(isDebugEnabled('ethjs'))
  })

  it('handles partial namespace matches (namespace substring present)', () => {
    ;(globalThis as any).process = { env: { DEBUG: 'ethjs:evm,other' } }
    assert.isTrue(isDebugEnabled('ethjs'))
  })
})
