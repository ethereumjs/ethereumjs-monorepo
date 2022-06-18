import * as tape from 'tape'
import { baseSetup, params, baseRequest } from '../helpers'

const method = 'eth_protocolVersion'

tape(`${method}: call`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, [])
  const expectRes = (res: any) => {
    const responseBlob = res.body
    const msg = 'protocol version should be a string'
    t.equal(typeof responseBlob.result, 'string', msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})
