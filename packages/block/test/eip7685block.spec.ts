import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { CLRequest, KECCAK256_RLP, randomBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Block } from '../src/index.js'

import type { RequestData } from '@ethereumjs/util'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai, eips: [7685] })
describe('7685 tests', () => {
  it('should instantiate block with defaults', () => {
    const block = Block.fromBlockData({}, { common })
    assert.deepEqual(block.header.requestsRoot, KECCAK256_RLP)
    const block2 = new Block(undefined, undefined, undefined, undefined, { common })
    assert.deepEqual(block.header.requestsRoot, KECCAK256_RLP)
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
  it('RequestsRootIsValid should return false when requestsRoot is invalid', async () => {
    const request: RequestData = { type: 0x1, data: randomBytes(32) }
    const block = Block.fromBlockData(
      {
        requests: [request],
        header: { requestsRoot: randomBytes(32) },
      },
      { common }
    )

    assert.equal(await block.requestsTrieIsValid(), false)
  })
})
