const test = require('tape')

const request = require('supertest')
const Common = require('ethereumjs-common').default
const { startRPC, closeRPC, createManager, createNode } = require('../helpers')

test('call net_version on ropsten', t => {
  const manager = createManager(createNode({ opened: true, commonChain: new Common('ropsten') }))
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'net_version',
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

      if (typeof result !== 'string') {
        throw new Error('Result should be a string, but is not')
      }

      if (result.length === 0) {
        throw new Error('Empty result string')
      }

      if (result !== '3') {
        throw new Error(`Incorrect chain ID. Expected: 3, Received: ${result}`)
      }
    })
    .end((err, res) => {
      closeRPC(server)
      t.end(err)
    })
})

test('call net_version on mainnet', t => {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'net_version',
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

      if (typeof result !== 'string') {
        throw new Error('Result should be a string, but is not')
      }

      if (result.length === 0) {
        throw new Error('Empty result string')
      }

      if (result !== '1') {
        throw new Error(`Incorrect chain ID. Expected: 1, Received: ${result}`)
      }
    })
    .end((err, res) => {
      closeRPC(server)
      t.end(err)
    })
})

test('call net_version on rinkeby', t => {
  const manager = createManager(createNode({ opened: true, commonChain: new Common('rinkeby') }))
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'net_version',
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

      if (typeof result !== 'string') {
        throw new Error('Result should be a string, but is not')
      }

      if (result.length === 0) {
        throw new Error('Empty result string')
      }

      if (result !== '4') {
        throw new Error(`Incorrect chain ID. Expected: 4, Received: ${result}`)
      }
    })
    .end((err, res) => {
      closeRPC(server)
      t.end(err)
    })
})

test('call net_version on kovan', t => {
  const manager = createManager(createNode({ opened: true, commonChain: new Common('kovan') }))
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'net_version',
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

      if (typeof result !== 'string') {
        throw new Error('Result should be a string, but is not')
      }

      if (result.length === 0) {
        throw new Error('Empty result string')
      }

      if (result !== '42') {
        throw new Error(
          `Incorrect chain ID. Expected: 42, Received: ${result}`
        )
      }
    })
    .end((err, res) => {
      closeRPC(server)
      t.end(err)
    })
})

test('call net_version on goerli', t => {
  const manager = createManager(createNode({ opened: true, commonChain: new Common('goerli') }))
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'net_version',
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

      if (typeof result !== 'string') {
        throw new Error('Result should be a string, but is not')
      }

      if (result.length === 0) {
        throw new Error('Empty result string')
      }

      if (result !== '5') {
        throw new Error(
          `Incorrect chain ID. Expected: 5, Received: ${result}`
        )
      }
    })
    .end((err, res) => {
      closeRPC(server)
      t.end(err)
    })
})
