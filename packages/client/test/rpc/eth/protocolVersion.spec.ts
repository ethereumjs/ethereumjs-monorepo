import { assert, describe, it } from 'vitest'

import { baseRequest, baseSetup, params } from '../helpers.js'

const method = 'eth_protocolVersion'

describe(method, () => {
  it('call', async () => {
    const { server } = baseSetup()

    const res = await rpc.request(method, [])
    const expectRes = (res: any) => {
      const responseBlob = res.body
      const msg = 'protocol version should be a string'
      assert.equal(typeof responseBlob.result, 'string', msg)
    }
    await baseRequest(server, req, 200, expectRes)
  })
})
