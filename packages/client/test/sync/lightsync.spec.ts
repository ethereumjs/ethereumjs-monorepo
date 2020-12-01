import { EventEmitter } from 'events'
import tape from 'tape-catch'
import td from 'testdouble'
import { BN } from 'ethereumjs-util'
import { Config } from '../../lib/config'
import { Chain } from '../../lib/blockchain'

tape('[LightSynchronizer]', async (t) => {
  class PeerPool extends EventEmitter {
    open() {}
    close() {}
  }
  PeerPool.prototype.open = td.func<any>()
  PeerPool.prototype.close = td.func<any>()
  td.replace('../../lib/net/peerpool', { PeerPool })
  class HeaderFetcher extends EventEmitter {
    fetch() {}
  }
  HeaderFetcher.prototype.fetch = td.func<any>()
  td.replace('../../lib/sync/fetcher/headerfetcher', { HeaderFetcher })

  const { LightSynchronizer } = await import('../../lib/sync/lightsync')

  t.test('should initialize correctly', async (t) => {
    const config = new Config({ loglevel: 'error', transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const sync = new LightSynchronizer({ config, pool, chain })
    pool.emit('added', { les: { status: { serveHeaders: true } } })
    t.equals(sync.type, 'light', 'light type')
    t.end()
  })

  t.test('should find best', async (t) => {
    const config = new Config({ loglevel: 'error', transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const sync = new LightSynchronizer({
      config,
      interval: 1,
      pool,
      chain,
    })
    ;(sync as any).running = true
    ;(sync as any).chain = { headers: { td: new BN(1) } }
    const peers = [
      {
        les: { status: { headTd: new BN(1), headNum: new BN(1), serveHeaders: 1 } },
        inbound: false,
      },
      {
        les: { status: { headTd: new BN(2), headNum: new BN(2), serveHeaders: 1 } },
        inbound: false,
      },
    ]
    ;(sync as any).pool = { peers }
    ;(sync as any).forceSync = true
    t.equals(sync.best(), peers[1], 'found best')
    t.end()
  })

  t.test('should sync', async (t) => {
    t.plan(3)
    const config = new Config({ loglevel: 'error', transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const sync = new LightSynchronizer({
      config,
      interval: 1,
      pool,
      chain,
    })
    sync.best = td.func<typeof sync['best']>()
    td.when(sync.best()).thenReturn({ les: { status: { headNum: new BN(2) } } } as any)
    td.when(HeaderFetcher.prototype.fetch(), { delay: 20 }).thenResolve(undefined)
    ;(sync as any).chain = { headers: { height: new BN(3) } }
    t.notOk(await sync.sync(), 'local height > remote height')
    ;(sync as any).chain = { headers: { height: new BN(0) } }
    t.ok(await sync.sync(), 'local height < remote height')
    td.when(HeaderFetcher.prototype.fetch()).thenReject(new Error('err0'))
    try {
      await sync.sync()
    } catch (err) {
      t.equals(err.message, 'err0', 'got error')
    }
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
