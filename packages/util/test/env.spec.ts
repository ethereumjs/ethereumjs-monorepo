import { assert, afterEach, beforeEach, describe, it } from 'vitest'

import { isDebugEnabled } from '../src/index.ts'

describe('isDebugEnabled', () => {
  let originalDebug: string | undefined

  beforeEach(() => {
    originalDebug = globalThis.process?.env?.DEBUG
  })

  afterEach(() => {
    if (globalThis.process?.env !== undefined) {
      if (originalDebug === undefined) {
        delete globalThis.process.env.DEBUG
      } else {
        globalThis.process.env.DEBUG = originalDebug
      }
    }
  })

  it('returns false when DEBUG is not set', () => {
    delete globalThis.process!.env.DEBUG
    assert.isFalse(isDebugEnabled('ethjs'))
  })

  it('returns true when DEBUG includes the namespace', () => {
    globalThis.process!.env.DEBUG = 'ethjs'
    assert.isTrue(isDebugEnabled('ethjs'))
  })

  it('returns false when DEBUG does not include the namespace', () => {
    globalThis.process!.env.DEBUG = 'other'
    assert.isFalse(isDebugEnabled('ethjs'))
  })

  it('returns false when globalThis.process is undefined (simulates browser/worker)', () => {
    const saved = globalThis.process
    ;(globalThis as any).process = undefined
    try {
      assert.isFalse(isDebugEnabled('ethjs'))
    } finally {
      globalThis.process = saved
    }
  })

  it('handles partial namespace matches (namespace substring present)', () => {
    globalThis.process!.env.DEBUG = 'ethjs:evm,other'
    assert.isTrue(isDebugEnabled('ethjs'))
  })
})
