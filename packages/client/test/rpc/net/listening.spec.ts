import * as tape from 'tape'
import { startRPC, createManager, createClient, params, baseRequest } from '../helpers'

const method = 'net_listening'

tape(`${method}: call while listening`, async (t) => {
  const manager = createManager(createClient({ opened: true }))
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    let msg = 'result should be a boolean'
    t.equal(typeof result, 'boolean', msg)
    msg = 'should be listening'
    t.equal(result, true, msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call while not listening`, async (t) => {
  const manager = createManager(createClient({ opened: false }))
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    let msg = 'result should be a boolean'
    t.equal(typeof result, 'boolean', msg)
    msg = 'should not be listening'
    t.equal(result, false, msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})
