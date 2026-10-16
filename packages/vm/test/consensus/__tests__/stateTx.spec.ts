import assert from 'node:assert/strict'
import { describe, it } from 'vitest'

import { fixtureHasSignature } from '../cases/stateTx.ts'

describe('[VM/consensus]: state test tx', () => {
  it('fixtureHasSignature() is true when v, r, and s are non-empty', () => {
    assert.ok(
      fixtureHasSignature({
        v: '0x1c',
        r: '0x01',
        s: '0x02',
      }),
    )
  })

  it('fixtureHasSignature() is false when signature fields are missing', () => {
    assert.ok(!fixtureHasSignature({ secretKey: '0x11' }))
    assert.ok(!fixtureHasSignature({ v: '0x1c' }))
  })
})
