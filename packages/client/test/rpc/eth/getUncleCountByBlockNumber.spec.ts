import { assert, describe } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import { baseRequest, createClient, createManager, params, startRPC } from '../helpers'
import { checkError } from '../util'

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

describe(`${method}: call with valid arguments`, async () => {
  const mockUncleCount = 3

  const manager = createManager(createClient({ chain: createChain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['0x1'])
  const expectRes = (res: any) => {
    const msg = 'should return the correct number'
    assert.equal(res.body.result, mockUncleCount, msg)
  }
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: call with invalid block number`, async () => {
  const manager = createManager(createClient({ chain: createChain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['0x5a'])

  const expectRes = checkError(INVALID_PARAMS, 'specified block greater than current height')
  await baseRequest(server, req, 200, expectRes)
})
