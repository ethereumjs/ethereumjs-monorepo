const test = require('tape')

const { baseSetup, params, baseRequest } = require('../helpers')

const method = 'eth_protocolVersion'

test(`${method}: call`, t => {
  const server = baseSetup()

  const req = params(method, [])
  const expectRes = res => {
    const responseBlob = res.body
    const msg = 'protocol version should be a string'
    if (typeof responseBlob.result !== 'string') {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})
