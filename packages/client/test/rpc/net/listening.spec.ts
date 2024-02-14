import { assert, describe, it } from 'vitest'

import { createClient, createManager, getRpcClient, startRPC } from '../helpers.js'

const method = 'net_listening'

describe(method, () => {
  it('call while listening', async () => {
    const manager = createManager(await createClient({ opened: true }))
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, [])
    const { result } = res

    assert.equal(typeof result, 'boolean', 'result should be a boolean')
    assert.equal(result, true, 'should be listening')
  })

  it('call while not listening', async () => {
    const manager = createManager(await createClient({ opened: false }))
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, [])
    const { result } = res
    assert.equal(typeof result, 'boolean', 'result should be a boolean')
    assert.equal(result, false, 'should not be listening')
  })
})
