import tape from 'tape'
import td from 'testdouble'
import { BN } from 'ethereumjs-util'
import { Config } from '../../lib/config'
import { Chain } from '../../lib/blockchain'
import { Skeleton } from '../../lib/sync'
import { wait } from '../integration/util'
const level = require('level-mem')

tape('[BeaconSynchronizer]', async (t) => {
  const execution: any = { run: () => {} }
  class PeerPool {
    open() {}
    close() {}
    idle() {}
    ban(_peer: any) {}
  }
  PeerPool.prototype.open = td.func<any>()
  PeerPool.prototype.close = td.func<any>()
  PeerPool.prototype.idle = td.func<any>()
  class ReverseBlockFetcher {
    first: BN
    count: BN
    constructor(opts: any) {
      this.first = opts.first
      this.count = opts.count
    }
    fetch() {}
    clear() {}
    destroy() {}
  }
  ReverseBlockFetcher.prototype.fetch = td.func<any>()
  ReverseBlockFetcher.prototype.clear = td.func<any>()
  ReverseBlockFetcher.prototype.destroy = td.func<any>()
  td.replace('../../lib/sync/fetcher', { ReverseBlockFetcher })

  const { BeaconSynchronizer } = await import('../../lib/sync/beaconsync')

  t.test('should initialize correctly', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const metaDB = level()
    const skeleton = new Skeleton({ chain, config, metaDB })
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    t.equals(sync.type, 'beacon', 'beacon type')
    t.end()
  })

  t.test('should open', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const metaDB = level()
    const skeleton = new Skeleton({ chain, config, metaDB })
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    ;(sync as any).pool.open = td.func<PeerPool['open']>()
    ;(sync as any).pool.peers = []
    td.when((sync as any).pool.open()).thenResolve(null)
    await sync.open()
    t.pass('opened')
    await sync.close()
    t.end()
  })

  t.test('should find best', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const metaDB = level()
    const skeleton = new Skeleton({ chain, config, metaDB })
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    ;(sync as any).running = true
    const peers = [
      { eth: { status: { latestBlock: new BN(1) } }, inbound: false },
      { eth: { status: { latestBlock: new BN(3) } }, inbound: false },
    ]
    ;(sync as any).pool = { peers }
    ;(sync as any).forceSync = true
    t.equals(sync.best(), peers[1], 'found best')
    await sync.stop()
    await sync.close()
    t.end()
  })

  t.test('should sync to next subchain head or chain height', async (t) => {
    const config = new Config({ transports: [], safeReorgDistance: 0 })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const metaDB = level()
    const skeleton = new Skeleton({ chain, config, metaDB })
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    sync.best = td.func<typeof sync['best']>()
    td.when(sync.best()).thenReturn('peer')
    td.when(ReverseBlockFetcher.prototype.fetch(), { delay: 100, times: 3 }).thenResolve(undefined)
    ;(skeleton as any).status.progress.subchains = [
      { head: new BN(10), tail: new BN(6) },
      { head: new BN(4), tail: new BN(2) },
    ]
    ;(sync as any).chain = {
      blocks: { height: new BN(0) },
    }
    void sync.sync()
    await wait(50)
    t.equal(sync.fetcher!.first.toNumber(), 5, 'should sync block 5 and 4')
    t.equal(sync.fetcher!.count.toNumber(), 2, 'should sync block 5 and 4')
    await wait(51)
    ;(skeleton as any).status.progress.subchains = [{ head: new BN(10), tail: new BN(2) }]
    void sync.sync()
    await wait(50)
    t.equal(sync.fetcher!.first.toNumber(), 1, 'should sync block 1')
    t.equal(sync.fetcher!.count.toNumber(), 1, 'should sync block 1')
    await wait(51)
    ;(skeleton as any).status.progress.subchains = [{ head: new BN(10), tail: new BN(6) }]
    ;(sync as any).chain = { blocks: { height: new BN(4) } }
    void sync.sync()
    await wait(50)
    t.equal(sync.fetcher!.first.toNumber(), 5, 'should sync block 5')
    t.equal(sync.fetcher!.count.toNumber(), 1, 'should sync block 5')
  })

  t.test('should put received blocks in the skeleton chain', async (_t) => {})
  t.test('should fill the canonical chain when linked and run execution', async (_t) => {})
  t.test('should extend with a new valid head', async (_t) => {})
  t.test('should not extend with an invalid head', async (_t) => {})

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
