import { assert, describe, it } from 'vitest'

import { createClient, createManager, getRpcClient, startRPC } from '../helpers.js'

const method = 'admin_nodeInfo'

describe(method, () => {
  it('works', async () => {
    const manager = createManager(createClient({ opened: true }))
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, [])

    const { result } = res
    if (result !== undefined) {
      assert.ok(true, 'admin_nodeInfo returns a value')
    } else {
      throw new Error('no return value')
    }
  })
})
