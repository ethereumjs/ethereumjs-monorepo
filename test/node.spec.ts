import { EventEmitter } from 'events'
import tape from 'tape-catch'
import td from 'testdouble'
import { Config } from '../lib/config'
import { PeerPool } from '../lib/net/peerpool'

tape('[Node]', async (t) => {
  const config = new Config({ transports: [], loglevel: 'error' })
  class FullEthereumService extends EventEmitter {
    open() {}
    start() {}
    stop() {}
    config = config
    pool = new PeerPool({ config })
  }
  FullEthereumService.prototype.open = td.func<any>()
  FullEthereumService.prototype.start = td.func<any>()
  FullEthereumService.prototype.stop = td.func<any>()
  td.replace('../lib/service', { FullEthereumService })
  td.when(FullEthereumService.prototype.open()).thenResolve()
  td.when(FullEthereumService.prototype.start()).thenResolve()
  td.when(FullEthereumService.prototype.stop()).thenResolve()

  class Server extends EventEmitter {
    open() {}
    start() {}
    stop() {}
  }
  Server.prototype.open = td.func<any>()
  Server.prototype.start = td.func<any>()
  Server.prototype.stop = td.func<any>()
  td.replace('../lib/net/server/server', { Server })
  td.when(Server.prototype.start()).thenResolve()
  td.when(Server.prototype.stop()).thenResolve()

  const { default: Node } = await import('../lib/node')

  t.test('should initialize correctly', (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const node = new Node({ config })
    t.ok(node.services[0] instanceof FullEthereumService, 'added service')
    t.end()
  })

  t.test('should open', async (t) => {
    t.plan(6)
    const servers = [new Server()] as any
    const config = new Config({ servers })
    const node = new Node({ config })
    node.on('error', (err: string) => {
      if (err === 'err0') t.pass('got err0')
      if (err === 'err1') t.pass('got err1')
    })
    node.on('listening', (details: string) => t.equals(details, 'details0', 'got listening'))
    node.on('synchronized', () => t.ok('got synchronized'))
    await node.open()
    servers[0].emit('error', 'err0')
    servers[0].emit('listening', 'details0')
    node.services[0].emit('error', 'err1')
    node.services[0].emit('synchronized')
    t.ok(node.opened, 'opened')
    t.equals(await node.open(), false, 'already opened')
  })

  t.test('should start/stop', async (t) => {
    const servers = [new Server()] as any
    const config = new Config({ servers })
    const node = new Node({ config })
    await node.start()
    t.ok(node.started, 'started')
    t.equals(await node.start(), false, 'already started')
    await node.stop()
    t.notOk(node.started, 'stopped')
    t.equals(await node.stop(), false, 'already stopped')
    t.end()
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
