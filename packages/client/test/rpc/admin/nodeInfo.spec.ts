import tape from 'tape'
import { startRPC, createManager, createClient, params, baseRequest } from '../helpers'

const method = 'admin_nodeInfo'

tape(method, (t) => {
  const manager = createManager(createClient({ opened: true }))
  const server = startRPC(manager.getMethods())

  const req = params(method, [])

  const expectRes = (res: any) => {
    const { result } = res.body
    if (result) {
      t.pass('admin_nodeInfo returns a value')
    } else {
      throw new Error('no return value')
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})
