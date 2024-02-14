import { bigIntToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createClient, createManager, getRpcClient, startRPC } from '../helpers.js'

const method = 'eth_blockNumber'

describe(method, () => {
  it('call with valid arguments', async () => {
    const mockBlockNumber = BigInt(123)
    const mockChain = {
      headers: { latest: { number: mockBlockNumber } },
      async getCanonicalHeadHeader(): Promise<any> {
        return {
          number: mockBlockNumber,
        }
      },
    }
    const manager = createManager(await createClient({ chain: mockChain }))
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, [])

    assert.equal(res.result, bigIntToHex(mockBlockNumber))
  })
})
