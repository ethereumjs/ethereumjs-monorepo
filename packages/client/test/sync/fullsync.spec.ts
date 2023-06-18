import { Block } from '@ethereumjs/block'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { Chain } from '../../src/blockchain'
import { Config } from '../../src/config'
import { Event } from '../../src/types'

describe('[FullSynchronizer]', async () => {
  const txPool: any = { removeNewBlockTxs: () => {}, checkRunState: () => {} }
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
  class BlockFetcher {
    fetch() {}
    clear() {}
    destroy() {}
  }
  BlockFetcher.prototype.fetch = td.func<any>()
  BlockFetcher.prototype.clear = td.func<any>()
  BlockFetcher.prototype.destroy = td.func<any>()
  td.replace<any>('../../src/sync/fetcher', { BlockFetcher })

  const { FullSynchronizer } = await import('../../src/sync/fullsync')

  it('should initialize correctly', async () => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new FullSynchronizer({ config, pool, chain, txPool, execution })
    assert.equal(sync.type, 'full', 'full type')
  })

  it('should open', async () => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new FullSynchronizer({
      config,
      pool,
      chain,
      txPool,
      execution,
    })
    ;(sync as any).pool.open = td.func<PeerPool['open']>()
    ;(sync as any).pool.peers = []
    td.when((sync as any).pool.open()).thenResolve(null)
    await sync.open()
    assert.ok(true, 'opened')
    await sync.close()
  })

  it('should get height', async () => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new FullSynchronizer({ config, pool, chain, txPool, execution })
    const peer = { eth: { getBlockHeaders: td.func(), status: { bestHash: 'hash' } } }
    const headers = [{ number: BigInt(5) }]
    td.when(peer.eth.getBlockHeaders({ block: 'hash', max: 1 })).thenResolve([BigInt(1), headers])
    const latest = await sync.latest(peer as any)
    assert.equal(latest!.number, BigInt(5), 'got height')
    await sync.stop()
    await sync.close()
  })

  it('should find best', async () => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new FullSynchronizer({
      config,
      interval: 1,
      pool,
      chain,
      txPool,
      execution,
    })
    ;(sync as any).running = true
    ;(sync as any).height = td.func()
    ;(sync as any).chain = { blocks: { td: BigInt(1) } }
    const peers = [
      { eth: { status: { td: BigInt(1) } }, inbound: false },
      { eth: { status: { td: BigInt(2) } }, inbound: false },
    ]
    ;(sync as any).pool = { peers }
    ;(sync as any).forceSync = true
    td.when((sync as any).height(peers[0])).thenDo((peer: any) =>
      Promise.resolve(peer.eth.status.td)
    )
    td.when((sync as any).height(peers[1])).thenDo((peer: any) =>
      Promise.resolve(peer.eth.status.td)
    )
    assert.equal(await sync.best(), peers[1], 'found best')
    await sync.stop()
    await sync.close()
  })

  it('should sync', async () => {
    const config = new Config({
      transports: [],
      accountCache: 10000,
      storageCache: 1000,
      safeReorgDistance: 0,
    })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new FullSynchronizer({
      config,
      interval: 1,
      pool,
      chain,
      txPool,
      execution,
    })
    sync.best = td.func<typeof sync['best']>()
    sync.latest = td.func<typeof sync['latest']>()
    td.when(sync.best()).thenResolve('peer')
    td.when(sync.latest('peer' as any)).thenResolve({
      number: BigInt(2),
      hash: () => new Uint8Array(0),
    })
    td.when(BlockFetcher.prototype.fetch(), { delay: 20, times: 2 }).thenResolve(undefined)
    ;(sync as any).chain = { blocks: { height: BigInt(3) } }
    assert.notOk(await sync.sync(), 'local height > remote height')
    ;(sync as any).chain = {
      blocks: { height: BigInt(0) },
    }
    setTimeout(() => {
      config.events.emit(Event.SYNC_SYNCHRONIZED, BigInt(0))
    }, 100)
    assert.ok(await sync.sync(), 'local height < remote height')
    td.when(BlockFetcher.prototype.fetch()).thenReject(new Error('err0'))
    try {
      await sync.sync()
    } catch (err: any) {
      assert.equal(err.message, 'err0', 'got error')
      await sync.stop()
      await sync.close()
    }
  })

  it('should send NewBlock/NewBlockHashes to right peers', async () => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new FullSynchronizer({
      config,
      interval: 1,
      pool,
      chain,
      txPool,
      execution,
    })
    ;(sync as any)._fetcher = {
      enqueueByNumberList: (blockNumberList: bigint[], min: bigint) => {
        assert.equal(blockNumberList[0], BigInt(0), 'enqueueing the correct block in the Fetcher')
        assert.equal(blockNumberList.length, 1, 'correct number of blocks enqueued in Fetcher')
        assert.equal(min, BigInt(0), 'correct start block number in Fetcher')
      },
    }
    Object.defineProperty(sync, 'fetcher', {
      get() {
        return this._fetcher
      },
    })

    let timesSentToPeer2 = 0
    const peers = [
      {
        id: 'Peer 1',
        eth: {
          status: { td: BigInt(1) },
          send(name: string) {
            assert.equal(name, 'NewBlock', 'sent NewBlock to Peer 1')
          },
        },
        inbound: false,
      },
      {
        id: 'Peer 2',
        eth: {
          status: { td: BigInt(2) },
          send(name: string) {
            assert.equal(name, 'NewBlockHashes', 'sent NewBlockHashes to Peer 2')
            timesSentToPeer2++
          },
        },
        inbound: false,
      },
      {
        id: 'Peer 3',
        eth: {
          status: { td: BigInt(3) },
          send() {
            assert.fail('should not send announcement to peer3')
          },
        },
        inbound: false,
      },
    ]
    ;(sync as any).pool = { peers }

    const chainTip = Block.fromBlockData({
      header: {},
    })
    const newBlock = Block.fromBlockData({
      header: {
        parentHash: chainTip.hash(),
      },
    })
    chain.getCanonicalHeadBlock = td.func<any>()
    chain.putBlocks = td.func<any>()
    // NewBlock message from Peer 3
    await sync.handleNewBlock(newBlock, peers[2] as any)

    assert.equal(config.syncTargetHeight, BigInt(0), 'sync target height should be set to 0')
    await sync.handleNewBlock(newBlock)
    assert.equal(timesSentToPeer2, 1, 'sent NewBlockHashes to Peer 2 once')
    assert.ok(true, 'did not send NewBlock to Peer 3')
    ;(sync as any).chain._blocks = {
      latest: chainTip,
    }
    ;(sync as any).newBlocksKnownByPeer.delete(peers[0].id)
    await sync.handleNewBlock(newBlock, peers[2] as any)
    td.verify(chain.putBlocks([newBlock]))
  })

  it('should process blocks', async () => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new FullSynchronizer({
      config,
      interval: 1,
      pool,
      chain,
      txPool,
      execution,
    })

    const chainTip = Block.fromBlockData({
      header: {},
    })
    const newBlock = Block.fromBlockData({
      header: {
        parentHash: chainTip.hash(),
      },
    })

    sync.running = true
    assert.ok(await sync.processBlocks([newBlock]), 'should successfully process blocks')
  })

  it('should reset td', () => {
    td.reset()
  })
})
