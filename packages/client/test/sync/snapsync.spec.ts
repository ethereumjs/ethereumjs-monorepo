import { BlockHeader } from '@ethereumjs/block'
import * as tape from 'tape'
import * as td from 'testdouble'

import { Chain } from '../../lib/blockchain'
import { Config } from '../../lib/config'

tape('[SnapSynchronizer]', async (t) => {
  class PeerPool {
    open() {}
    close() {}
    idle() {}
    ban(_peer: any) {}
    peers: any[]

    constructor(_opts = undefined) {
      this.peers = []
    }
  }
  PeerPool.prototype.open = td.func<any>()
  PeerPool.prototype.close = td.func<any>()
  PeerPool.prototype.idle = td.func<any>()
  class AccountFetcher {
    first: bigint
    count: bigint
    constructor(opts: any) {
      this.first = opts.first
      this.count = opts.count
    }
    fetch() {}
    clear() {}
    destroy() {}
  }
  AccountFetcher.prototype.fetch = td.func<any>()
  AccountFetcher.prototype.clear = td.func<any>()
  AccountFetcher.prototype.destroy = td.func<any>()
  td.replace<any>('../../lib/sync/fetcher', { AccountFetcher })

  const { SnapSynchronizer } = await import('../../lib/sync/snapsync')

  t.test('should initialize correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new SnapSynchronizer({ config, pool, chain })
    t.equals(sync.type, 'snap', 'snap type')
    t.end()
  })

  t.test('should open', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new SnapSynchronizer({ config, pool, chain })
    ;(sync as any).pool.open = td.func<PeerPool['open']>()
    ;(sync as any).pool.peers = []
    td.when((sync as any).pool.open()).thenResolve(null)
    await sync.open()
    t.pass('opened')
    await sync.close()
    t.end()
  })

  t.test('should find best', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new SnapSynchronizer({
      config,
      interval: 1,
      pool,
      chain,
    })
    ;(sync as any).chain = { blocks: { height: 1 } }
    const getBlockHeaders1 = td.func<any>()
    td.when(getBlockHeaders1(td.matchers.anything())).thenReturn([
      BigInt(1),
      [BlockHeader.fromHeaderData({ number: 1 })],
    ])
    const getBlockHeaders2 = td.func<any>()
    td.when(getBlockHeaders2(td.matchers.anything())).thenReturn([
      BigInt(2),
      [BlockHeader.fromHeaderData({ number: 2 })],
    ])
    const peers = [
      {
        snap: {},
        eth: { status: { bestHash: '0xaa' }, getBlockHeaders: getBlockHeaders1 },
        inbound: false,
      },
      {
        snap: {},
        eth: { status: { bestHash: '0xbb' }, getBlockHeaders: getBlockHeaders2 },
        inbound: false,
      },
    ]
    ;(sync as any).pool = { peers }
    ;(sync as any).forceSync = true
    t.equal(await sync.best(), peers[1], 'found best')
    await sync.start()

    t.end()
  })
})
