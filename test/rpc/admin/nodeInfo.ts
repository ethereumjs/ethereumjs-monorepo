import tape from 'tape'
import { startRPC, createManager, createNode, params, baseRequest } from '../helpers'

const method = 'admin_nodeInfo'

tape(method, (t) => {
  const manager = createManager(createNode({ opened: true }))
  const server = startRPC(manager.getMethods())

  const req = params(method, [])

  const expectRes = (res: any) => {
    const msg = 'should return the correct info'
    const { result } = res.body
    if (result) {
      t.pass(msg)
    } else {
      throw new Error(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})

