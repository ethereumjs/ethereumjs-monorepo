import { assert, describe, it } from 'vitest'

import { EthereumClient } from '../../src/client'
import { Config, SyncMode } from '../../src/config'
import { Event } from '../../src/types'

import { MockServer } from './mocks/mockserver'

const serverConfig = new Config({ accountCache: 10000, storageCache: 1000 })
const server = new MockServer({ config: serverConfig }) as any
const config = new Config({
  server,
  syncmode: SyncMode.Full,
  lightserv: false,
  accountCache: 10000,
  storageCache: 1000,
})

// attach server to centralized event bus
;(config.server!.config as any).events = config.events
const client = await EthereumClient.create({ config })

describe('client should start/stop/error', async () => {
  client.config.events.on(Event.SERVER_ERROR, (err) => {
    it('should get error', () => {
      assert.equal(err.message, 'err0', 'got error')
    })
  })
  client.config.events.on(Event.SERVER_LISTENING, (details: any) => {
    it('should be listening', () => {
      assert.deepEqual(details, { transport: 'mock', url: 'mock://127.0.0.1' }, 'server listening')
    })
  })
  await client.open()
  ;(client.service('eth') as any).interval = 100
  client.config.events.emit(Event.SERVER_ERROR, new Error('err0'), client.config.server!)
  await client.start()
  assert.ok((client.service('eth') as any).synchronizer.running, 'sync running')
  await client.stop()
  it('should stop', () => {
    assert.ok(true, 'client stopped')
  })
}, 60000)
