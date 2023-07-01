import * as tape from 'tape'

import { EthereumClient } from '../../src/client'
import { Config, SyncMode } from '../../src/config'
import { Event } from '../../src/types'

import { MockServer } from './mocks/mockserver'

tape('[Integration:EthereumClient]', async (t) => {
  const serverConfig = new Config({ accountCache: 10000, storageCache: 1000 })
  const servers = [new MockServer({ config: serverConfig }) as any]
  const config = new Config({
    servers,
    syncmode: SyncMode.Full,
    lightserv: false,
    accountCache: 10000,
    storageCache: 1000,
  })

  // attach server to centralized event bus
  ;(config.servers[0].config as any).events = config.events
  const client = await EthereumClient.create({ config })

  t.test('should start/stop', async (t) => {
    t.plan(4)
    client.config.events.on(Event.SERVER_ERROR, (err) => t.equal(err.message, 'err0', 'got error'))
    client.config.events.on(Event.SERVER_LISTENING, (details: any) => {
      t.deepEqual(details, { transport: 'mock', url: 'mock://127.0.0.1' }, 'server listening')
    })
    await client.open()
    ;(client.service('eth') as any).interval = 100
    client.config.events.emit(Event.SERVER_ERROR, new Error('err0'), client.config.servers[0])
    await client.start()
    t.ok((client.service('eth') as any).synchronizer.running, 'sync running')
    await client.stop()
    t.pass('client stopped')
  })
})
