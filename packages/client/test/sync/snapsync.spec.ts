import * as tape from 'tape'

import * as td from 'testdouble'
import { BlockHeader } from '@ethereumjs/block'
import { Config } from '../../lib/config'
import { Chain } from '../../lib/blockchain'

tape('[SnapSynchronizer]', async (t) => {
  class PeerPool {
    open() {}
    close() {}
  }
  PeerPool.prototype.open = td.func<any>()
  PeerPool.prototype.close = td.func<any>()
  
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
    t.end()
  })
})