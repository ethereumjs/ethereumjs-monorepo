import tape from 'tape'
import Common from '@ethereumjs/common'
import { BN } from 'ethereumjs-util'
import { Event } from '../../lib/types'
import genesisJSON from '../testdata/geth-genesis/post-merge.json'
import { parseCustomParams } from '../../lib/util'
import { wait, setup, destroy } from './util'

tape('[Integration:BeaconSync]', async (t) => {
  const params = await parseCustomParams(genesisJSON, 'post-merge')
  const common = new Common({
    chain: params.name,
    customChains: [params],
  })
  common.setHardforkByBlockNumber(new BN(0), new BN(0))

  t.test('should sync blocks', async (t) => {
    const [remoteServer, remoteService] = await setup({ location: '127.0.0.2', height: 20, common })
    const [localServer, localService] = await setup({ location: '127.0.0.1', height: 0, common })
    ;(localService.synchronizer as any).skeleton.status.progress.subchains = [
      {
        head: new BN(21),
        tail: new BN(21),
        next: (await remoteService.chain.getLatestHeader()).hash(),
      },
    ]
    await localService.synchronizer.stop()
    await localServer.discover('remotePeer1', '127.0.0.2')
    localService.config.events.on(Event.SYNC_SYNCHRONIZED, async () => {
      t.equals(localService.chain.blocks.height.toNumber(), 20, 'synced')
      await destroy(localServer, localService)
      await destroy(remoteServer, remoteService)
    })
    await localService.synchronizer.start()
  })

  t.test('should not sync with stale peers', async (t) => {
    const [remoteServer, remoteService] = await setup({ location: '127.0.0.2', height: 9, common })
    const [localServer, localService] = await setup({ location: '127.0.0.1', height: 10, common })
    localService.config.events.on(Event.SYNC_SYNCHRONIZED, async () => {
      t.fail('synced with a stale peer')
    })
    await localServer.discover('remotePeer', '127.0.0.2')
    await wait(300)
    await destroy(localServer, localService)
    await destroy(remoteServer, remoteService)
    t.pass('did not sync')
  })

  t.test('should sync with best peer', async (t) => {
    const [remoteServer1, remoteService1] = await setup({
      location: '127.0.0.2',
      height: 7,
      common,
    })
    const [remoteServer2, remoteService2] = await setup({
      location: '127.0.0.3',
      height: 10,
      common,
    })
    const [localServer, localService] = await setup({
      location: '127.0.0.1',
      height: 0,
      common,
      minPeers: 2,
    })
    ;(localService.synchronizer as any).skeleton.status.progress.subchains = [
      {
        head: new BN(11),
        tail: new BN(11),
        next: (await remoteService2.chain.getLatestHeader()).hash(),
      },
    ]
    localService.interval = 1000
    await localService.synchronizer.stop()
    await localServer.discover('remotePeer1', '127.0.0.2')
    await localServer.discover('remotePeer2', '127.0.0.3')

    localService.config.events.on(Event.SYNC_SYNCHRONIZED, async () => {
      if (localService.chain.blocks.height.toNumber() === 10) {
        t.pass('synced with best peer')
        await destroy(localServer, localService)
        await destroy(remoteServer1, remoteService1)
        await destroy(remoteServer2, remoteService2)
      }
    })
    await localService.synchronizer.start()
  })
})
