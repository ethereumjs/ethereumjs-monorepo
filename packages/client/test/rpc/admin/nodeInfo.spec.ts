import { assert, describe } from 'vitest'

import { baseRequest, createClient, createManager, params, startRPC } from '../helpers'

const method = 'admin_nodeInfo'

describe(method, async () => {
  const manager = createManager(createClient({ opened: true }))
  const server = startRPC(manager.getMethods())

  const req = params(method, [])

  const expectRes = (res: any) => {
    const { result } = res.body
    if (result !== undefined) {
      assert.ok(true, 'admin_nodeInfo returns a value')
    } else {
      throw new Error('no return value')
    }
  }
  await baseRequest(server, req, 200, expectRes)
})
