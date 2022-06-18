import * as tape from 'tape'
import { Config, SyncMode } from '../../lib/config'
import EthereumClient from '../../lib/client'
import { Event } from '../../lib/types'
import MockServer from './mocks/mockserver'

tape('[Integration:EthereumClient]', (t) => {
  const serverConfig = new Config()
  const servers = [new MockServer({ config: serverConfig }) as any]
  const config = new Config({ servers, syncmode: SyncMode.Full, lightserv: false })

  // attach server to centralized event bus
  ;(config.servers[0].config as any).events = config.events
  const node = new EthereumClient({ config })

  t.test('should start/stop', async (t) => {
    t.plan(4)
    node.config.events.on(Event.SERVER_ERROR, (err) => t.equal(err.message, 'err0', 'got error'))
    node.config.events.on(Event.SERVER_LISTENING, (details: any) => {
      t.deepEqual(details, { transport: 'mock', url: 'mock://127.0.0.1' }, 'server listening')
    })
    await node.open()
    ;(node.service('eth') as any).interval = 100
    node.config.events.emit(Event.SERVER_ERROR, new Error('err0'), node.config.servers[0])
    await node.start()
    t.ok((node.service('eth') as any).synchronizer.running, 'sync running')
    await node.stop()
    t.pass('node stopped')
  })
})
