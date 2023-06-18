import { describe, it } from 'vitest'

import { destroy, setup } from './util'

describe('[Integration:LightEthereumService]', async () => {
  it('should handle LES requests', async () => {
    const [server, service] = await setup()
    // TO DO: test handlers once they are implemented
    await destroy(server, service)
  })
})
