import tape from 'tape'
import td from 'testdouble'
import { Config } from '../../../lib/config'
import { Fetcher } from '../../../lib/sync/fetcher/fetcher'
import { Job } from '../../../lib/sync/fetcher/types'
import { Event } from '../../../lib/types'

class FetcherTest extends Fetcher<any, any, any> {
  process(_job: any, _res: any) {
    return undefined // have to return undefined, otherwise the function return signature is void.
  }
  async request(_job: any, _peer: any) {
    return
  }
  async store(_store: any) {}
}

tape('[Fetcher]', (t) => {
  t.test('should handle bad result', (t) => {
    t.plan(2)
    const config = new Config({ transports: [] })
    const fetcher = new FetcherTest({ config, pool: td.object() })
    const job: any = { peer: {}, state: 'active' }
    ;(fetcher as any).running = true
    fetcher.next = td.func<FetcherTest['next']>()
    fetcher.wait = td.func<FetcherTest['wait']>()
    td.when(fetcher.wait()).thenResolve(undefined)
    ;(fetcher as any).success(job, undefined)
    t.equals((fetcher as any).in.size(), 1, 'enqueued job')
    setTimeout(() => t.ok(job.peer.idle, 'peer idled'), 10)
  })

  t.test('should handle failure', (t) => {
    t.plan(2)
    const config = new Config({ transports: [] })
    const fetcher = new FetcherTest({ config, pool: td.object() })
    const job = { peer: {}, state: 'active' }
    ;(fetcher as any).running = true
    fetcher.next = td.func<FetcherTest['next']>()
    config.events.on(Event.SYNC_FETCHER_ERROR, (err) => t.equals(err.message, 'err0', 'got error'))
    ;(fetcher as any).failure(job as Job<any, any, any>, new Error('err0'))
    t.equals((fetcher as any).in.size(), 1, 'enqueued job')
  })

  t.test('should handle expiration', (t) => {
    t.plan(2)
    const config = new Config({ transports: [] })
    const fetcher = new FetcherTest({
      config,
      pool: td.object(),
      timeout: 5,
    })
    const job = { index: 0 }
    const peer = { idle: true }
    fetcher.peer = td.func<FetcherTest['peer']>()
    fetcher.request = td.func<FetcherTest['request']>()
    td.when(fetcher.peer()).thenReturn(peer)
    td.when(fetcher.request(td.matchers.anything(), { idle: false }), { delay: 10 }).thenReject(
      new Error('err0')
    )
    td.when((fetcher as any).pool.contains({ idle: false })).thenReturn(true)
    ;(fetcher as any).in.insert(job)
    ;(fetcher as any)._readableState = []
    ;(fetcher as any).running = true
    ;(fetcher as any).total = 10
    fetcher.next()
    setTimeout(() => {
      t.deepEquals(job, { index: 0, peer: { idle: false }, state: 'expired' }, 'expired job')
      t.equals((fetcher as any).in.size(), 1, 'enqueued job')
    }, 20)
  })

  t.test('should handle clearing queue', (t) => {
    t.plan(2)
    const config = new Config({ transports: [] })
    const fetcher = new FetcherTest({
      config,
      pool: td.object(),
    })
    const job1 = { index: 0 }
    const job2 = { index: 1 }
    const job3 = { index: 2 }
    ;(fetcher as any).in.insert(job1)
    ;(fetcher as any).in.insert(job2)
    ;(fetcher as any).in.insert(job3)
    t.equals((fetcher as any).in.size(), 3, 'queue filled')
    fetcher.clear()
    t.equals((fetcher as any).in.size(), 0, 'queue cleared')
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
