import { MAX_INTEGER, MAX_UINT64 } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { valueOverflowCheck } from '../src/util/internal.ts'

describe('Helper methods should be correct', () => {
  it('valueBoundaryCheck()', () => {
    try {
      valueOverflowCheck({ a: MAX_INTEGER }, 256, true)
    } catch (err: any) {
      assert.isTrue(
        err.message.includes('equal or exceed MAX_INTEGER'),
        'throws when value equals or exceeds MAX_INTEGER',
      )
    }
    try {
      valueOverflowCheck({ a: MAX_INTEGER + BigInt(1) }, 256, false)
    } catch (err: any) {
      assert.isTrue(
        err.message.includes('exceed MAX_INTEGER'),
        'throws when value exceeds MAX_INTEGER',
      )
    }
    try {
      valueOverflowCheck({ a: BigInt(0) }, 100, false)
    } catch (err: any) {
      assert.isTrue(
        err.message.includes('unimplemented bits value'),
        'throws when bits value other than 64 or 256 provided',
      )
    }
    try {
      valueOverflowCheck({ a: MAX_UINT64 + BigInt(1) }, 64, false)
    } catch (err: any) {
      assert.isTrue(err.message.includes('2^64'), 'throws when 64 bit integer exceeds MAX_UINT64')
    }
    try {
      valueOverflowCheck({ a: MAX_UINT64 }, 64, true)
    } catch (err: any) {
      assert.isTrue(
        err.message.includes('2^64'),
        'throws when 64 bit integer equals or exceeds MAX_UINT64',
      )
    }
  })
})
