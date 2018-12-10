const test = require('tape')

const request = require('supertest')
const { INVALID_PARAMS } = require('../../../lib/rpc/error-code')
const { startRPC, closeRPC, createManager, createNode } = require('../helpers')

function checkError (expectedCode, expectedMessage) {
  return function (res) {
    if (!res.body.error) {
      throw new Error('should return an error object')
    }
    if (res.body.error.code !== expectedCode) {
      throw new Error(`should have an error code ${expectedCode}`)
    }
    if (expectedMessage && res.body.error.message !== expectedMessage) {
      throw new Error(`should have an error message "${expectedMessage}"`)
    }
  }
}

test('call eth_getBlockByHash with valid arguments', t => {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'eth_getBlockByHash',
    params: [
      '0x910abca1728c53e8d6df870dd7af5352e974357dc58205dea1676be17ba6becf',
      true
    ],
    id: 1
  }

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(req)
    .expect(200)
    .expect(res => {
      if (res.body.result.number !== 444444) {
        throw new Error('number is not 444444')
      }
    })
    .end((err, res) => {
      closeRPC(server)
      t.end(err)
    })
})

test('call eth_getBlockByHash with false for second argument', t => {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'eth_getBlockByHash',
    params: [
      '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
      false
    ],
    id: 1
  }

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(req)
    .expect(200)
    .expect(res => {
      if (res.body.result.number !== 444444) {
        throw new Error('number is not 444444')
      }
      if (typeof res.body.result.transactions[0] !== 'string') {
        throw new Error('only the hashes of the transactions')
      }
    })
    .end((err, res) => {
      closeRPC(server)
      t.end(err)
    })
})

test('call eth_getBlockByHash with invalid block hash without 0x', t => {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'eth_getBlockByHash',
    params: ['WRONG BLOCK NUMBER', true],
    id: 1
  }
  const checkInvalidParams = checkError(
    INVALID_PARAMS,
    'invalid argument 0: hex string without 0x prefix'
  )

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(req)
    .expect(200)
    .expect(checkInvalidParams)
    .end(err => {
      closeRPC(server)
      t.end(err)
    })
})

test('call eth_getBlockByHash with invalid hex string as block hash', t => {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'eth_getBlockByHash',
    params: ['0xWRONG BLOCK NUMBER', true],
    id: 1
  }
  const checkInvalidParams = checkError(
    INVALID_PARAMS,
    'invalid argument 0: invalid block hash'
  )

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(req)
    .expect(200)
    .expect(checkInvalidParams)
    .end(err => {
      closeRPC(server)
      t.end(err)
    })
})

test('call eth_getBlockByHash without second parameter', t => {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'eth_getBlockByHash',
    params: ['0x0'],
    id: 1
  }

  const checkInvalidParams = checkError(
    INVALID_PARAMS,
    'missing value for required argument 1'
  )

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(req)
    .expect(200)
    .expect(checkInvalidParams)
    .end(err => {
      closeRPC(server)
      t.end(err)
    })
})

test('call eth_getBlockByHash with invalid second parameter', t => {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'eth_getBlockByHash',
    params: ['0x0', 'INVALID PARAMETER'],
    id: 1
  }

  const checkInvalidParams = checkError(INVALID_PARAMS)

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(req)
    .expect(200)
    .expect(checkInvalidParams)
    .end(err => {
      closeRPC(server)
      t.end(err)
    })
})
