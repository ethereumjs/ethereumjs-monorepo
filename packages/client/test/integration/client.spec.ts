import tape from 'tape'
import { Config } from '../../lib/config'
import EthereumClient from '../../lib/client'
import MockServer from './mocks/mockserver'
import { Event } from '../../lib/types'

tape('[Integration:EthereumClient]', (t) => {
  const serverConfig = new Config({ loglevel: 'error' })
  const servers = [new MockServer({ config: serverConfig }) as any]
  const config = new Config({ servers, syncmode: 'full', lightserv: false, loglevel: 'error' })
  const node = new EthereumClient({ config })

  t.test('should start/stop', async (t) => {
    t.plan(3)
    node.config.events.on(Event.CLIENT_ERROR, (err: any) => t.equal(err, 'err0', 'got error'))
    node.config.events.on(Event.CLIENT_LISTENING, (details: any) => {
      t.deepEqual(details, { transport: 'mock', url: 'mock://127.0.0.1' }, 'server listening')
    })
    await node.open()
    ;(node.service('eth') as any).interval = 100
    node.service('eth')?.emit('error', 'err0')
    await node.start()
    t.ok((node.service('eth') as any).synchronizer.running, 'sync running')
    await node.stop()
    t.pass('node stopped')
  })
})
