import { assert, describe, it } from 'vitest'

import { baseSetup } from '../helpers.js'

const method = 'engine_exchangeCapabilities'

describe(method, () => {
  it('call with invalid payloadId', async () => {
    const { rpc } = await baseSetup({ engine: true })

    const res = await rpc.request(method, [])

    assert.ok(res.result.length > 0, 'got more than 1 engine capability')
    assert.equal(
      res.result.findIndex((el: string) => el === 'engine_exchangeCapabilities'),
      -1,
      'should not include engine_exchangeCapabilities in response',
    )
  })
})
