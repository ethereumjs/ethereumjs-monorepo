import tape from 'tape-catch'
import { Config } from '../lib/config'
import { RlpxServer } from '../lib/net/server'
import { PeerPool } from '../lib/net/peerpool'
const EventEmitter = require('events')
const td = require('testdouble')

tape.skip('[Node]', (t) => {
  const config = new Config({ loglevel: 'error', transports: [] })
  class EthereumService extends EventEmitter {}
  EthereumService.prototype.open = td.func()
  EthereumService.prototype.start = td.func()
  EthereumService.prototype.stop = td.func()
  EthereumService.prototype.config = config
  EthereumService.prototype.pool = new PeerPool({ config })
  td.when(EthereumService.prototype.open()).thenResolve()
  td.when(EthereumService.prototype.start()).thenResolve()
  td.when(EthereumService.prototype.stop()).thenResolve()
  td.replace('../lib/service/ethereumservice', { EthereumService })
  class Server extends EventEmitter {}
  Server.prototype.open = td.func()
  Server.prototype.start = td.func()
  Server.prototype.stop = td.func()
  td.when(Server.prototype.start()).thenResolve()
  td.when(Server.prototype.stop()).thenResolve()
  td.replace('../lib/net/server/server', Server)
  const Node = require('../lib/node').default

  t.test('should initialize correctly', (t) => {
    const node = new Node({ config })
    t.ok(node.services[0] instanceof EthereumService, 'added service')
    t.end()
  })

  t.test('should open', async (t) => {
    t.plan(6)
    const servers = [new Server() as RlpxServer]
    const node = new Node({ config: new Config({ servers }) })
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
    const servers = [new Server() as RlpxServer]
    const node = new Node({ config: new Config({ servers }) })
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
