import tape from 'tape'
import { startRPC, createManager, createNode, params, baseRequest } from '../helpers'

const method = 'net_listening'

tape(`${method}: call while listening`, (t) => {
  const manager = createManager(createNode({ opened: true }))
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    let msg = 'result should be a boolean'
    if (typeof result !== 'boolean') {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }

    msg = 'should be listening'
    if (result !== true) {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call while not listening`, (t) => {
  const manager = createManager(createNode({ opened: false }))
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    let msg = 'result should be a boolean'
    if (typeof result !== 'boolean') {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }

    msg = 'should not be listening'
    if (result !== false) {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})
