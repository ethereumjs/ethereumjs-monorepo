import { assert, describe, it } from 'vitest'

import { createClient, createManager, getRpcClient, startRPC } from '../helpers.js'

const method = 'net_peerCount'

describe(method, () => {
  it('call', async () => {
    const manager = createManager(await createClient({ opened: true }))
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, [])

    const { result } = res
    assert.equal(result.substring(0, 2), '0x', 'result should be a hex number')
  })
})
