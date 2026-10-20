import { assert, describe, it } from 'vitest'

import { Hardfork, Mainnet } from '../src/index.ts'
import { Common, resolveEIPs } from '../src/index.ts'

describe('resolveEIPs', () => {
  it('expands requiredEIPs in dependency order', () => {
    const resolved = resolveEIPs([8037])
    assert.ok(resolved.includes(2780))
    assert.ok(resolved.includes(7702))
    assert.ok(resolved.includes(8037))
    assert.ok(resolved.indexOf(2780) < resolved.indexOf(8037))
  })

  it('validates minimumHardfork when Common is passed', () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Berlin })
    assert.throws(() => resolveEIPs([4844], common))
  })

  it('rejects conflicting EIPs in one list', () => {
    assert.throws(() => resolveEIPs([3298, 3529]))
  })
})
