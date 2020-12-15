import { BN } from 'ethereumjs-util'
import tape from 'tape-catch'
import td from 'testdouble'
import { Chain } from '../../../lib/blockchain/chain'
import { Config } from '../../../lib/config'
import { Fetcher } from '../../../lib/sync/fetcher/fetcher'

tape('[Fetcher]', (t) => {
  t.test('should handle bad result', (t) => {
    t.plan(2)
    const config = new Config({ loglevel: 'error', transports: [] })
    const chain = new Chain({ config })
    const fetcher = new Fetcher({
      config,
      chain,
      pool: td.object(),
      first: new BN(0),
      count: new BN(0),
    })
    const job: any = { peer: {}, state: 'active' }
    ;(fetcher as any).running = true
    fetcher.next = td.func<Fetcher['next']>()
    fetcher.wait = td.func<Fetcher['wait']>()
    td.when(fetcher.wait()).thenResolve(undefined)
    fetcher.success(job, undefined)
    t.equals((fetcher as any).in.size(), 1, 'enqueued job')
    setTimeout(() => t.ok(job.peer.idle, 'peer idled'), 10)
  })

  t.test('should handle failure', (t) => {
    t.plan(2)
    const config = new Config({ loglevel: 'error', transports: [] })
    const chain = new Chain({ config })
    const fetcher = new Fetcher({
      config,
      chain,
      pool: td.object(),
      first: new BN(0),
      count: new BN(0),
    })
    const job = { peer: {}, state: 'active' }
    ;(fetcher as any).running = true
    fetcher.next = td.func<Fetcher['next']>()
    fetcher.on('error', (err: Error) => t.equals(err.message, 'err0', 'got error'))
    fetcher.failure(job, new Error('err0'))
    t.equals((fetcher as any).in.size(), 1, 'enqueued job')
  })

  t.test('should handle expiration', (t) => {
    t.plan(2)
    const config = new Config({ loglevel: 'error', transports: [] })
    const chain = new Chain({ config })
    const fetcher = new Fetcher({
      config,
      chain,
      pool: td.object(),
      first: new BN(0),
      count: new BN(0),
      timeout: 5,
    })
    const job = { index: 0 }
    const peer = { idle: true }
    fetcher.peer = td.func<Fetcher['peer']>()
    fetcher.request = td.func<Fetcher['request']>()
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

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
