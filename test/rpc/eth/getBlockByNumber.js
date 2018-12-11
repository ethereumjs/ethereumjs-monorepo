const test = require('tape')

const request = require('supertest')
const { INVALID_PARAMS } = require('../../../lib/rpc/error-code')
const { startRPC, closeRPC, createManager, createNode } = require('../helpers')

function createBlockchain () {
  const transactions = [
    {
      hash: '0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b'
    }
  ]
  const block = {
    toJSON: () => ({ number: 1, transactions })
  }
  return {
    getBlock: () => block
  }
}

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

test('call eth_getBlockByNumber with valid arguments', t => {
  const manager = createManager(createNode({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'eth_getBlockByNumber',
    params: ['0x1', true],
    id: 1
  }

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(req)
    .expect(200)
    .expect(res => {
      if (res.body.result.number !== 1) {
        throw new Error('number is not 1')
      }
    })
    .end((err, res) => {
      closeRPC(server)
      t.end(err)
    })
})

test('call eth_getBlockByNumber with false for second argument', t => {
  const manager = createManager(createNode({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'eth_getBlockByNumber',
    params: ['0x1', false],
    id: 1
  }

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(req)
    .expect(200)
    .expect(res => {
      if (res.body.result.number !== 1) {
        throw new Error('number is not 1')
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

test('call eth_getBlockByNumber with invalid block number', t => {
  const manager = createManager(createNode({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'eth_getBlockByNumber',
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

test('call eth_getBlockByNumber without second parameter', t => {
  const manager = createManager(createNode({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'eth_getBlockByNumber',
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

test('call eth_getBlockByNumber with invalid second parameter', t => {
  const manager = createManager(createNode({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'eth_getBlockByNumber',
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
