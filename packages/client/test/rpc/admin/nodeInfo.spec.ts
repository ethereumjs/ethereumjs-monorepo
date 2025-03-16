import { assert, describe, it } from 'vitest'

import { createClient, createManager, getRPCClient, startRPC } from '../helpers.ts'

const method = 'admin_nodeInfo'

describe(method, () => {
  it('works', async () => {
    const manager = createManager(await createClient({ opened: true }))
    const rpc = getRPCClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, [])
    const { result } = res
    assert.notEqual(result, undefined, 'admin_nodeInfo returns a value')
  })
})
