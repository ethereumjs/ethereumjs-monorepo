import { assert, describe, it } from 'vitest'

import { baseSetup } from '../helpers.ts'

const method = 'eth_protocolVersion'

describe(method, () => {
  it('call', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, [])
    assert.strictEqual(typeof res.result, 'string', 'protocol version should be a string')
  })
})
