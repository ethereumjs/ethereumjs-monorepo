import tape from 'tape'
import td from 'testdouble'
import { Account, BN } from 'ethereumjs-util'
import { Config } from '../../lib/config'
import { Chain } from '../../lib/blockchain'
import { BlockHeader } from '@ethereumjs/block'
import { Event } from '../../lib/types'

tape('[SnapSynchronizer]', async (t) => {
  class PeerPool {
    open() {}
    close() {}
  }
  PeerPool.prototype.open = td.func<any>()
  PeerPool.prototype.close = td.func<any>()
  class HeaderFetcher {
    fetch() {}
    clear() {}
    destroy() {}
  }
  HeaderFetcher.prototype.fetch = td.func<any>()
  td.replace('../../lib/sync/fetcher', { HeaderFetcher })

  const { SnapSynchronizer } = await import('../../lib/sync/snapsync')

  t.test('should initialize correctly', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const sync = new SnapSynchronizer({ config, pool, chain })
    t.equals(sync.type, 'snap', 'snap type')
    t.end()
  })

  t.test('should find best', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const sync = new SnapSynchronizer({
      config,
      interval: 1,
      pool,
      chain,
    })
    ;(sync as any).running = true
    ;(sync as any).chain = { blocks: { height: 1 } }
    const getBlockHeaders1 = td.func<any>()
    td.when(getBlockHeaders1(td.matchers.anything())).thenReturn([
      new BN(1),
      [BlockHeader.fromHeaderData({ number: 1 })],
    ])
    const getBlockHeaders2 = td.func<any>()
    td.when(getBlockHeaders2(td.matchers.anything())).thenReturn([
      new BN(2),
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
    t.end()
  })

  t.test('should sync', async (t) => {
    t.plan(3)
    const config = new Config({ transports: [], safeReorgDistance: 0 })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const sync = new SnapSynchronizer({
      config,
      interval: 1,
      pool,
      chain,
    })

    sync.latest = td.func<typeof sync['latest']>()
    td.when(sync.latest(td.matchers.anything())).thenResolve({
      number: new BN(4),
      stateRoot: Buffer.from([]),
      hash: () => {
        return Buffer.from([])
      },
    })

    const getBlockHeaders = td.func<any>()
    td.when(getBlockHeaders(td.matchers.anything())).thenReturn([
      new BN(1),
      [BlockHeader.fromHeaderData({ number: 5 })],
    ])

    const getAccountRange = td.func<any>()
    td.when(getAccountRange(td.matchers.anything())).thenReturn({
      accounts: [
        Account.fromAccountData({
          stateRoot: '0x5d6cded585e73c4e322c30c2f782a336316f17dd85a4863b9d838d2d4b8b3008',
        }),
      ],
    })
    sync.best = td.func<typeof sync['best']>()
    td.when(sync.best()).thenResolve({
      snap: { getAccountRange: getAccountRange } as any,
      eth: { getBlockHeaders: getBlockHeaders } as any,
    })
    ;(sync as any).forceSync = true
    ;(sync as any).chain = { headers: { height: new BN(3) } }
    t.notOk(await sync.sync(), 'local height > remote height')
    ;(sync as any).chain = { headers: { height: new BN(5) } }
    setTimeout(() => {
      config.events.emit(Event.SYNC_SYNCHRONIZED, new BN(5))
    }, 100)
    t.ok(await sync.sync(), 'local height < remote height')

    td.when(HeaderFetcher.prototype.fetch()).thenReject(new Error('err0'))
    try {
      await sync.sync()
    } catch (err: any) {
      t.equals(err.message, 'err0', 'got error')
      await sync.stop()
      await sync.close()
    }
  })
})
