import tape from 'tape'
import { LightEthereumService } from '../../lib/service'
import MockServer from './mocks/mockserver'
import MockChain from './mocks/mockchain'
import { defaultLogger } from '../../lib/logging'
defaultLogger.silent = true

tape('[Integration:LightEthereumService]', async (t) => {
  async function setup() {
    const server = new MockServer()
    const chain = new MockChain()
    const service = new LightEthereumService({
      servers: [server],
      chain,
    })
    await service.open()
    await server.start()
    await service.start()
    return [server, service]
  }

  async function destroy(server: any, service: any) {
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
