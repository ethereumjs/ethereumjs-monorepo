import * as td from 'testdouble'
import { assert, describe, it, vi } from 'vitest'

import { Config } from '../../../src/config'
import { Fetcher } from '../../../src/sync/fetcher/fetcher'
import { Event } from '../../../src/types'

import type { Job } from '../../../src/sync/fetcher/types'

class FetcherTest extends Fetcher<any, any, any> {
  process(_job: any, res: any) {
    return res
  }
  async request(_job: any, _peer: any) {
    console.trace(_job)
    return _job
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

describe('should handle expiration', async () => {
  it('should expire', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const fetcher = new FetcherTest({
      config,
      pool: {
        contains(peer: any) {
          if (peer.idle === false) return true
          return false
        },
        ban: vi.fn(),
      } as any,
      timeout: 5,
    })
    const job = { index: 0 }
    const peer = { idle: true }
    fetcher.peer = vi.fn().mockReturnValue(() => peer)
    fetcher.request = vi.fn().mockImplementationOnce(async (job, peer) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000)
      })
      if (peer.idle === false) throw new Error('err0')
      return
    })

    fetcher['in'].insert(job as any)
    fetcher['_readableState'] = []
    fetcher['running'] = true
    fetcher['total'] = 10
    fetcher.next()
    await new Promise((resolve) => {
      setTimeout(resolve, 10)
    })

    assert.equal((fetcher as any).in.length, 1, 'enqueued job')
    assert.deepEqual((job as any).state, 'expired', 'expired job')
  })
})

describe('should handle queue management', () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const fetcher = new FetcherTest({
    config,
    pool: td.object(),
  })
  const job1 = { index: 0 }
  const job2 = { index: 1 }
  const job3 = { index: 2 }
  it('should fill queue', () => {
    ;(fetcher as any).in.insert(job1)
    ;(fetcher as any).in.insert(job2)
    ;(fetcher as any).in.insert(job3)
    assert.equal((fetcher as any).in.length, 3, 'queue filled')
  })
  it('should clear queue', () => {
    fetcher.clear()
    assert.equal((fetcher as any).in.length, 0, 'queue cleared')
  })
  const job4 = { index: 3 }
  const job5 = { index: 4 }
  it('should fail', () => {
    ;(fetcher as any).in.insert(job1)
    ;(fetcher as any).in.insert(job2)
    ;(fetcher as any).in.insert(job3)
    ;(fetcher as any).in.insert(job4)
    ;(fetcher as any).in.insert(job5)
    assert.ok(fetcher.next() === false, 'next() fails when heap length exceeds maxQueue')
  })
})

describe('should re-enqueue on a non-fatal error', () => {
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
  it('should step back', () => {
    assert.ok(
      (fetcher as any).in.peek().task.first === BigInt(1),
      'should step back for safeReorgDistance'
    )
  })
})

td.reset()

describe('should handle fatal errors correctly', () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const fetcher = new FetcherTest({ config, pool: td.object(), timeout: 5000 })
  const task = { first: BigInt(50), count: 10 }
  const job: any = { peer: {}, task, state: 'active', index: 0 }
  ;(fetcher as any).in.insert(job)
  fetcher.error({ name: 'VeryBadError', message: 'Something very bad happened' }, job, true)
  it('should handle fatal error', () => {
    assert.equal(fetcher.syncErrored?.name, 'VeryBadError', 'fatal error has correct name')
    assert.equal((fetcher as any).in.length, 0, 'fatal error clears job queue')
  })
  fetcher.clear()
})
