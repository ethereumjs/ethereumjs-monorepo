import tape from 'tape'
import { wait, setup, destroy } from './util'

tape('[Integration:LightSync]', async (t) => {
  t.test('should sync headers', async (t) => {
    const [remoteServer, remoteService] = await setup({
      location: '127.0.0.2',
      height: 20,
      syncmode: 'full',
    })
    const [localServer, localService] = await setup({
      location: '127.0.0.1',
      height: 0,
      syncmode: 'light',
    })
    await localService.synchronizer.stop()
    await localServer.discover('remotePeer1', '127.0.0.2')
    localService.on('synchronized', async () => {
      t.equals(localService.chain.headers.height.toNumber(), 20, 'synced')
      await destroy(localServer, localService)
      await destroy(remoteServer, remoteService)
      t.end()
    })
    await localService.synchronizer.start()
  })

  t.test('should not sync with stale peers', async (t) => {
    const [remoteServer, remoteService] = await setup({
      location: '127.0.0.2',
      height: 9,
      syncmode: 'full',
    })
    const [localServer, localService] = await setup({
      location: '127.0.0.1',
      height: 10,
      syncmode: 'light',
    })
    localService.on('synchronized', async () => {
      t.fail('synced with a stale peer')
    })
    await localServer.discover('remotePeer', '127.0.0.2')
    await wait(100)
    await destroy(localServer, localService)
    await destroy(remoteServer, remoteService)
    t.pass('did not sync')
    t.end()
  })

  t.test('should sync with best peer', async (t) => {
    const [remoteServer1, remoteService1] = await setup({
      location: '127.0.0.2',
      height: 9,
      syncmode: 'full',
    })
    const [remoteServer2, remoteService2] = await setup({
      location: '127.0.0.3',
      height: 10,
      syncmode: 'full',
    })
    const [localServer, localService] = await setup({
      location: '127.0.0.1',
      height: 0,
      syncmode: 'light',
    })
    await localService.synchronizer.stop()
    await localServer.discover('remotePeer1', '127.0.0.2')
    await localServer.discover('remotePeer2', '127.0.0.3')
    localService.on('synchronized', async () => {
      t.equals(localService.chain.headers.height.toNumber(), 10, 'synced with best peer')
      await destroy(localServer, localService)
      await destroy(remoteServer1, remoteService1)
      await destroy(remoteServer2, remoteService2)
      t.end()
    })
    await localService.synchronizer.start()
  })
})
