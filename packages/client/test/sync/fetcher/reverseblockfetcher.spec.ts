import tape from 'tape'
import td from 'testdouble'
import { Block } from '@ethereumjs/block'
import { BN } from 'ethereumjs-util'
import { Config } from '../../../lib/config'
import { Chain } from '../../../lib/blockchain/chain'
import { Skeleton } from '../../../lib/sync'
import { wait } from '../../integration/util'
import { Event } from '../../../lib/types'
const level = require('level-mem')

tape('[ReverseBlockFetcher]', async (t) => {
  class PeerPool {
    idle() {}
    ban() {}
  }
  PeerPool.prototype.idle = td.func<any>()
  PeerPool.prototype.ban = td.func<any>()

  const { ReverseBlockFetcher } = await import('../../../lib/sync/fetcher/reverseblockfetcher')

  t.test('should start/stop', async (t) => {
    const config = new Config({ maxPerRequest: 5, transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const metaDB = level()
    const skeleton = new Skeleton({ chain, config, metaDB })
    const fetcher = new ReverseBlockFetcher({
      config,
      pool,
      chain,
      skeleton,
      first: new BN(10),
      count: new BN(10),
      timeout: 5,
    })
    fetcher.next = () => false
    t.notOk((fetcher as any).running, 'not started')
    void fetcher.fetch()
    t.equals((fetcher as any).in.size(), 2, 'added 2 tasks')
    await wait(100)
    t.ok((fetcher as any).running, 'started')
    fetcher.destroy()
    await wait(100)
    t.notOk((fetcher as any).running, 'stopped')
    t.end()
  })

  t.test('should process', (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const metaDB = level()
    const skeleton = new Skeleton({ chain, config, metaDB })
    const fetcher = new ReverseBlockFetcher({
      config,
      pool,
      chain,
      skeleton,
      first: new BN(10),
      count: new BN(10),
    })
    const blocks: any = [{ header: { number: 2 } }, { header: { number: 1 } }]
    t.deepEquals(fetcher.process({ task: { count: 2 } } as any, blocks), blocks, 'got results')
    t.notOk(fetcher.process({ task: { count: 2 } } as any, { blocks: [] } as any), 'bad results')
    t.end()
  })

  t.test('should adopt correctly', (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const metaDB = level()
    const skeleton = new Skeleton({ chain, config, metaDB })
    const fetcher = new ReverseBlockFetcher({
      config,
      pool,
      chain,
      skeleton,
      first: new BN(10),
      count: new BN(5),
    })
    const blocks: any = [{ header: { number: 3 } }, { header: { number: 2 } }]
    const task = { count: 3, first: new BN(3) }
    ;(fetcher as any).running = true
    fetcher.enqueueTask(task)
    const job = (fetcher as any).in.peek()
    let results = fetcher.process(job as any, blocks)
    t.equal((fetcher as any).in.size(), 1, 'Fetcher should still have same job')
    t.equal(job?.partialResult?.length, 2, 'Should have two partial results')
    t.equal(results, undefined, 'Process should not return full results yet')

    const remainingBlocks: any = [{ header: { number: 1 } }]
    results = fetcher.process(job as any, remainingBlocks)
    t.equal(results?.length, 3, 'Should return full results')

    t.end()
  })

  t.test('should find a fetchable peer', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const metaDB = level()
    const skeleton = new Skeleton({ chain, config, metaDB })
    const fetcher = new ReverseBlockFetcher({
      config,
      pool,
      chain,
      skeleton,
      first: new BN(10),
      count: new BN(2),
    })
    td.when((fetcher as any).pool.idle(td.matchers.anything())).thenReturn('peer0')
    t.equals(fetcher.peer(), 'peer0', 'found peer')
    t.end()
  })

  t.test('should request correctly', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const metaDB = level()
    const skeleton = new Skeleton({ chain, config, metaDB })
    const fetcher = new ReverseBlockFetcher({
      config,
      pool,
      chain,
      skeleton,
      first: new BN(10),
      count: new BN(5),
    })
    const partialResult: any = [{ header: { number: 10 } }, { header: { number: 9 } }]

    const task = { first: new BN(10), count: 5 }
    const peer = {
      eth: { getBlockBodies: td.func<any>(), getBlockHeaders: td.func<any>() },
      id: 'random',
      address: 'random',
    }
    const job = { peer, partialResult, task }
    await fetcher.request(job as any)
    td.verify(
      job.peer.eth.getBlockHeaders({
        block: job.task.first.subn(partialResult.length),
        max: job.task.count - partialResult.length,
        reverse: true,
      })
    )
    t.end()
  })

  t.test('store()', async (st) => {
    td.reset()
    st.plan(2)

    const config = new Config({ maxPerRequest: 5, transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const metaDB = level()
    const skeleton = new Skeleton({ chain, config, metaDB })
    skeleton.putBlocks = td.func<any>()
    const fetcher = new ReverseBlockFetcher({
      config,
      pool,
      chain,
      skeleton,
      first: new BN(10),
      count: new BN(10),
      timeout: 5,
    })
    td.when(skeleton.putBlocks(td.matchers.anything())).thenReject(new Error('err0'))
    try {
      await fetcher.store([])
    } catch (err: any) {
      st.ok(err.message === 'err0', 'store() threw on invalid block')
    }
    td.reset()
    skeleton.putBlocks = td.func<any>()
    td.when(skeleton.putBlocks(td.matchers.anything())).thenResolve(1)
    config.events.on(Event.SYNC_FETCHED_BLOCKS, () =>
      st.pass('store() emitted SYNC_FETCHED_BLOCKS event on putting blocks')
    )
    await fetcher.store([])
  })

  t.test('should restart the fetcher when subchains are merged', async (st) => {
    td.reset()
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const metaDB = level()
    const skeleton = new Skeleton({ chain, config, metaDB })

    const fetcher = new ReverseBlockFetcher({
      config,
      pool,
      chain,
      skeleton,
      first: new BN(10),
      count: new BN(5),
      timeout: 5,
    })
    const block47 = Block.fromBlockData({ header: { number: new BN(47) } })
    const block48 = Block.fromBlockData({
      header: { number: new BN(48), parentHash: block47.hash() },
    })
    const block49 = Block.fromBlockData({
      header: { number: new BN(49), parentHash: block48.hash() },
    })
    ;(skeleton as any).status.progress.subchains = [
      { head: new BN(100), tail: new BN(50), next: block49.hash() },
      { head: new BN(48), tail: new BN(5) },
    ]
    await (skeleton as any).putBlock(block47)
    await fetcher.store([block49, block48])
    st.ok((skeleton as any).status.progress.subchains.length === 1, 'subchains should be merged')
    st.equal(
      (skeleton as any).status.progress.subchains[0].tail.toNumber(),
      5,
      'subchain tail should be next segment'
    )
    st.notOk((fetcher as any).running, 'fetcher should stop')
    st.equal((fetcher as any).in.length, 0, 'fetcher in should be cleared')
    st.equal((fetcher as any).out.length, 0, 'fetcher out should be cleared')
    st.end()
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
