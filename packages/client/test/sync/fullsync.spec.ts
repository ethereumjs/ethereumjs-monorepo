import { EventEmitter } from 'events'
import tape from 'tape-catch'
import td from 'testdouble'
import { BN } from 'ethereumjs-util'
import { Config } from '../../lib/config'
import { Chain } from '../../lib/blockchain'

tape('[FullSynchronizer]', async (t) => {
  class PeerPool extends EventEmitter {
    open() {}
    close() {}
  }
  PeerPool.prototype.open = td.func<any>()
  PeerPool.prototype.close = td.func<any>()
  td.replace('../../lib/net/peerpool', { PeerPool })
  class BlockFetcher extends EventEmitter {
    fetch() {}
  }
  BlockFetcher.prototype.fetch = td.func<any>()
  td.replace('../../lib/sync/fetcher/blockfetcher', { BlockFetcher })

  const { FullSynchronizer } = await import('../../lib/sync/fullsync')

  t.test('should initialize correctly', async (t) => {
    const config = new Config({ loglevel: 'error', transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const sync = new FullSynchronizer({ config, pool, chain })
    pool.emit('added', { eth: true })
    t.equals(sync.type, 'full', 'full type')
    t.end()
  })

  t.test('should open', async (t) => {
    const config = new Config({ loglevel: 'error', transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const sync = new FullSynchronizer({
      config,
      pool,
      chain,
    })
    ;(sync as any).pool.open = td.func<PeerPool['open']>()
    td.when((sync as any).pool.open()).thenResolve(null)
    await sync.open()
    t.pass('opened')
    await sync.stop()
    t.end()
  })

  t.test('should get height', async (t) => {
    const config = new Config({ loglevel: 'error', transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const sync = new FullSynchronizer({ config, pool, chain })
    const peer = { eth: { getBlockHeaders: td.func(), status: { bestHash: 'hash' } } }
    const headers = [{ number: 5 }]
    td.when(peer.eth.getBlockHeaders({ block: 'hash', max: 1 })).thenResolve(headers)
    const latest = await sync.latest(peer as any)
    t.equals(new BN(latest!.number).toNumber(), 5, 'got height')
    await sync.stop()
    t.end()
  })

  t.test('should find best', async (t) => {
    const config = new Config({ loglevel: 'error', transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const sync = new FullSynchronizer({
      config,
      interval: 1,
      pool,
      chain,
    })
    ;(sync as any).running = true
    ;(sync as any).height = td.func()
    ;(sync as any).chain = { blocks: { td: new BN(1) } }
    const peers = [
      { eth: { status: { td: new BN(1) } }, inbound: false },
      { eth: { status: { td: new BN(2) } }, inbound: false },
    ]
    ;(sync as any).pool = { peers }
    ;(sync as any).forceSync = true
    td.when((sync as any).height(peers[0])).thenDo((peer: any) =>
      Promise.resolve(peer.eth.status.td)
    )
    td.when((sync as any).height(peers[1])).thenDo((peer: any) =>
      Promise.resolve(peer.eth.status.td)
    )
    t.equals(sync.best(), peers[1], 'found best')
    await sync.stop()
    t.end()
  })

  t.test('should sync', async (t) => {
    t.plan(3)
    const config = new Config({ loglevel: 'error', transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const sync = new FullSynchronizer({
      config,
      interval: 1,
      pool,
      chain,
    })
    sync.best = td.func<typeof sync['best']>()
    sync.latest = td.func<typeof sync['latest']>()
    td.when(sync.best()).thenReturn('peer')
    td.when(sync.latest('peer' as any)).thenResolve({ number: new BN(2) })
    td.when((BlockFetcher.prototype as any).fetch(), { delay: 20 }).thenResolve(undefined)
    ;(sync as any).chain = { blocks: { height: new BN(3) } }
    t.notOk(await sync.sync(), 'local height > remote height')
    await sync.stop()
    ;(sync as any).chain = {
      blocks: { height: new BN(0) },
    }
    t.ok(await sync.sync(), 'local height < remote height')
    await sync.stop()

    td.when((BlockFetcher.prototype as any).fetch()).thenReject(new Error('err0'))
    try {
      await sync.sync()
    } catch (err) {
      t.equals(err.message, 'err0', 'got error')
      await sync.stop()
    }
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
