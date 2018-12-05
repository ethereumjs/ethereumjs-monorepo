const test = require('tape')

const request = require('supertest')
const Common = require('ethereumjs-common')
const { startRPC, closeRPC, createManager } = require('../helpers')
const blockChain = require('../blockChainStub.js')
const Chain = require('../../../lib/blockchain/chain.js')

function createNode (opened = true, commonChain = new Common('mainnet')) {
  let chain = new Chain({ blockchain: blockChain({}) })
  chain.opened = true
  return {
    services: [
      {
        name: 'eth',
        chain: chain,
        synchronizer: {
          pool: { peers: [1, 2, 3] }
        }
      }
    ],
    common: commonChain,
    opened
  }
}

test('call web3_sha3 with one valid parameter', t => {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'web3_sha3',
    params: ['0x68656c6c6f20776f726c64'],
    id: 1
  }

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(req)
    .expect(200)
    .expect(res => {
      const { result } = res.body
      if (result.length === 0) {
        throw new Error('Empty result string')
      }

      if (
        result !==
        '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad'
      ) {
        throw new Error('Hash returns incorrect value')
      }
    })
    .end((err, res) => {
      closeRPC(server)
      t.end(err)
    })
})

test('call web3_sha3 with one non-hex parameter', t => {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'web3_sha3',
    params: ['hello world'],
    id: 1
  }

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(req)
    .expect(200)
    .expect(res => {
      const { error } = res.body

      if (error.code !== -32602) {
        throw new Error('Incorrect error code')
      }

      if (
        error.message !== 'invalid argument 0: hex string without 0x prefix'
      ) {
        throw new Error('Incorrect error message')
      }
    })
    .end((err, res) => {
      closeRPC(server)
      t.end(err)
    })
})

test('call web3_sha3 with no parameters', t => {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'web3_sha3',
    params: [],
    id: 1
  }

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(req)
    .expect(200)
    .expect(res => {
      const { error } = res.body

      if (error.code !== -32602) {
        throw new Error('Incorrect error code')
      }

      if (error.message !== 'missing value for required argument 0') {
        throw new Error('Incorrect error message')
      }
    })
    .end((err, res) => {
      closeRPC(server)
      t.end(err)
    })
})
