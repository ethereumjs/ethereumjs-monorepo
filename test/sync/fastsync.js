const tape = require('tape-catch')
const td = require('testdouble')
const BN = require('bn.js')
const EventEmitter = require('events')
const { defaultLogger } = require('../../lib/logging')
defaultLogger.silent = true

tape('[FastSynchronizer]', t => {
  class PeerPool extends EventEmitter {}
  td.replace('../../lib/net/peerpool', PeerPool)
  const BlockPool = td.constructor()
  BlockPool.prototype.open = td.func()
  BlockPool.prototype.add = td.func()
  td.when(BlockPool.prototype.open()).thenResolve()
  td.when(BlockPool.prototype.add('blocks')).thenResolve()
  const blocks = [{header: {number: 1}}, {header: {number: 2}}]
  td.when(BlockPool.prototype.add(blocks)).thenReject(new Error('err0'))
  td.replace('../../lib/blockchain', { BlockPool })
  class BlockFetcher extends EventEmitter {}
  BlockFetcher.prototype.add = td.func()
  BlockFetcher.prototype.open = td.func()
  td.when(BlockFetcher.prototype.open()).thenResolve()
  BlockFetcher.prototype.start = function () {
    this.running = true
    this.emit('blocks', 'blocks')
    this.emit('blocks', blocks)
    this.emit('error', new Error('err1'), 'task', 'peer')
    setTimeout(() => this.emit('blocks', blocks), 20)
  }
  BlockFetcher.prototype.stop = async function () { this.running = false }
  td.replace('../../lib/sync/blockfetcher', BlockFetcher)
  const FastSynchronizer = require('../../lib/sync/fastsync')

  t.test('should initialize correctly', async (t) => {
    const pool = new PeerPool()
    const sync = new FastSynchronizer({pool})
    sync.handle = td.func()
    pool.emit('added', { eth: true, inbound: false })
    pool.emit('message:eth', 'msg0', 'peer0')
    td.verify(sync.handle('msg0', 'peer0'))
    t.equals(sync.type, 'fast', 'fast type')
    t.end()
  })

  t.test('should open', async (t) => {
    const sync = new FastSynchronizer({pool: new PeerPool()})
    sync.chain = {
      open: td.func(),
      blocks: {
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

  t.test('should get height', async (t) => {
    const pool = new PeerPool()
    const sync = new FastSynchronizer({pool})
    const peer = {eth: {getBlockHeaders: td.func(), status: {bestHash: 'hash'}}}
    const headers = [{number: 5}]
    td.when(peer.eth.getBlockHeaders({block: 'hash', max: 1})).thenResolve(headers)
    t.equals((await sync.height(peer)).toNumber(), 5, 'got height')
    t.end()
  })

  t.test('should find origin', async (t) => {
    t.plan(3)
    const sync = new FastSynchronizer({interval: 1, pool: new PeerPool()})
    sync.height = td.func()
    sync.chain = {blocks: {td: new BN(1)}}
    sync.pool = {peers: []}
    const peers = [
      {eth: {status: {td: new BN(1)}}, inbound: false},
      {eth: {status: {td: new BN(2)}}, inbound: false}
    ]
    td.when(sync.height(peers[0])).thenDo(peer => Promise.resolve(peer.eth.status.td))
    td.when(sync.height(peers[1])).thenDo(peer => Promise.resolve(peer.eth.status.td))
    sync.origin().then(([best, height]) => {
      t.equals(best, peers[1], 'found best')
      t.equals(height.toNumber(), 2, 'correct height')
    })
    setTimeout(() => { sync.pool.peers = peers }, 2)
    setTimeout(async () => {
      peers.push({eth: {status: {td: new BN(3)}}, inbound: false})
      sync.pool.ban = td.func()
      td.when(sync.pool.ban(peers[2])).thenThrow('err0')
      td.when(sync.height(peers[2])).thenReject(new Error('err0'))
      try {
        await sync.origin()
      } catch (err) {
        t.equals(err, 'err0', 'threw error')
      }
    }, 100)
  })

  t.test('should sync', async (t) => {
    t.plan(3)
    const sync = new FastSynchronizer({interval: 1, pool: new PeerPool()})
    sync.origin = td.func()
    td.when(sync.origin()).thenResolve(['origin', new BN(2)])
    sync.chain = {blocks: {height: new BN(3)}}
    sync.once('synchronized', info => t.equals(info.count, 0, 'first > last'))
    await sync.sync()
    sync.chain = {blocks: {height: new BN(0)}}
    sync.once('synchronized', info => t.equals(info.count, 2, 'synched 2 blocks'))
    setTimeout(() => sync.stop(), 10)
    sync.sync()
    process.nextTick(async () => {
      t.notOk(await sync.sync(), 'already syncing')
    })
  })

  t.test('should handle messages', async (t) => {
    const sync = new FastSynchronizer({interval: 1, pool: new PeerPool()})
    sync.chain = {open: td.func()}
    td.when(sync.chain.open()).thenResolve()
    sync.sync = td.func()
    await sync.handle({name: 'NewBlockHashes', data: [[0, 2]]})
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
