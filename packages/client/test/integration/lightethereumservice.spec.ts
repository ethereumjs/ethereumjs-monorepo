import tape from 'tape'
import { setup, destroy } from './util'

tape('[Integration:LightEthereumService]', async (t) => {
  t.test('should handle LES requests', async (t) => {
    const [server, service] = await setup()
    // TO DO: test handlers once they are implemented
    await destroy(server, service)
    t.end()
  })
})
