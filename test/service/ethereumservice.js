const tape = require('tape-catch')
const td = require('testdouble')
const EventEmitter = require('events')
const { defaultLogger } = require('../../lib/logging')
defaultLogger.silent = true

tape('[EthereumService]', t => {
  class PeerPool extends EventEmitter {}
  PeerPool.prototype.open = td.func()
  td.replace('../../lib/net/peerpool', PeerPool)
  td.replace('../../lib/net/protocol/flowcontrol')
  const Chain = td.constructor()
  Chain.prototype.open = td.func()
  td.replace('../../lib/blockchain', { Chain })
  const EthHandler = td.constructor()
  const LesHandler = td.constructor()
  td.replace('../../lib/handler', { EthHandler, LesHandler })
  const EthProtocol = td.constructor()
  const LesProtocol = td.constructor()
  td.replace('../../lib/net/protocol/ethprotocol', EthProtocol)
  td.replace('../../lib/net/protocol/lesprotocol', LesProtocol)
  class FastSynchronizer extends EventEmitter {}
  class LightSynchronizer extends EventEmitter {}
  LightSynchronizer.prototype.sync = td.func()
  LightSynchronizer.prototype.stop = td.func()
  LightSynchronizer.prototype.open = td.func()
  td.replace('../../lib/sync/fastsync', FastSynchronizer)
  td.replace('../../lib/sync/lightsync', LightSynchronizer)
  const EthereumService = require('../../lib/service/ethereumservice')

  t.test('should initialize correctly', async (t) => {
    let service = new EthereumService({syncmode: 'light'})
    t.ok(service.synchronizer instanceof LightSynchronizer, 'light mode')
    service = new EthereumService({syncmode: 'fast', lightserv: true})
    t.ok(service.synchronizer instanceof FastSynchronizer, 'fast mode')
    t.ok(service.handlers[0] instanceof EthHandler, 'eth handler')
    t.ok(service.handlers[1] instanceof LesHandler, 'les handler')
    t.throws(() => new EthereumService({syncmode: 'unknown'}), /Unsupported/, 'bad syncmode')
    t.equals(service.name, 'eth', 'got name')
    t.end()
  })

  t.test('should get protocols', async (t) => {
    let service = new EthereumService({syncmode: 'light'})
    t.ok(service.protocols()[0] instanceof LesProtocol, 'light protocols')
    service = new EthereumService({syncmode: 'fast', lightserv: true})
    t.ok(service.protocols()[0] instanceof EthProtocol, 'fast protocols')
    t.ok(service.protocols()[1] instanceof LesProtocol, 'lightserv protocols')
    t.end()
  })

  t.test('should open', async (t) => {
    t.plan(3)
    const server = td.object()
    let service = new EthereumService({
      servers: [ server ]
    })
    await service.open()
    td.verify(service.chain.open())
    td.verify(service.synchronizer.open())
    td.verify(server.addProtocols(td.matchers.anything()))
    service.on('synchronized', stats => t.equals(stats, 'stats0', 'got stats'))
    service.once('error', err => t.equals(err, 'error0', 'got error 1'))
    service.synchronizer.emit('synchronized', 'stats0')
    service.synchronizer.emit('error', 'error0')
    service.once('error', err => t.equals(err, 'error1', 'got error 2'))
    service.pool.emit('banned', 'peer0')
    service.pool.emit('added', 'peer0')
    service.pool.emit('removed', 'peer0')
    service.pool.emit('error', 'error1')
  })

  t.test('should start/stop', async (t) => {
    const server = td.object()
    let service = new EthereumService({servers: [server]})
    await service.start()
    td.verify(service.synchronizer.sync())
    t.notOk(await service.start(), 'already started')
    await service.stop()
    td.verify(service.synchronizer.stop())
    td.verify(server.start())
    t.notOk(await service.stop(), 'already stopped')
    t.end()
  })

  t.test('should reset td', t => {
    td.reset()
    t.end()
  })
})
