const test = require('tape')

const request = require('supertest')
const { startRPC, closeRPC, createManager, createNode } = require('../helpers')

test('call eth_protocolVersion ', t => {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'eth_protocolVersion',
    params: [],
    id: 1
  }

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(req)
    .expect(200)
    .expect(res => {
      const responseBlob = res.body
      if (typeof responseBlob.result !== 'string') {
        throw new Error('Protocol version is not a string')
      }
    })
    .end((err, res) => {
      closeRPC(server)
      t.end(err)
    })
})
