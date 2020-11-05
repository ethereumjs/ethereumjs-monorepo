import tape from 'tape-catch'
import { BN } from 'ethereumjs-util'
import { Config } from '../../lib/config'
import { EventEmitter } from 'events'
const td = require('testdouble')

tape('[FastSynchronizer]', (t) => {
  class PeerPool extends EventEmitter {}
  td.replace('../../lib/net/peerpool', PeerPool)
  class BlockFetcher extends EventEmitter {}
  ;(BlockFetcher.prototype as any).fetch = td.func() // eslint-disable-line no-extra-semi
  td.replace('../../lib/sync/fetcher', { BlockFetcher })
  const FastSynchronizer = require('../../lib/sync/fastsync').FastSynchronizer

  t.test('should initialize correctly', async (t) => {
    const pool = new PeerPool()
    const sync = new FastSynchronizer({ config: new Config({ transports: [] }), pool })
    pool.emit('added', { eth: true })
    t.equals(sync.type, 'fast', 'fast type')
    t.end()
  })

  t.test('should open', async (t) => {
    const sync = new FastSynchronizer({
      config: new Config({ loglevel: 'error', transports: [] }),
      pool: new PeerPool(),
    })
    sync.chain = {
      open: td.func(),
      blocks: {
        height: '1',
        td: '10',
        latest: { hash: () => '1234567890' },
      },
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
    const sync = new FastSynchronizer({ config: new Config({ transports: [] }), pool })
    const peer = { eth: { getBlockHeaders: td.func(), status: { bestHash: 'hash' } } }
    const headers = [{ number: 5 }]
    td.when(peer.eth.getBlockHeaders({ block: 'hash', max: 1 })).thenResolve(headers)
    const latest = await sync.latest(peer)
    t.equals(new BN(latest.number).toNumber(), 5, 'got height')
    t.end()
  })

  t.test('should find best', async (t) => {
    const sync = new FastSynchronizer({
      config: new Config({ transports: [] }),
      interval: 1,
      pool: new PeerPool(),
    })
    sync.running = true
    sync.height = td.func()
    sync.chain = { blocks: { td: new BN(1) } }
    const peers = [
      { eth: { status: { td: new BN(1) } }, inbound: false },
      { eth: { status: { td: new BN(2) } }, inbound: false },
    ]
    sync.pool = { peers }
    sync.forceSync = true
    td.when(sync.height(peers[0])).thenDo((peer: any) => Promise.resolve(peer.eth.status.td))
    td.when(sync.height(peers[1])).thenDo((peer: any) => Promise.resolve(peer.eth.status.td))
    t.equals(sync.best(), peers[1], 'found best')
    t.end()
  })

  t.test('should sync', async (t) => {
    t.plan(3)
    const sync = new FastSynchronizer({
      config: new Config({ transports: [] }),
      interval: 1,
      pool: new PeerPool(),
    })
    sync.best = td.func()
    sync.latest = td.func()
    td.when(sync.best()).thenReturn('peer')
    td.when(sync.latest('peer')).thenResolve({ number: 2 })
    td.when((BlockFetcher.prototype as any).fetch(), { delay: 20 }).thenResolve()
    sync.chain = { blocks: { height: new BN(3) } }
    t.notOk(await sync.sync(), 'local height > remote height')
    sync.chain = { blocks: { height: new BN(0) } }
    t.ok(await sync.sync(), 'local height < remote height')
    td.when((BlockFetcher.prototype as any).fetch()).thenReject('err0')
    try {
      await sync.sync()
    } catch (err) {
      t.equals(err, 'err0', 'got error')
    }
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
