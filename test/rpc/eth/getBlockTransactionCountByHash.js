const test = require('tape')

const request = require('supertest')
const { INVALID_PARAMS } = require('../../../lib/rpc/error-code')
const { startRPC, closeRPC, createManager, createNode } = require('../helpers')
const { checkError } = require('../util')

test('call eth_getBlockTransactionCountByHash with valid arguments', t => {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'eth_getBlockTransactionCountByHash',
    params: [
      '0x910abca1728c53e8d6df870dd7af5352e974357dc58205dea1676be17ba6becf'
    ],
    id: 1
  }

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(req)
    .expect(200)
    .expect(res => {
      if (res.body.result !== `0x1`) {
        throw new Error('transaction count is not 1')
      }
    })
    .end((err, res) => {
      closeRPC(server)
      t.end(err)
    })
})

test('call eth_getBlockTransactionCountByHash with invalid block hash without 0x', t => {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'eth_getBlockTransactionCountByHash',
    params: ['WRONG BLOCK NUMBER'],
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

test('call eth_getBlockTransactionCountByHash with invalid hex string as block hash', t => {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'eth_getBlockTransactionCountByHash',
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

test('call eth_getBlockTransactionCountByHash without first parameter', t => {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'eth_getBlockTransactionCountByHash',
    params: [],
    id: 1
  }

  const checkInvalidParams = checkError(
    INVALID_PARAMS,
    'missing value for required argument 0'
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

test('call eth_getBlockTransactionCountByHash with invalid second parameter', t => {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'eth_getBlockTransactionCountByHash',
    params: ['INVALID PARAMETER'],
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
