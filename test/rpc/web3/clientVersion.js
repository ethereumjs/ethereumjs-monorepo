const test = require('tape')

const { platform } = require('os')
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

test('call web3_clientVersion', t => {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())

  const req = {
    jsonrpc: '2.0',
    method: 'web3_clientVersion',
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
      const { version } = require('../../../package.json')
      const expectedClientTitle = 'EthereumJS'
      const expectedPackageVersion = version
      const expectedPlatform = platform()
      const expectedNodeVersion = `node${process.version.substring(1)}`

      if (result.length === 0) {
        throw new Error('Empty result string')
      }

      const [
        actualClientTitle,
        actualPackageVersion,
        actualPlatform,
        actualNodeVersion
      ] = result.split('/')

      if (actualClientTitle !== expectedClientTitle) {
        throw new Error('Incorrect client title')
      }
      if (actualPackageVersion !== expectedPackageVersion) {
        throw new Error('Incorrect package version')
      }
      if (actualPlatform !== expectedPlatform) {
        throw new Error('Incorrect platform')
      }
      if (actualNodeVersion !== expectedNodeVersion) {
        throw new Error('Incorrect Node.js version')
      }
    })
    .end((err, res) => {
      closeRPC(server)
      t.end(err)
    })
})
