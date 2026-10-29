import { Common, Mainnet } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { forkValidationHead } from '../../src/protocol/eth/forkHead.ts'

describe('eth forkValidationHead', () => {
  it('returns block number on pre-merge common', () => {
    const common = new Common({ chain: Mainnet, hardfork: 'london' })
    assert.strictEqual(forkValidationHead(common, 15_000_000n, 1_700_000_000n), 15_000_000n)
  })

  it('returns unix time on post-merge common', () => {
    const common = new Common({ chain: Mainnet, hardfork: 'shanghai' })
    assert.strictEqual(forkValidationHead(common, 17_000_000n, 1_700_000_000n), 1_700_000_000n)
  })
})
