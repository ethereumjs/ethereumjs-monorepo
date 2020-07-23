import tape from 'tape'
import { startRPC, createManager, createNode, params, baseRequest } from '../helpers'

const method = 'admin_nodeInfo'

<<<<<<< HEAD:test/rpc/admin/nodeInfo.ts
tape(method, (t) => {
=======
test(method, (t) => {
>>>>>>> chore: improve test:test/rpc/admin/nodeInfo.js
  const manager = createManager(createNode({ opened: true }))
  const server = startRPC(manager.getMethods())

  const req = params(method, [])

  const expectRes = (res: any) => {
    const msg = 'should return the correct info'
    const { result } = res.body
    if (result) {
      t.pass('admin_nodeInfo returns a value')
    } else {
      throw new Error(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})
