import { assert, describe, it } from 'vitest'

import { baseRequest, baseSetup, params } from '../helpers'

const method = 'eth_coinbase'

describe(method, () => {
  it('call', async () => {
    const { server } = baseSetup({
      minerCoinbase: 'abc',
    })

    const req = params(method, [])
    const expectRes = (res: any) => {
      const responseBlob = res.body
      const msg = 'coinbase address should be a string'
      console.log(responseBlob)
      assert.equal(typeof responseBlob.result, 'string', msg)
    }
    await baseRequest(server, req, 200, expectRes)
  })
})
