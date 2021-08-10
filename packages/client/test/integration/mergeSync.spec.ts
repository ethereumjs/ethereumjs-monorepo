import Common, { Hardfork } from '@ethereumjs/common'
import tape from 'tape'
import { Event } from '../../lib/types'
import { setup, destroy } from './util'
import testnet from './chains/testnet.json'
tape('[Integration:MergeSync]', async (t) => {
  t.test('should sync blocks on a chain with the merge', async (t) => {
    const common = new Common({ chain: testnet, hardfork: Hardfork.Chainstart })
      const [remoteServer, remoteService] = await setup({
        location: '127.0.0.2',
        height: 20,
        common: common,
      })
      const [localServer, localService] = await setup({
        location: '127.0.0.1',
        height: 0,
        common: common,
      })
      await localService.synchronizer.stop()
      await localServer.discover('remotePeer1', '127.0.0.2')
      localService.config.events.on(Event.SYNC_SYNCHRONIZED, async () => {
        t.equals(localService.chain.blocks.height.toNumber(), 20, 'synced')
        await destroy(localServer, localService)
        await destroy(remoteServer, remoteService)
        t.end()
      })
      await localService.synchronizer.start()
  })
})
