import { describe, expect, it } from 'vitest'

import { Hardfork, Mainnet } from '@ethereumjs/common'
import { ensNameHash } from '../src/contracts/identityResolver.ts'
import { decodeBundle } from '../src/economy/decodeBundle.ts'

describe('decodeBundle WP-10b enrichments', () => {
  it('never throws on junk header RLP', () => {
    const record = decodeBundle({
      blockNumber: 1n,
      headerRlp: new Uint8Array([0xff, 0xff]),
      chain: Mainnet,
      hardfork: Hardfork.Cancun,
    })
    expect(record.blockNumber).toBe(1n)
    expect(record.contractContributions).toEqual([])
  })
})

describe('ensNameHash', () => {
  it('hashes reverse node labels deterministically', () => {
    const a = ensNameHash('abcdef.addr.reverse')
    const b = ensNameHash('abcdef.addr.reverse')
    expect(a).toEqual(b)
    expect(a.length).toBe(32)
  })
})
