import { assert, describe } from 'vitest'

import { baseRequest, createClient, createManager, params, startRPC } from '../helpers'

const method = 'net_listening'

describe(`${method}: call while listening`, async () => {
  const manager = createManager(createClient({ opened: true }))
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    let msg = 'result should be a boolean'
    assert.equal(typeof result, 'boolean', msg)
    msg = 'should be listening'
    assert.equal(result, true, msg)
  }
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: call while not listening`, async () => {
  const manager = createManager(createClient({ opened: false }))
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    let msg = 'result should be a boolean'
    assert.equal(typeof result, 'boolean', msg)
    msg = 'should not be listening'
    assert.equal(result, false, msg)
  }
  await baseRequest(server, req, 200, expectRes)
})
