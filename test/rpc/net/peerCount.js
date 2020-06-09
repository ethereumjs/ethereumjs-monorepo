const test = require('tape')

const { startRPC, createManager, createNode, params, baseRequest } = require('../helpers')

const method = 'net_peerCount'

test(`${method}: call`, t => {
  const manager = createManager(createNode({ opened: true }))
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = res => {
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
