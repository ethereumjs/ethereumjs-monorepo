import tape from 'tape-catch'
const td = require('testdouble')
import { defaultLogger } from '../../../lib/logging'
defaultLogger.silent = true

tape('[Fetcher]', (t) => {
  const Fetcher = require('../../../lib/sync/fetcher/fetcher').Fetcher

  t.test('should handle bad result', (t) => {
    t.plan(2)
    const fetcher = new Fetcher({ pool: td.object() })
    const job: any = { peer: {}, state: 'active' }
    fetcher.running = true
    fetcher.next = td.func()
    fetcher.wait = td.func()
    td.when(fetcher.wait()).thenResolve()
    fetcher.success(job, undefined)
    t.equals(fetcher.in.size(), 1, 'enqueued job')
    setTimeout(() => t.ok(job.peer.idle, 'peer idled'), 10)
  })

  t.test('should handle failure', (t) => {
    t.plan(2)
    const fetcher = new Fetcher({ pool: td.object() })
    const job = { peer: {}, state: 'active' }
    fetcher.running = true
    fetcher.next = td.func()
    fetcher.on('error', (err: any) => t.equals(err, 'err0', 'got error'))
    fetcher.failure(job, 'err0')
    t.equals(fetcher.in.size(), 1, 'enqueued job')
  })

  t.test('should handle expiration', (t) => {
    t.plan(2)
    const fetcher = new Fetcher({ pool: td.object(), timeout: 5 })
    const job = { index: 0 }
    const peer = { idle: true }
    fetcher.peer = td.func()
    fetcher.request = td.func()
    td.when(fetcher.peer()).thenReturn(peer)
    td.when(fetcher.request(td.matchers.anything(), { idle: false }), { delay: 10 }).thenReject(
      'err0'
    )
    td.when(fetcher.pool.contains({ idle: false })).thenReturn(true)
    fetcher.in.insert(job)
    fetcher._readableState = []
    fetcher.running = true
    fetcher.total = 10
    fetcher.next()
    setTimeout(() => {
      t.deepEquals(job, { index: 0, peer: { idle: false }, state: 'expired' }, 'expired job')
      t.equals(fetcher.in.size(), 1, 'enqueued job')
    }, 20)
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
