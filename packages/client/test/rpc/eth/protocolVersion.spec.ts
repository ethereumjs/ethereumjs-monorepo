import { assert, describe, it } from 'vitest'

import { baseSetup } from '../helpers.js'

const method = 'eth_protocolVersion'

describe(method, () => {
  it('call', async () => {
    const { rpc } = baseSetup()

    const res = await rpc.request(method, [])
    const msg = 'protocol version should be a string'
    assert.equal(typeof res.result, 'string', msg)
  })
})
