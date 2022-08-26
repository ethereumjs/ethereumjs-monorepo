import { isTruthy } from '@ethereumjs/util'
import * as tape from 'tape'

import { baseRequest, createClient, createManager, params, startRPC } from '../helpers'

const method = 'admin_nodeInfo'

tape(method, async (t) => {
  const manager = createManager(createClient({ opened: true }))
  const server = startRPC(manager.getMethods())

  const req = params(method, [])

  const expectRes = (res: any) => {
    const { result } = res.body
    if (isTruthy(result)) {
      t.pass('admin_nodeInfo returns a value')
    } else {
      throw new Error('no return value')
    }
  }
  await baseRequest(t, server, req, 200, expectRes)
})
