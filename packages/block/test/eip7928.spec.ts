import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { randomBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'
import { createBlock } from '../src/index.ts'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })

describe('EIP7928 tests', () => {
  it('should accept and correctly assign new blockAccessListHash field (main constructor)', () => {
    const blockAccessListHash = randomBytes(32)
    const block = createBlock(
      {
        header: {
          blockAccessListHash,
        },
      },
      { common },
    )
    assert.deepEqual(block.header.blockAccessListHash, blockAccessListHash)
  })
})
