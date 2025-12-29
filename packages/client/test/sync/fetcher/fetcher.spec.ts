import { assert, describe, it, vi } from 'vitest'

import { Config } from '../../../src/config.ts'
import { Fetcher } from '../../../src/sync/fetcher/fetcher.ts'
import { Event } from '../../../src/types.ts'

import type { Job } from '../../../src/sync/fetcher/types.ts'

class FetcherTest extends Fetcher<any, any, any> {
  process(_job: any, res: any) {
    return res
  }
  async request(_job: any, _peer: any) {
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
  const fetcher = new FetcherTest({
    config,
    pool: {
      ban: vi.fn(),
      idle: vi.fn(),
    } as any,
  })
  const job: any = { peer: {}, state: 'active' }
  fetcher['running'] = true
  fetcher.next = vi.fn()
  fetcher.wait = vi.fn().mockResolvedValue(undefined)
  fetcher['success'](job, undefined)
  assert.strictEqual(fetcher['in'].length, 1, 'enqueued job')
  setTimeout(() => assert.isTrue(job.peer.idle, 'peer idled'), 10)
})

it('should handle failure', () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const fetcher = new FetcherTest({
    config,
    pool: {
      ban: vi.fn(),
      idle: vi.fn(),
    } as any,
  })
  const job = { peer: {}, state: 'active' }
  fetcher['running'] = true
  fetcher.next = vi.fn()
  config.events.on(Event.SYNC_FETCHER_ERROR, (err) =>
    assert.strictEqual(err.message, 'err0', 'got error'),
  )
  fetcher['failure'](job as Job<any, any, any>, new Error('err0'))
  assert.strictEqual(fetcher['in'].length, 1, 'enqueued job')
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
        idle: vi.fn(),
      } as any,
      timeout: 5,
    })
    const job = { index: 0 }
    const peer = { idle: true, latest: vi.fn() }
    fetcher.peer = vi.fn().mockReturnValue(peer)
    fetcher.request = vi.fn().mockImplementationOnce(async (job, peer) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000)
      })
      if (peer.idle === false) throw new Error('err0')
      return
    })

    fetcher['in'].insert(job as any)
    ;(fetcher as any)['_readableState'] = []
    fetcher['running'] = true
    fetcher['total'] = 10
    fetcher.next()
    await new Promise((resolve) => {
      setTimeout(resolve, 10)
    })

    assert.strictEqual(fetcher['in'].length, 1, 'enqueued job')
    assert.deepEqual((job as any).state, 'expired', 'expired job')
  })
})

describe('should handle queue management', () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const fetcher = new FetcherTest({
    config,
    pool: {
      ban: vi.fn(),
      idle: vi.fn(),
    } as any,
  })
  const job1 = { index: 0 }
  const job2 = { index: 1 }
  const job3 = { index: 2 }
  it('should fill queue', () => {
    fetcher['in'].insert(job1 as any)
    fetcher['in'].insert(job2 as any)
    fetcher['in'].insert(job3 as any)
    assert.strictEqual(fetcher['in'].length, 3, 'queue filled')
  })
  it('should clear queue', () => {
    fetcher.clear()
    assert.strictEqual(fetcher['in'].length, 0, 'queue cleared')
  })
  const job4 = { index: 3 }
  const job5 = { index: 4 }
  it('should fail', () => {
    fetcher['in'].insert(job1 as any)
    fetcher['in'].insert(job2 as any)
    fetcher['in'].insert(job3 as any)
    fetcher['in'].insert(job4 as any)
    fetcher['in'].insert(job5 as any)
    assert.isFalse(fetcher.next(), 'next() fails when heap length exceeds maxQueue')
  })
})

describe('should re-enqueue on a non-fatal error', () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const fetcher = new FetcherTest({
    config,
    pool: {
      ban: vi.fn(),
      idle: vi.fn(),
    } as any,
    timeout: 5000,
  })
  const task = { first: BigInt(50), count: 10 }
  const job: any = { peer: {}, task, state: 'active', index: 0 }
  fetcher.next = vi.fn()
  fetcher.processStoreError = vi.fn().mockReturnValue({
    destroyFetcher: false,
    banPeer: true,
    stepBack: BigInt(49),
  })
  fetcher.write()
  fetcher['running'] = true
  fetcher.store = vi.fn().mockRejectedValue(new Error('could not find parent header'))
  fetcher['success'](job, ['something'])
  it('should step back', async () => {
    // Wait for async write error handling to complete
    await new Promise((resolve) => setTimeout(resolve, 100))
    assert.strictEqual(
      fetcher['in'].peek()?.task.first,
      BigInt(1),
      'should step back for safeReorgDistance',
    )
  })
})

describe('should handle fatal errors correctly', () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const fetcher = new FetcherTest({
    config,
    pool: {
      ban: vi.fn(),
      idle: vi.fn(),
    } as any,
    timeout: 5000,
  })
  const task = { first: BigInt(50), count: 10 }
  const job: any = { peer: {}, task, state: 'active', index: 0 }
  fetcher['in'].insert(job)
  fetcher.error({ name: 'VeryBadError', message: 'Something very bad happened' }, job, true)
  it('should handle fatal error', () => {
    assert.strictEqual(fetcher.syncErrored?.name, 'VeryBadError', 'fatal error has correct name')
    assert.strictEqual(fetcher['in'].length, 0, 'fatal error clears job queue')
  })
  fetcher.clear()
})
