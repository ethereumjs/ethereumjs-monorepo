import * as tape from 'tape'
import * as td from 'testdouble'

import { Chain } from '../../../lib/blockchain'
import { Config } from '../../../lib/config'
import { Event } from '../../../lib/types'

tape('[HeaderFetcher]', async (t) => {
  class PeerPool {
    idle() {}
    ban() {}
  }
  PeerPool.prototype.idle = td.func<any>()
  PeerPool.prototype.ban = td.func<any>()
  td.replace<any>('../../lib/net/peerpool', { PeerPool })

  const { HeaderFetcher } = await import('../../../lib/sync/fetcher/headerfetcher')

  t.test('should process', (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool()
    const flow = td.object()
    const fetcher = new HeaderFetcher({ config, pool, flow })
    const headers = [{ number: 1 }, { number: 2 }]
    t.deepEquals(
      //@ts-ignore
      fetcher.process({ task: { count: 2 }, peer: 'peer0' }, { headers, bv: BigInt(1) }),
      headers,
      'got results'
    )
    //@ts-ignore
    t.notOk(fetcher.process({ task: { count: 2 } }, { headers: [], bv: BigInt(1) }), 'bad results')
    td.verify((fetcher as any).flow.handleReply('peer0', 1))
    t.end()
  })

  t.test('should adopt correctly', (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const flow = td.object()
    const fetcher = new HeaderFetcher({
      config,
      pool,
      flow,
    })
    const headers = [{ number: 1 }, { number: 2 }]
    const task = { count: 3, first: BigInt(1) }
    ;(fetcher as any).running = true
    fetcher.enqueueTask(task)
    const job = (fetcher as any).in.peek()

    let results = fetcher.process(job as any, { headers, bv: BigInt(1) } as any)
    t.equal((fetcher as any).in.length, 1, 'Fetcher should still have same job')
    t.equal(job?.partialResult?.length, 2, 'Should have two partial results')
    t.equal(results, undefined, 'Process should not return full results yet')

    const remainingHeaders: any = [{ number: 3 }]
    results = fetcher.process(job as any, { headers: remainingHeaders, bv: BigInt(1) } as any)
    t.equal(results?.length, 3, 'Should return full results')

    t.end()
  })

  t.test('should find a fetchable peer', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool()
    const fetcher = new HeaderFetcher({ config, pool })
    td.when((fetcher as any).pool.idle(td.matchers.anything())).thenReturn('peer0')
    t.equal(fetcher.peer(), 'peer0', 'found peer')
    t.end()
  })

  t.test('should request correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const flow = td.object()
    const fetcher = new HeaderFetcher({
      config,
      pool,
      flow,
    })
    const partialResult = [{ number: 1 }, { number: 2 }]
    const task = { count: 3, first: BigInt(1) }
    const peer = {
      les: { getBlockHeaders: td.func<any>() },
      id: 'random',
      address: 'random',
    }
    const job = { peer, partialResult, task }
    await fetcher.request(job as any)
    td.verify(
      job.peer.les.getBlockHeaders({
        block: job.task.first + BigInt(partialResult.length),
        max: job.task.count - partialResult.length,
        reverse: false,
      })
    )
    t.end()
  })

  t.test('store()', async (st) => {
    st.plan(2)

    const config = new Config({ maxPerRequest: 5, transports: [] })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    chain.putHeaders = td.func<any>()
    const fetcher = new HeaderFetcher({
      config,
      pool,
      chain,
      first: BigInt(1),
      count: BigInt(10),
      timeout: 5,
    })
    td.when(chain.putHeaders([0 as any])).thenReject(new Error('err0'))
    try {
      await fetcher.store([0 as any])
    } catch (err: any) {
      st.equal(err.message, 'err0', 'store() threw on invalid header')
    }
    td.when(chain.putHeaders([1 as any])).thenResolve(1)
    config.events.on(Event.SYNC_FETCHED_HEADERS, () =>
      st.pass('store() emitted SYNC_FETCHED_HEADERS event on putting headers')
    )
    await fetcher.store([1 as any])
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
