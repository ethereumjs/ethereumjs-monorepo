import tape from 'tape'
import { startRPC, createManager, createClient, params, baseRequest } from '../helpers'

const method = 'net_peerCount'

tape(`${method}: call`, (t) => {
  const manager = createManager(createClient({ opened: true }))
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    const msg = 'result should be a hex number'
    if (result.substring(0, 2) !== '0x') {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})
