import { assert, describe, it } from 'vitest'

import { baseRequest, baseSetup, params } from '../helpers'

const method = 'eth_coinbase'

describe(method, () => {
  it('call', async () => {
    const coinbase: string = 'abc'
    const { server } = baseSetup({
      minerCoinbase: coinbase,
    })

    const req = params(method, [])
    const expectRes = (res: any) => {
      const responseBlob = res.body
      assert.equal(typeof responseBlob.result, 'string', 'coinbase address should be a string')
      assert.equal(
        responseBlob.result,
        coinbase,
        "coinbase address should be same as value it's been set to"
      )
    }
    await baseRequest(server, req, 200, expectRes)
  })
})
