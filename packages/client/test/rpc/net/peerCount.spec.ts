import { assert, describe, it } from 'vitest'

import { createClient, createManager, getRpcClient, startRPC } from '../helpers.js'

const method = 'net_peerCount'

describe(method, () => {
  it('call', async () => {
    const manager = createManager(createClient({ opened: true }))
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, [])

    const { result } = res
    const msg = 'result should be a hex number'
    assert.equal(result.substring(0, 2), '0x', msg)
  })
})
