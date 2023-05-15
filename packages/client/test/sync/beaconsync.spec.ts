import { Block } from '@ethereumjs/block'
import { MemoryLevel } from 'memory-level'
import * as tape from 'tape'
import * as td from 'testdouble'

import { Chain } from '../../lib/blockchain'
import { Config } from '../../lib/config'
import { Skeleton } from '../../lib/sync'

tape('[BeaconSynchronizer]', async (t) => {
  const execution: any = { run: () => {} }
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
  class ReverseBlockFetcher {
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
  ReverseBlockFetcher.prototype.fetch = td.func<any>()
  ReverseBlockFetcher.prototype.clear = td.func<any>()
  ReverseBlockFetcher.prototype.destroy = td.func<any>()
  td.replace<any>('../../lib/sync/fetcher', { ReverseBlockFetcher })

  const { BeaconSynchronizer } = await import('../../lib/sync/beaconsync')

  t.test('should initialize correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    t.equal(sync.type, 'beacon', 'beacon type')
    t.end()
  })

  t.test('should open', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
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
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    const peer = { eth: { getBlockHeaders: td.func(), status: { bestHash: 'hash' } } }
    const headers = [{ number: BigInt(5) }]
    td.when(peer.eth.getBlockHeaders({ block: 'hash', max: 1 })).thenResolve([BigInt(1), headers])
    const latest = await sync.latest(peer as any)
    t.ok(latest!.number === BigInt(5), 'got height')
    await sync.stop()
    await sync.close()
    t.end()
  })

  t.test('should find best', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    ;(sync as any).running = true
    const peers = [
      { eth: { getBlockHeaders: td.func(), status: { bestHash: 'hash1' }, inbound: false } },
      { eth: { getBlockHeaders: td.func(), status: { bestHash: 'hash2' }, inbound: false } },
    ]
    td.when(peers[0].eth.getBlockHeaders({ block: 'hash1', max: 1 })).thenResolve([
      BigInt(1),
      [{ number: BigInt(5) }],
    ])
    td.when(peers[1].eth.getBlockHeaders({ block: 'hash2', max: 1 })).thenResolve([
      BigInt(1),
      [{ number: BigInt(10) }],
    ])
    ;(sync as any).pool = { peers }
    ;(sync as any).forceSync = true
    t.equal(await sync.best(), peers[1], 'found best')
    await sync.stop()
    await sync.close()
    t.end()
  })

  t.test('should sync to next subchain head or chain height', async (st) => {
    st.plan(3)
    const config = new Config({
      transports: [],
      safeReorgDistance: 0,
      skeletonSubchainMergeMinimum: 0,
      accountCache: 10000,
      storageCache: 1000,
    })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    skeleton['getSyncStatus'] = td.func<typeof skeleton['getSyncStatus']>()
    await skeleton.open()
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    sync.best = td.func<typeof sync['best']>()
    sync.latest = td.func<typeof sync['latest']>()
    td.when(sync.best()).thenResolve('peer')
    td.when(sync.latest('peer' as any)).thenResolve({
      number: BigInt(2),
      hash: () => new Uint8Array(0),
    })
    td.when(ReverseBlockFetcher.prototype.fetch(), { delay: 100, times: 3 }).thenResolve(undefined)
    ;(skeleton as any).status.progress.subchains = [
      { head: BigInt(10), tail: BigInt(6) },
      { head: BigInt(4), tail: BigInt(2) },
    ]
    ;(sync as any).chain = {
      blocks: { height: BigInt(0) },
    }
    sync.config.logger.addListener('data', (data: any) => {
      if ((data.message as string).includes('first=5 count=5'))
        st.pass('should sync block 5 and target chain start')
    })
    await sync.sync()
    sync.config.logger.removeAllListeners()
    sync.config.logger.addListener('data', (data: any) => {
      if ((data.message as string).includes('first=1 count=1'))
        st.pass('should sync block 1 and target chain start')
    })
    ;(skeleton as any).status.progress.subchains = [{ head: BigInt(10), tail: BigInt(2) }]
    await sync.sync()
    sync.config.logger.removeAllListeners()
    ;(skeleton as any).status.progress.subchains = [{ head: BigInt(10), tail: BigInt(6) }]
    ;(sync as any).chain = { blocks: { height: BigInt(4) } }
    sync.config.logger.addListener('data', (data: any) => {
      if ((data.message as string).includes('first=5 count=1'))
        st.pass('should sync block 5 with count 1')
    })
    await sync.sync()
    sync.config.logger.removeAllListeners()
  })

  t.test('should not sync pre-genesis', async (st) => {
    st.plan(1)
    const config = new Config({
      transports: [],
      safeReorgDistance: 0,
      skeletonSubchainMergeMinimum: 1000,
      accountCache: 10000,
      storageCache: 1000,
    })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    skeleton['getSyncStatus'] = td.func<typeof skeleton['getSyncStatus']>()
    await skeleton.open()
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    sync.best = td.func<typeof sync['best']>()
    sync.latest = td.func<typeof sync['latest']>()
    td.when(sync.best()).thenResolve('peer')
    td.when(sync.latest('peer' as any)).thenResolve({
      number: BigInt(2),
      hash: () => new Uint8Array(0),
    })
    td.when(ReverseBlockFetcher.prototype.fetch(), { delay: 100, times: 1 }).thenResolve(undefined)
    ;(skeleton as any).status.progress.subchains = [{ head: BigInt(10), tail: BigInt(6) }]
    ;(sync as any).chain = {
      // Make height > tail so that skeletonSubchainMergeMinimum is triggered
      blocks: { height: BigInt(100) },
    }
    sync.config.logger.addListener('data', (data: any) => {
      if ((data.message as string).includes('first=5 count=5'))
        st.pass('should sync block 5 and target chain start')
    })
    await sync.sync()
    sync.config.logger.removeAllListeners()
  })

  t.test('should extend and set with a valid head', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    const head = Block.fromBlockData({ header: { number: BigInt(15) } })
    await skeleton['putBlock'](head)
    ;(skeleton as any).status.progress.subchains = [
      {
        head: BigInt(15),
        tail: BigInt(11),
      },
    ]
    await sync.open()
    const block = Block.fromBlockData({ header: { number: BigInt(16), parentHash: head.hash() } })
    t.ok(await sync.extendChain(block), 'should extend chain successfully')
    t.ok(await sync.setHead(block), 'should set head successfully')
    t.equal(skeleton.bounds().head, BigInt(16), 'head should be updated')

    const gapBlock = Block.fromBlockData({ header: { number: BigInt(18) } })
    t.notOk(await sync.extendChain(gapBlock), 'should not extend chain with gapped block')
    t.ok(await sync.setHead(gapBlock), 'should be able to set and update head with gapped block')
    t.equal(skeleton.bounds().head, BigInt(18), 'head should update with gapped block')
    await sync.stop()
    await sync.close()
    t.end()
  })

  t.test('syncWithPeer should return early if skeleton is already linked', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    skeleton.isLinked = () => true // stub
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    await sync.open()
    t.equal(
      await sync.syncWithPeer({} as any),
      false,
      `syncWithPeer should return false as nothing to sync`
    )
    await sync.stop()
    await sync.close()
    t.end()
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
