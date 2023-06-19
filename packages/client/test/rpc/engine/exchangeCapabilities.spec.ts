import { assert, describe, it } from 'vitest'

import { baseRequest, baseSetup, params } from '../helpers'

const method = 'engine_exchangeCapabilities'

describe(method, () => {
  it('call with invalid payloadId', async () => {
    const { server } = baseSetup({ engine: true })

    const req = params(method, [])
    const expectRes = (res: any) => {
      assert.ok(res.body.result.length > 0, 'got more than 1 engine capability')
      assert.equal(
        res.body.result.findIndex((el: string) => el === 'engine_exchangeCapabilities'),
        -1,
        'should not include engine_exchangeCapabilities in response'
      )
    }
    await baseRequest(server, req, 200, expectRes)
  })
})
