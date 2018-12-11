const tape = require('tape-catch')
const td = require('testdouble')
const BN = require('bn.js')
const EventEmitter = require('events')
const { defaultLogger } = require('../../lib/logging')
defaultLogger.silent = true

tape('[LightSynchronizer]', t => {
  class PeerPool extends EventEmitter {}
  td.replace('../../lib/net/peerpool', PeerPool)
  const HeaderPool = td.constructor()
  HeaderPool.prototype.open = td.func()
  HeaderPool.prototype.add = td.func()
  td.when(HeaderPool.prototype.open()).thenResolve()
  td.when(HeaderPool.prototype.add('headers')).thenResolve()
  const headers = [{number: 1}, {number: 2}]
  td.when(HeaderPool.prototype.add(headers)).thenReject(new Error('err0'))
  td.replace('../../lib/blockchain', { HeaderPool })
  class HeaderFetcher extends EventEmitter {}
  HeaderFetcher.prototype.add = td.func()
  HeaderFetcher.prototype.open = td.func()
  td.when(HeaderFetcher.prototype.open()).thenResolve()
  HeaderFetcher.prototype.start = function () {
    this.running = true
    this.emit('headers', 'headers')
    this.emit('headers', headers)
    this.emit('error', new Error('err1'), 'task', 'peer')
    setTimeout(() => this.emit('headers', headers), 20)
  }
  HeaderFetcher.prototype.stop = async function () { this.running = false }
  td.replace('../../lib/sync/headerfetcher', HeaderFetcher)
  const LightSynchronizer = require('../../lib/sync/lightsync')

  t.test('should initialize correctly', async (t) => {
    const pool = new PeerPool()
    const sync = new LightSynchronizer({pool})
    sync.handle = td.func()
    pool.emit('added', { eth: true, inbound: false })
    pool.emit('message:les', 'msg0', 'peer0')
    td.verify(sync.handle('msg0', 'peer0'))
    t.equals(sync.type, 'light', 'light type')
    t.end()
  })

  t.test('should open', async (t) => {
    const sync = new LightSynchronizer({pool: new PeerPool()})
    sync.chain = {
      open: td.func(),
      headers: {
        height: '1',
        td: '10',
        latest: {hash: () => '1234567890'}
      }
    }
    sync.pool.open = td.func()
    td.when(sync.chain.open()).thenResolve()
    td.when(sync.pool.open()).thenResolve()
    await sync.open()
    t.pass('opened')
    t.end()
  })

  t.test('should find origin', async (t) => {
    t.plan(2)
    const sync = new LightSynchronizer({interval: 1, pool: new PeerPool()})
    sync.syncing = true
    sync.chain = {headers: {td: new BN(1)}}
    sync.pool = {peers: []}
    const peers = [
      {les: {status: {headTd: new BN(1), headNum: new BN(1), serveHeaders: 1}}, inbound: false},
      {les: {status: {headTd: new BN(2), headNum: new BN(2), serveHeaders: 1}}, inbound: false}
    ]
    sync.origin().then(([best, height]) => {
      t.equals(best, peers[1], 'found best')
      t.equals(height.toNumber(), 2, 'correct height')
    })
    setTimeout(() => { sync.pool.peers = peers }, 2)
    setTimeout(async () => {
      peers.push({les: {status: {headTd: new BN(3), headNum: new BN(3), serveHeaders: 1}}, inbound: false})
    }, 100)
  })

  t.test('should sync', async (t) => {
    t.plan(3)
    const sync = new LightSynchronizer({interval: 1, pool: new PeerPool()})
    sync.origin = td.func()
    td.when(sync.origin()).thenResolve(['origin', new BN(2)])
    sync.chain = {headers: {height: new BN(3)}}
    sync.once('synchronized', info => t.equals(info.count, 0, 'first > last'))
    await sync.sync()
    sync.chain = {headers: {height: new BN(0)}}
    sync.once('synchronized', info => t.equals(info.count, 2, 'synched 2 headers'))
    setTimeout(() => sync.stop(), 10)
    sync.sync()
    process.nextTick(async () => {
      t.notOk(await sync.sync(), 'already syncing')
    })
  })

  t.test('should handle messages', async (t) => {
    const sync = new LightSynchronizer({interval: 1, pool: new PeerPool()})
    sync.chain = {open: td.func()}
    td.when(sync.chain.open()).thenResolve()
    sync.sync = td.func()
    await sync.handle({name: 'Announce', data: {headNumber: 2}})
    td.verify(sync.sync(2))
    await sync.handle({name: 'Unknown'})
    sync.on('error', err => t.equals(err, 'err0', 'got error'))
    td.when(sync.chain.open()).thenReject('err0')
    await sync.handle()
    t.end()
  })

  t.test('should reset td', t => {
    td.reset()
    t.end()
  })
})
