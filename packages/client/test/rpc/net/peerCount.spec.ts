import { assert, describe, it } from 'vitest'

import { baseRequest, createClient, createManager, params, startRPC } from '../helpers'

const method = 'net_peerCount'

describe(method, () => {
  it('call', async () => {
    const manager = createManager(createClient({ opened: true }))
    const server = startRPC(manager.getMethods())

    const req = params(method, [])
    const expectRes = (res: any) => {
      const { result } = res.body
      const msg = 'result should be a hex number'
      assert.equal(result.substring(0, 2), '0x', msg)
    }
    await baseRequest(server, req, 200, expectRes)
  })
})
