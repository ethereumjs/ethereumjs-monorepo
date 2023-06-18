import { assert, describe } from 'vitest'

import { baseRequest, baseSetup, params } from '../helpers'

const method = 'eth_protocolVersion'

describe(`${method}: call`, async () => {
  const { server } = baseSetup()

  const req = params(method, [])
  const expectRes = (res: any) => {
    const responseBlob = res.body
    const msg = 'protocol version should be a string'
    assert.equal(typeof responseBlob.result, 'string', msg)
  }
  await baseRequest(server, req, 200, expectRes)
})
