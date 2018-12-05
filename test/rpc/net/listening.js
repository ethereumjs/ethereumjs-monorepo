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

test('call net_listening while listening', t => {
  const manager = createManager(createNode(true))
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'net_listening',
    params: [],
    id: 1
  }

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(req)
    .expect(200)
    .expect(res => {
      const { result } = res.body
      if (typeof result !== 'boolean') {
        throw new Error('Result should be a boolean, but is not')
      }

      if (result !== true) {
        throw new Error('Not listening, when it should be')
      }
    })
    .end((err, res) => {
      closeRPC(server)
      t.end(err)
    })
})

test('call net_listening while not listening', t => {
  const manager = createManager(createNode(false))
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'net_listening',
    params: [],
    id: 1
  }

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(req)
    .expect(200)
    .expect(res => {
      const { result } = res.body
      if (typeof result !== 'boolean') {
        throw new Error('Result should be a boolean, but is not')
      }

      if (result !== false) {
        throw new Error('Listening, when it not should be')
      }
    })
    .end((err, res) => {
      closeRPC(server)
      t.end(err)
    })
})
