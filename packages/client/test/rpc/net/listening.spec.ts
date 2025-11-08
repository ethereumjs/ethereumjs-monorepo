import { assert, describe, it } from 'vitest'

import { createClient, createManager, getRPCClient, startRPC } from '../helpers.ts'

const method = 'net_listening'

describe(method, () => {
  it('call while listening', async () => {
    const manager = createManager(await createClient({ opened: true }))
    const rpc = getRPCClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, [])
    const { result } = res

    assert.strictEqual(typeof result, 'boolean', 'result should be a boolean')
    assert.strictEqual(result, true, 'should be listening')
  })

  it('call while not listening', async () => {
    const manager = createManager(await createClient({ opened: false }))
    const rpc = getRPCClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, [])
    const { result } = res
    assert.strictEqual(typeof result, 'boolean', 'result should be a boolean')
    assert.strictEqual(result, false, 'should not be listening')
  })
})
