import { createBlock } from '@ethereumjs/block'
import { MemoryLevel } from 'memory-level'
import * as td from 'testdouble'
import { assert, describe, it, vi } from 'vitest'

import { Chain } from '../../src/blockchain/index.js'
import { Config } from '../../src/config.js'
import { ReverseBlockFetcher } from '../../src/sync/fetcher/reverseblockfetcher.js'
import { Skeleton } from '../../src/sync/index.js'

describe('[BeaconSynchronizer]', async () => {
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

  ReverseBlockFetcher.prototype.fetch = td.func<any>()
  ReverseBlockFetcher.prototype.clear = td.func<any>()
  ReverseBlockFetcher.prototype.destroy = td.func<any>()

  vi.doMock('../../src/sync/fetcher/reverseblockfetcher.js', () =>
    td.constructor(ReverseBlockFetcher),
  )
  const { BeaconSynchronizer } = await import('../../src/sync/beaconsync.js')

  it('should initialize correctly', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    assert.equal(sync.type, 'beacon', 'beacon type')
  })

  it('should open', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    ;(sync as any).pool.open = td.func<PeerPool['open']>()
    ;(sync as any).pool.peers = []
    td.when((sync as any).pool.open()).thenResolve(null)
    await sync.open()
    assert.ok(true, 'opened')
    await sync.close()
  })

  it('should get height', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    const peer = {
      eth: { getBlockHeaders: td.func(), status: { bestHash: 'hash' } },
      latest: async () => {
        return {
          number: BigInt(5),
          hash: () => new Uint8Array(0),
        }
      },
    }
    const headers = [{ number: BigInt(5) }]
    td.when(peer.eth.getBlockHeaders({ block: 'hash', max: 1 })).thenResolve([BigInt(1), headers])
    const latest = await peer.latest()
    assert.ok(latest!.number === BigInt(5), 'got height')
    await sync.stop()
    await sync.close()
  })

  it('should find best', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    ;(sync as any).running = true
    const peers = [
      {
        eth: { getBlockHeaders: td.func(), status: { bestHash: 'hash1' }, inbound: false },
        latest: () => {
          return {
            number: BigInt(5),
            hash: () => new Uint8Array(0),
          }
        },
      },
      {
        eth: { getBlockHeaders: td.func(), status: { bestHash: 'hash2' }, inbound: false },
        latest: () => {
          return {
            number: BigInt(10),
            hash: () => new Uint8Array(0),
          }
        },
      },
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
    assert.equal(await sync.best(), <any>peers[1], 'found best')
    await sync.stop()
    await sync.close()
  })

  it('should sync to next subchain head or chain height', async () => {
    const config = new Config({
      safeReorgDistance: 0,
      skeletonSubchainMergeMinimum: 0,
      accountCache: 10000,
      storageCache: 1000,
    })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    skeleton['getSyncStatus'] = td.func<(typeof skeleton)['getSyncStatus']>()
    await skeleton.open()

    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    sync.best = td.func<(typeof sync)['best']>()
    td.when(sync.best()).thenResolve({
      latest: () => {
        return {
          number: BigInt(2),
          hash: () => new Uint8Array(0),
        }
      },
    } as any)
    td.when(ReverseBlockFetcher.prototype.fetch(), { delay: 100, times: 3 }).thenResolve(false)
    ;(skeleton as any).status.progress.subchains = [
      { head: BigInt(10), tail: BigInt(6) },
      { head: BigInt(4), tail: BigInt(2) },
    ]
    ;(sync as any).chain = {
      blocks: { height: BigInt(0) },
    }
    sync.config.logger.addListener('data', (data: any) => {
      if ((data.message as string).includes('first=5 count=5'))
        assert.ok(true, 'should sync block 5 and target chain start')
    })
    await sync.sync()
    sync.config.logger.removeAllListeners()
    sync.config.logger.addListener('data', (data: any) => {
      if ((data.message as string).includes('first=1 count=1'))
        assert.ok(true, 'should sync block 1 and target chain start')
    })
    ;(skeleton as any).status.progress.subchains = [{ head: BigInt(10), tail: BigInt(2) }]
    await sync.sync()
    sync.config.logger.removeAllListeners()
    ;(skeleton as any).status.progress.subchains = [{ head: BigInt(10), tail: BigInt(6) }]
    ;(sync as any).chain = { blocks: { height: BigInt(4) } }
    sync.config.logger.addListener('data', (data: any) => {
      if ((data.message as string).includes('first=5 count=1'))
        assert.ok(true, 'should sync block 5 with count 1')
    })
    await sync.sync()
    sync.config.logger.removeAllListeners()
  })

  it('should not sync pre-genesis', async () => {
    const config = new Config({
      safeReorgDistance: 0,
      skeletonSubchainMergeMinimum: 1000,
      accountCache: 10000,
      storageCache: 1000,
    })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    skeleton['getSyncStatus'] = td.func<(typeof skeleton)['getSyncStatus']>()
    await skeleton.open()
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    sync.best = td.func<(typeof sync)['best']>()
    td.when(sync.best()).thenResolve({
      latest: () => {
        return {
          number: BigInt(2),
          hash: () => new Uint8Array(0),
        }
      },
    } as any)
    td.when(ReverseBlockFetcher.prototype.fetch(), { delay: 100, times: 1 }).thenResolve(false)
    ;(skeleton as any).status.progress.subchains = [{ head: BigInt(10), tail: BigInt(6) }]
    ;(sync as any).chain = {
      // Make height > tail so that skeletonSubchainMergeMinimum is triggered
      blocks: { height: BigInt(100) },
    }
    sync.config.logger.addListener('data', (data: any) => {
      if ((data.message as string).includes('first=5 count=5'))
        assert.ok(true, 'should sync block 5 and target chain start')
    })
    await sync.sync()
    sync.config.logger.removeAllListeners()
  })

  it('should extend and set with a valid head', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    const head = createBlock({ header: { number: BigInt(15) } })
    await skeleton['putBlock'](head)
    ;(skeleton as any).status.progress.subchains = [
      {
        head: BigInt(15),
        tail: BigInt(11),
      },
    ]
    await sync.open()
    const block = createBlock({
      header: { number: BigInt(16), parentHash: head.hash() },
    })
    assert.ok(await sync.extendChain(block), 'should extend chain successfully')
    assert.ok(await sync.setHead(block), 'should set head successfully')
    assert.equal(skeleton.bounds().head, BigInt(16), 'head should be updated')

    const gapBlock = createBlock({ header: { number: BigInt(18) } })
    assert.notOk(await sync.extendChain(gapBlock), 'should not extend chain with gapped block')
    assert.ok(
      await sync.setHead(gapBlock),
      'should be able to set and update head with gapped block',
    )
    assert.equal(skeleton.bounds().head, BigInt(18), 'head should update with gapped block')
    await sync.stop()
    await sync.close()
  })

  it('syncWithPeer should return early if skeleton is already linked', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    skeleton.isLinked = () => true // stub
    const sync = new BeaconSynchronizer({ config, pool, chain, execution, skeleton })
    await sync.open()
    assert.equal(
      await sync.syncWithPeer({} as any),
      false,
      `syncWithPeer should return false as nothing to sync`,
    )
    await sync.stop()
    await sync.close()
  })

  it('should reset td', () => {
    td.reset()
  })
})
