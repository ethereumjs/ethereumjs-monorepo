import * as tape from 'tape'

import { baseRequest, baseSetup, params } from '../helpers'

const method = 'engine_getCapabilities'

tape(`${method}: call with invalid payloadId`, async (t) => {
  const { server } = baseSetup({ engine: true })

  const req = params(method, [])
  const expectRes = (res: any) => {
    t.ok(res.body.result.length > 0, 'got more than 1 engine capability')
    t.equal(
      res.body.result.findIndex((el: string) => el === 'engine_getCapabilities'),
      -1,
      'should not include engine_getCapabilities in response'
    )
  }
  await baseRequest(t, server, req, 200, expectRes)
})
