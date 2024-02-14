import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.js'
import { createClient, createManager, getRpcClient, startRPC } from '../helpers.js'

function createChain() {
  const block = {
    uncleHeaders: ['0x1', '0x2', '0x3'],
    transactions: [],
    header: {
      hash: () => new Uint8Array([1]),
      number: BigInt('5'),
    },
  }
  return {
    blocks: { latest: block },
    headers: { latest: block.header },
    getBlock: () => block,
    getCanonicalHeadBlock: () => block,
    getCanonicalHeadHeader: () => block.header,
  }
}

const method = 'eth_getUncleCountByBlockNumber'

describe(method, () => {
  it('call with valid arguments', async () => {
    const mockUncleCount = 3

    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, ['0x1'])
    assert.equal(res.result, mockUncleCount, 'should return the correct number')
  })

  it('call with invalid block number', async () => {
    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, ['0x5a'])

    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('specified block greater than current height'))
  })
})
