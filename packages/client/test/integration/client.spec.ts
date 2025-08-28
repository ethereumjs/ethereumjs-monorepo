import { assert, describe, it } from 'vitest'

import { EthereumClient } from '../../src/client.ts'
import { Config, SyncMode } from '../../src/config.ts'
import { Event } from '../../src/types.ts'

import { MockServer } from './mocks/mockserver.ts'

const serverConfig = new Config({ accountCache: 10000, storageCache: 1000 })
const server = new MockServer({ config: serverConfig }) as any
const config = new Config({
  server,
  syncmode: SyncMode.Full,

  accountCache: 10000,
  storageCache: 1000,
})

// attach server to centralized event bus
/// @ts-expect-error -- Overwriting events
config.server.config.events = config.events
const client = await EthereumClient.create({ config })

describe('client should start/stop/error', async () => {
  client.config.events.on(Event.SERVER_ERROR, (err) => {
    it('should get error', () => {
      assert.strictEqual(err.message, 'err0', 'got error')
    })
  })
  client.config.events.on(Event.SERVER_LISTENING, (details: any) => {
    it('should be listening', () => {
      assert.deepEqual(details, { transport: 'mock', url: 'mock://127.0.0.1' }, 'server listening')
    })
  })
  await client.open()
  client.service.interval = 100
  client.config.events.emit(Event.SERVER_ERROR, new Error('err0'), client.config.server!)
  await client.start()
  assert.isTrue(client.service?.synchronizer?.running, 'sync running')
  await client.stop()
  it('should stop', () => {
    assert.isTrue(true, 'client stopped')
  })
}, 60000)
