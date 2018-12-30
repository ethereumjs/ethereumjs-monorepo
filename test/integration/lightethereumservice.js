'use strict'

const tape = require('tape')
const { LightEthereumService } = require('../../lib/service')
const MockServer = require('./mocks/mockserver.js')
const MockChain = require('./mocks/mockchain.js')
const { defaultLogger } = require('../../lib/logging')
defaultLogger.silent = true

tape('[Integration:LightEthereumService]', async (t) => {
  async function setup () {
    const server = new MockServer()
    const chain = new MockChain()
    const service = new LightEthereumService({
      servers: [ server ],
      chain
    })
    await service.open()
    await server.start()
    await service.start()
    return [server, service]
  }

  async function destroy (server, service) {
    await service.stop()
    await server.stop()
  }

  t.test('should handle LES requests', async (t) => {
    const [server, service] = await setup()
    // TO DO: test handlers once they are implemented
    await destroy(server, service)
    t.end()
  })
})
