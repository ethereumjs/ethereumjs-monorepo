import { assert, describe, it } from 'vitest'

import { Event } from '../../src/types.ts'

import { destroy, setup, wait } from './util.ts'

describe('should sync blocks', async () => {
  const [remoteServer, remoteService] = await setup({ location: '127.0.0.2', height: 20 })
  const [localServer, localService] = await setup({ location: '127.0.0.1', height: 0 })
  await localService.synchronizer!.stop()
  await localServer.discover('remotePeer1', '127.0.0.2')
  // await localService.synchronizer.sync()
  localService.config.events.on(Event.SYNC_SYNCHRONIZED, async () => {
    it('should sync', () => {
      assert.strictEqual(localService.chain.blocks.height, BigInt(20), 'synced')
    })
    await destroy(localServer, localService)
    await destroy(remoteServer, remoteService)
  })
  await localService.synchronizer!.start()
}, 60000)

describe('should not sync with stale peers', async () => {
  const [remoteServer, remoteService] = await setup({ location: '127.0.0.2', height: 9 })
  const [localServer, localService] = await setup({ location: '127.0.0.1', height: 10 })
  localService.config.events.on(Event.SYNC_SYNCHRONIZED, async () => {
    it('should not be synced', () => {
      assert.fail('synced with a stale peer')
    })
  })
  await localServer.discover('remotePeer', '127.0.0.2')
  await wait(300)
  await destroy(localServer, localService)
  await destroy(remoteServer, remoteService)
  it('should exit without syncing', () => {
    assert.isTrue(true, 'did not sync')
  })
}, 60000)

describe('should sync with best peer', async () => {
  const [remoteServer1, remoteService1] = await setup({ location: '127.0.0.2', height: 7 })
  const [remoteServer2, remoteService2] = await setup({ location: '127.0.0.3', height: 10 })
  const [localServer, localService] = await setup({
    location: '127.0.0.1',
    height: 0,
    minPeers: 2,
  })
  await localService.synchronizer!.stop()
  await localServer.discover('remotePeer1', '127.0.0.2')
  await localServer.discover('remotePeer2', '127.0.0.3')

  localService.config.events.on(Event.SYNC_SYNCHRONIZED, async () => {
    // TODO: this test, if `localService.chain.blocks.height !== BigInt(10)`
    // will NOT call the `destroy` methods. This will hang the entire test (and thus also CI)
    // Note: this `SYNC.SYNCHRONIZED` event can be called multiple times.
    // Therefore, even if the first peer chosen is not the best peer (height: 7)
    // it could be called afterwards when the next "best" peer chosen is actually height: 10
    // Tested locally, this seems to eventually always call destroy()
    // NOTE: we can set a timeout on the destroys, but this essentially fails the test
    // because somehow this synchronizer has not found the `height: 10` peer and synced
    // to it, while it still should sync to it
    if (localService.chain.blocks.height === BigInt(10)) {
      it('should sync with best peer', () => {
        assert.isTrue(true, 'synced with best peer')
      })
      await destroy(localServer, localService)
      await destroy(remoteServer1, remoteService1)
      await destroy(remoteServer2, remoteService2)
    }
  })
  await localService.synchronizer!.start()
}, 60000)
