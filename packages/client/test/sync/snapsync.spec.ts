import { BlockHeader } from '@ethereumjs/block'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { Chain } from '../../src/blockchain'
import { Config } from '../../src/config'

describe('[SnapSynchronizer]', async () => {
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
  td.replace<any>('../../src/sync/fetcher', { AccountFetcher })

  const { SnapSynchronizer } = await import('../../src/sync/snapsync')

  it('should initialize correctly', async () => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new SnapSynchronizer({ config, pool, chain })
    assert.equal(sync.type, 'snap', 'snap type')
  })

  it('should open', async () => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new SnapSynchronizer({ config, pool, chain })
    ;(sync as any).pool.open = td.func<PeerPool['open']>()
    ;(sync as any).pool.peers = []
    td.when((sync as any).pool.open()).thenResolve(null)
    await sync.open()
    assert.ok(true, 'opened')
    await sync.close()
  })

  it('should find best', async () => {
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
    assert.equal(await sync.best(), peers[1] as any, 'found best')
    await sync.start()
  })
})
