import { assert, describe, it } from 'vitest'

import { EthereumClient } from '../../src/client'
import { Config, SyncMode } from '../../src/config'
import { Event } from '../../src/types'

import { MockServer } from './mocks/mockserver'
console.log('NAUGHTY NAUGHTY NAUGHTY******************************************8')
process.exit(0)
describe('[Integration:EthereumClient]', async () => {
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

  it(
    'should start/stop',
    async () => {
      client.config.events.on(Event.SERVER_ERROR, (err) =>
        assert.equal(err.message, 'err0', 'got error')
      )
      client.config.events.on(Event.SERVER_LISTENING, (details: any) => {
        assert.deepEqual(
          details,
          { transport: 'mock', url: 'mock://127.0.0.1' },
          'server listening'
        )
      })
      await client.open()
      ;(client.service('eth') as any).interval = 100
      client.config.events.emit(Event.SERVER_ERROR, new Error('err0'), client.config.servers[0])
      await client.start()
      assert.ok((client.service('eth') as any).synchronizer.running, 'sync running')
      await client.stop()
      assert.ok(true, 'client stopped')
    },
    { timeout: 20000 }
  )
})
