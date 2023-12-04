import { assert, describe, it } from 'vitest'

import { createClient, createManager, getRpcClient, startRPC } from '../helpers.js'

const method = 'net_listening'

describe(method, () => {
  it('call while listening', async () => {
    const manager = createManager(createClient({ opened: true }))
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, [])
    const { result } = res
    let msg = 'result should be a boolean'
    assert.equal(typeof result, 'boolean', msg)
    msg = 'should be listening'
    assert.equal(result, true, msg)
  })

  it('call while not listening', async () => {
    const manager = createManager(createClient({ opened: false }))
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, [])
    const { result } = res
    let msg = 'result should be a boolean'
    assert.equal(typeof result, 'boolean', msg)
    msg = 'should not be listening'
    assert.equal(result, false, msg)
  })
})
