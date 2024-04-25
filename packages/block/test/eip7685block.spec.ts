import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { CLRequest, randomBytes, zeros } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Block, BlockData } from '../src/index.js'

import type { RequestData } from '@ethereumjs/util'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai, eips: [7685] })
describe('7685 tests', () => {
  it('should instantiate block with defaults', () => {
    const block = Block.fromBlockData({}, { common })
    assert.deepEqual(block.header.requestsRoot, zeros(32))
    const block2 = new Block(undefined, undefined, undefined, undefined, { common })
    assert.deepEqual(block.header.requestsRoot, zeros(32))
    assert.equal(block2.requests?.length, 0)
  })
  it('should instantiate a block with requests', async () => {
    const request: RequestData = { type: 0x1, data: randomBytes(32) }
    const requestsRoot = await Block.genRequestsTrieRoot([CLRequest.fromRequestsData(request)])
    const block = Block.fromBlockData(
      {
        requests: [request],
        header: { requestsRoot },
      },
      { common }
    )
    assert.equal(block.requests?.length, 1)
    assert.deepEqual(block.header.requestsRoot, requestsRoot)
  })
})
