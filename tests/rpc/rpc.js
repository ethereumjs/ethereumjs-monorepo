const test = require('tape')
const request = require('supertest')

const { startRPC, closeRPC } = require('./helpers')
const { METHOD_NOT_FOUND } = require('../../lib/rpc/error-code.js')

test('call JSON-RPC without Content-Type header', t => {
  const server = startRPC({})

  const req = 'plaintext'

  request(server)
    .post('/')
    .send(req)
    .expect(415)
    .end(err => {
      closeRPC(server)
      t.end(err)
    })
})

test('call JSON RPC with non-exist method', t => {
  const server = startRPC({})
  const req = {
    jsonrpc: '2.0',
    method: 'METHOD_DOES_NOT_EXIST',
    params: ['0x1', true],
    id: 1
  }

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(req)
    .expect(res => {
      if (!res.body.error) {
        throw new Error('should return an error object')
      }
      if (res.body.error.code !== METHOD_NOT_FOUND) {
        throw new Error(`should have an error code ${METHOD_NOT_FOUND}`)
      }
    })
    .end(err => {
      closeRPC(server)
      t.end(err)
    })
})
