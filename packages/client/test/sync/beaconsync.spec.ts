import tape from 'tape'
import td from 'testdouble'
import { Block } from '@ethereumjs/block'
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
    t.equal(sync.type, 'beacon', 'beacon type')
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

  t.test('should get height', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const metaDB = level()
    const skeleton = new Skeleton({ chain, config, metaDB })
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    const peer = { eth: { getBlockHeaders: td.func(), status: { bestHash: 'hash' } } }
    const headers = [{ number: new BN(5) }]
    td.when(peer.eth.getBlockHeaders({ block: 'hash', max: 1 })).thenResolve([new BN(1), headers])
    const latest = await sync.latest(peer as any)
    t.ok(latest!.number.eqn(5), 'got height')
    await sync.stop()
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
      { eth: { getBlockHeaders: td.func(), status: { bestHash: 'hash1' }, inbound: false } },
      { eth: { getBlockHeaders: td.func(), status: { bestHash: 'hash2' }, inbound: false } },
    ]
    td.when(peers[0].eth.getBlockHeaders({ block: 'hash1', max: 1 })).thenResolve([
      new BN(1),
      [{ number: new BN(5) }],
    ])
    td.when(peers[1].eth.getBlockHeaders({ block: 'hash2', max: 1 })).thenResolve([
      new BN(1),
      [{ number: new BN(10) }],
    ])
    ;(sync as any).pool = { peers }
    ;(sync as any).forceSync = true
    t.equal(await sync.best(), peers[1], 'found best')
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
    sync.latest = td.func<typeof sync['latest']>()
    td.when(sync.best()).thenResolve('peer')
    td.when(sync.latest('peer' as any)).thenResolve({
      number: new BN(2),
      hash: () => Buffer.from([]),
    })
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

  t.test('should extend and set with a valid head', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const metaDB = level()
    const skeleton = new Skeleton({ chain, config, metaDB })
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    ;(skeleton as any).status.progress.subchains = [
      {
        head: new BN(15),
        tail: new BN(11),
      },
    ]
    await sync.open()
    const block = Block.fromBlockData({ header: { number: new BN(16) } })
    t.ok(await sync.extendChain(block), 'should extend chain successfully')
    t.ok(await sync.setHead(block), 'should set head successfully')
    t.equal(skeleton.bounds().head.toNumber(), 16, 'head should be updated')

    const gapBlock = Block.fromBlockData({ header: { number: new BN(18) } })
    t.notOk(await sync.extendChain(gapBlock), 'should not extend chain with gapped block')
    t.ok(await sync.setHead(gapBlock), 'should not set head with gapped block')
    t.equal(skeleton.bounds().head.toNumber(), 16, 'head should not update with gapped block')
    await sync.stop()
    await sync.close()
    t.end()
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
