import tape from 'tape'
import td from 'testdouble'
import { BN } from 'ethereumjs-util'
import { Config } from '../../lib/config'
import { Chain } from '../../lib/blockchain'
import { Event } from '../../lib/types'
import { Block } from '@ethereumjs/block'

tape('[FullSynchronizer]', async (t) => {
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
  td.replace('../../lib/sync/fetcher', { BlockFetcher })

  const { FullSynchronizer } = await import('../../lib/sync/fullsync')

  t.test('should initialize correctly', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const sync = new FullSynchronizer({ config, pool, chain, txPool, execution })
    t.equals(sync.type, 'full', 'full type')
    t.end()
  })

  t.test('should open', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
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
    t.pass('opened')
    await sync.close()
    t.end()
  })

  t.test('should get height', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const sync = new FullSynchronizer({ config, pool, chain, txPool, execution })
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
    ;(sync as any).chain = { blocks: { td: new BN(1) } }
    const peers = [
      { eth: { status: { td: new BN(1) } }, inbound: false },
      { eth: { status: { td: new BN(2) } }, inbound: false },
    ]
    ;(sync as any).pool = { peers }
    ;(sync as any).forceSync = true
    td.when((sync as any).height(peers[0])).thenDo((peer: any) =>
      Promise.resolve(peer.eth.status.td)
    )
    td.when((sync as any).height(peers[1])).thenDo((peer: any) =>
      Promise.resolve(peer.eth.status.td)
    )
    t.equal(await sync.best(), peers[1], 'found best')
    await sync.stop()
    await sync.close()
    t.end()
  })

  t.test('should sync', async (t) => {
    t.plan(3)
    const config = new Config({ transports: [], safeReorgDistance: 0 })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
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
      number: new BN(2),
      hash: () => Buffer.from([]),
    })
    td.when(BlockFetcher.prototype.fetch(), { delay: 20, times: 2 }).thenResolve(undefined)
    ;(sync as any).chain = { blocks: { height: new BN(3) } }
    t.notOk(await sync.sync(), 'local height > remote height')
    ;(sync as any).chain = {
      blocks: { height: new BN(0) },
    }
    setTimeout(() => {
      config.events.emit(Event.SYNC_SYNCHRONIZED, new BN(0))
    }, 100)
    t.ok(await sync.sync(), 'local height < remote height')
    td.when(BlockFetcher.prototype.fetch()).thenReject(new Error('err0'))
    try {
      await sync.sync()
    } catch (err: any) {
      t.equals(err.message, 'err0', 'got error')
      await sync.stop()
      await sync.close()
    }
  })

  t.test('should send NewBlock/NewBlockHashes to right peers', async (t) => {
    t.plan(9)
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const sync = new FullSynchronizer({
      config,
      interval: 1,
      pool,
      chain,
      txPool,
      execution,
    })
    ;(sync as any).fetcher = {
      enqueueByNumberList: (blockNumberList: BN[], min: BN) => {
        t.ok(blockNumberList[0].eqn(0), 'enqueueing the correct block in the Fetcher')
        t.equal(blockNumberList.length, 1, 'correct number of blocks enqueued in Fetcher')
        t.ok(min.eqn(0), 'correct start block number in Fetcher')
      },
    }

    let timesSentToPeer2 = 0
    const peers = [
      {
        id: 'Peer 1',
        eth: {
          status: { td: new BN(1) },
          send(name: string) {
            t.equal(name, 'NewBlock', 'sent NewBlock to Peer 1')
          },
        },
        inbound: false,
      },
      {
        id: 'Peer 2',
        eth: {
          status: { td: new BN(2) },
          send(name: string) {
            t.equal(name, 'NewBlockHashes', 'sent NewBlockHashes to Peer 2')
            timesSentToPeer2++
          },
        },
        inbound: false,
      },
      {
        id: 'Peer 3',
        eth: {
          status: { td: new BN(3) },
          send() {
            t.fail('should not send announcement to peer3')
          },
        },
        inbound: false,
      },
    ]
    ;(sync as any).pool = { peers }

    Block.prototype.validateDifficulty = td.func<any>()
    td.when(Block.prototype.validateDifficulty(td.matchers.anything())).thenReturn(true)
    const chainTip = Block.fromBlockData({
      header: {},
    })
    const newBlock = Block.fromBlockData({
      header: {
        parentHash: chainTip.hash(),
      },
    })
    chain.getLatestBlock = td.func<any>()
    chain.putBlocks = td.func<any>()

    // NewBlock message from Peer 3
    await sync.handleNewBlock(newBlock, peers[2] as any)

    t.ok(config.syncTargetHeight?.eqn(0), 'sync target height should be set to 0')
    await sync.handleNewBlock(newBlock)
    t.ok(timesSentToPeer2 === 1, 'sent NewBlockHashes to Peer 2 once')
    t.pass('did not send NewBlock to Peer 3')
    ;(sync as any).chain._blocks = {
      latest: chainTip,
    }
    ;(sync as any).newBlocksKnownByPeer.delete(peers[0].id)
    await sync.handleNewBlock(newBlock, peers[2] as any)
    td.verify(chain.putBlocks([newBlock]))
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
