import { EventEmitter } from 'events'
import tape from 'tape-catch'
import td from 'testdouble'
import { Config } from '../../lib/config'

tape('[LightEthereumService]', async (t) => {
  class PeerPool extends EventEmitter {
    open() {}
    close() {}
  }
  PeerPool.prototype.open = td.func<any>()
  PeerPool.prototype.close = td.func<any>()
  td.replace('../../lib/net/peerpool', { PeerPool })
  const Chain = td.constructor([] as any)
  Chain.prototype.open = td.func()
  td.replace('../../lib/blockchain', { Chain })
  const LesProtocol = td.constructor([] as any)
  td.replace('../../lib/net/protocol/lesprotocol', { LesProtocol })
  class LightSynchronizer extends EventEmitter {
    start() {}
    stop() {}
    open() {}
  }
  LightSynchronizer.prototype.start = td.func<any>()
  LightSynchronizer.prototype.stop = td.func<any>()
  LightSynchronizer.prototype.open = td.func<any>()
  td.replace('../../lib/sync/lightsync', { LightSynchronizer })

  const { LightEthereumService } = await import('../../lib/service/lightethereumservice')

  t.test('should initialize correctly', async (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const service = new LightEthereumService({ config })
    t.ok(service.synchronizer instanceof LightSynchronizer, 'light sync')
    t.equals(service.name, 'eth', 'got name')
    t.end()
  })

  t.test('should get protocols', async (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const service = new LightEthereumService({ config })
    t.ok(service.protocols[0] instanceof LesProtocol, 'light protocols')
    t.end()
  })

  t.test('should open', async (t) => {
    t.plan(3)
    const server = td.object() as any
    const config = new Config({ servers: [server], loglevel: 'error' })
    const service = new LightEthereumService({ config })
    await service.open()
    td.verify(service.chain.open())
    td.verify(service.synchronizer.open())
    td.verify(server.addProtocols(td.matchers.anything()))
    service.on('synchronized', () => t.pass('synchronized'))
    service.once('error', (err: string) => t.equals(err, 'error0', 'got error 1'))
    service.synchronizer.emit('synchronized')
    service.synchronizer.emit('error', 'error0')
    service.once('error', (err: string) => t.equals(err, 'error1', 'got error 2'))
    service.pool.emit('banned', 'peer0')
    service.pool.emit('added', 'peer0')
    service.pool.emit('removed', 'peer0')
    service.pool.emit('error', 'error1')
  })

  t.test('should start/stop', async (t) => {
    const server = td.object() as any
    const config = new Config({ servers: [server], loglevel: 'error' })
    const service = new LightEthereumService({ config })
    await service.start()
    td.verify(service.synchronizer.start())
    t.notOk(await service.start(), 'already started')
    await service.stop()
    td.verify(service.synchronizer.stop())
    td.verify(server.start())
    t.notOk(await service.stop(), 'already stopped')
    t.end()
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
