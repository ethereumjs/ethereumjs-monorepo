import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { Config } from '../../../src/config'
import { Fetcher } from '../../../src/sync/fetcher/fetcher'
import { Event } from '../../../src/types'

import type { Job } from '../../../src/sync/fetcher/types'

class FetcherTest extends Fetcher<any, any, any> {
  process(_job: any, res: any) {
    return res
  }
  async request(_job: any, _peer: any) {
    return
  }
  async store(_store: any) {}
  // Just return any via _error
  processStoreError(error: any, _job: any) {
    return error
  }
  jobStr(_job: any, _withIndex: any) {
    return ''
  }
}

describe('[Fetcher]', () => {
  it('should handle bad result', () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const fetcher = new FetcherTest({ config, pool: td.object() })
    const job: any = { peer: {}, state: 'active' }
    ;(fetcher as any).running = true
    fetcher.next = td.func<FetcherTest['next']>()
    fetcher.wait = td.func<FetcherTest['wait']>()
    td.when(fetcher.wait()).thenResolve(undefined)
    ;(fetcher as any).success(job, undefined)
    assert.equal((fetcher as any).in.length, 1, 'enqueued job')
    setTimeout(() => assert.ok(job.peer.idle, 'peer idled'), 10)
  })

  it('should handle failure', () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const fetcher = new FetcherTest({ config, pool: td.object() })
    const job = { peer: {}, state: 'active' }
    ;(fetcher as any).running = true
    fetcher.next = td.func<FetcherTest['next']>()
    config.events.on(Event.SYNC_FETCHER_ERROR, (err) =>
      assert.equal(err.message, 'err0', 'got error')
    )
    ;(fetcher as any).failure(job as Job<any, any, any>, new Error('err0'))
    assert.equal((fetcher as any).in.length, 1, 'enqueued job')
  })

  it('should handle expiration', () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
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
      assert.deepEqual(
        job as any,
        { index: 0, peer: { idle: false }, state: 'expired' },
        'expired job'
      )
      assert.equal((fetcher as any).in.length, 1, 'enqueued job')
    }, 20)
  })

  it('should handle queue management', () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
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
    assert.equal((fetcher as any).in.length, 3, 'queue filled')
    fetcher.clear()
    assert.equal((fetcher as any).in.length, 0, 'queue cleared')
    const job4 = { index: 3 }
    const job5 = { index: 4 }

    ;(fetcher as any).in.insert(job1)
    ;(fetcher as any).in.insert(job2)
    ;(fetcher as any).in.insert(job3)
    ;(fetcher as any).in.insert(job4)
    ;(fetcher as any).in.insert(job5)

    assert.ok(fetcher.next() === false, 'next() fails when heap length exceeds maxQueue')
  })

  it('should re-enqueue on a non-fatal error', () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const fetcher = new FetcherTest({ config, pool: td.object(), timeout: 5000 })
    const task = { first: BigInt(50), count: 10 }
    const job: any = { peer: {}, task, state: 'active', index: 0 }
    fetcher.next = td.func<FetcherTest['next']>()
    fetcher.processStoreError = td.func<FetcherTest['processStoreError']>()
    fetcher.write()
    ;(fetcher as any).running = true
    fetcher.store = td.func<FetcherTest['store']>()
    td.when(fetcher.store(td.matchers.anything())).thenReject(
      new Error('could not find parent header')
    )
    td.when(fetcher.processStoreError(td.matchers.anything(), td.matchers.anything())).thenReturn({
      destroyFetcher: false,
      banPeer: true,
      stepBack: BigInt(49),
    })
    ;(fetcher as any).success(job, ['something'])
    setTimeout(() => {
      assert.ok(
        (fetcher as any).in.peek().task.first === BigInt(1),
        'should step back for safeReorgDistance'
      )
    }, 20)
  })

  it('should reset td', () => {
    td.reset()
  })

  it('should handle fatal errors correctly', () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const fetcher = new FetcherTest({ config, pool: td.object(), timeout: 5000 })
    const task = { first: BigInt(50), count: 10 }
    const job: any = { peer: {}, task, state: 'active', index: 0 }
    ;(fetcher as any).in.insert(job)
    fetcher.error({ name: 'VeryBadError', message: 'Something very bad happened' }, job, true)
    assert.equal(fetcher.syncErrored?.name, 'VeryBadError', 'fatal error has correct name')
    assert.equal((fetcher as any).in.length, 0, 'fatal error clears job queue')
    fetcher.clear()
  })
})
