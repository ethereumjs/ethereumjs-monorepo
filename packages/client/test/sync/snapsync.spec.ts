import { createHeader } from '@ethereumjs/block'
import { assert, describe, it, vi } from 'vitest'

import { Chain } from '../../src/blockchain/index.js'
import { Config } from '../../src/config.js'

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
  PeerPool.prototype.open = vi.fn()
  PeerPool.prototype.close = vi.fn()
  PeerPool.prototype.idle = vi.fn()
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
  AccountFetcher.prototype.fetch = vi.fn()
  AccountFetcher.prototype.clear = vi.fn()
  AccountFetcher.prototype.destroy = vi.fn()
  vi.doMock('../../src/sync/fetcher/index.js', () => {
    return {
      default: () => AccountFetcher,
    }
  })

  const { SnapSynchronizer } = await import('../../src/sync/snapsync.js')

  it('should initialize correctly', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new SnapSynchronizer({ config, pool, chain } as any)
    assert.equal(sync.type, 'snap', 'snap type')
  })

  it('should open', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new SnapSynchronizer({ config, pool, chain } as any)
    ;(sync as any).pool.open = vi.fn().mockResolvedValue(null)
    ;(sync as any).pool.peers = []
    await sync.open()
    assert.ok(true, 'opened')
    await sync.close()
  })

  it('should find best', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new SnapSynchronizer({
      config,
      interval: 1,
      pool,
      chain,
    } as any)
    ;(sync as any).chain = { blocks: { height: 1 } }
    const getBlockHeaders1 = vi.fn().mockReturnValue([BigInt(1), [createHeader({ number: 1 })]])
    const getBlockHeaders2 = vi.fn().mockReturnValue([BigInt(2), [createHeader({ number: 2 })]])
    const peers = [
      {
        snap: {},
        eth: { status: { bestHash: '0xaa' }, getBlockHeaders: getBlockHeaders1 },
        inbound: false,
        latest: () => {
          return {
            number: BigInt(1),
            hash: () => new Uint8Array(0),
          }
        },
      },
      {
        snap: {},
        eth: { status: { bestHash: '0xbb' }, getBlockHeaders: getBlockHeaders2 },
        inbound: false,
        latest: () => {
          return {
            number: BigInt(2),
            hash: () => new Uint8Array(0),
          }
        },
      },
    ]
    ;(sync as any).pool = { peers }
    ;(sync as any).forceSync = true
    assert.equal(await sync.best(), peers[1] as any, 'found best')
  })
})
