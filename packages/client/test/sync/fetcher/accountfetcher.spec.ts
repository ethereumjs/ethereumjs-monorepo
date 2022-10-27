import * as tape from 'tape'
import * as td from 'testdouble'

import { Config } from '../../../lib/config'
import { wait } from '../../integration/util'

tape('[AccountFetcher]', async (t) => {
  class PeerPool {
    idle() {}
    ban() {}
  }
  PeerPool.prototype.idle = td.func<any>()
  PeerPool.prototype.ban = td.func<any>()

  const { AccountFetcher } = await import('../../../lib/sync/fetcher/accountfetcher')

  t.test('should start/stop', async (t) => {
    const config = new Config({ maxPerRequest: 5, transports: [] })
    const pool = new PeerPool() as any
    const fetcher = new AccountFetcher({
      config,
      pool,
      root: Buffer.from(''),
      first: BigInt(1),
      count: BigInt(10),
    })
    fetcher.next = () => false
    t.notOk((fetcher as any).running, 'not started')
    void fetcher.fetch()
    t.equals((fetcher as any).in.length, 1, 'added 1 tasks')
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
    const fetcher = new AccountFetcher({
      config,
      pool,
      root: Buffer.from(''),
      first: BigInt(1),
      count: BigInt(10),
    })
    const fullResult: any = [
      {
        hash: Buffer.from(''),
        body: [Buffer.from(''), Buffer.from(''), Buffer.from(''), Buffer.from('')],
      },
      {
        hash: Buffer.from(''),
        body: [Buffer.from(''), Buffer.from(''), Buffer.from(''), Buffer.from('')],
      },
    ]
    const accountDataResponse: any = [
      {
        hash: Buffer.from(''),
        body: [Buffer.from(''), Buffer.from(''), Buffer.from(''), Buffer.from('')],
      },
      {
        hash: Buffer.from(''),
        body: [Buffer.from(''), Buffer.from(''), Buffer.from(''), Buffer.from('')],
      },
    ]
    accountDataResponse.completed = true
    t.deepEquals(fetcher.process({} as any, accountDataResponse), fullResult, 'got results')
    t.notOk(fetcher.process({} as any, { accountDataResponse: [] } as any), 'bad results')
    t.end()
  })

  t.test('should adopt correctly', (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const fetcher = new AccountFetcher({
      config,
      pool,
      root: Buffer.from(''),
      first: BigInt(1),
      count: BigInt(10),
    })
    const accountDataResponse: any = [
      {
        hash: Buffer.from(''),
        body: [Buffer.from(''), Buffer.from(''), Buffer.from(''), Buffer.from('')],
      },
      {
        hash: Buffer.from(''),
        body: [Buffer.from(''), Buffer.from(''), Buffer.from(''), Buffer.from('')],
      },
    ]
    accountDataResponse.completed = false
    const task = { count: BigInt(3), first: BigInt(1) }
    ;(fetcher as any).running = true
    fetcher.enqueueTask(task)
    const job = (fetcher as any).in.peek()
    let results = fetcher.process(job as any, accountDataResponse)
    t.equal((fetcher as any).in.length, 1, 'Fetcher should still have same job')
    t.equal(job?.partialResult?.length, 2, 'Should have two partial results')
    t.equal(results, undefined, 'Process should not return full results yet')

    const remainingAccountData: any = [
      {
        hash: Buffer.from(''),
        body: [Buffer.from(''), Buffer.from(''), Buffer.from(''), Buffer.from('')],
      },
    ]
    remainingAccountData.completed = true
    results = fetcher.process(job as any, remainingAccountData)
    t.equal(results?.length, 3, 'Should return full results')

    t.end()
  })

  t.test('should find a fetchable peer', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const fetcher = new AccountFetcher({
      config,
      pool,
      root: Buffer.from(''),
      first: BigInt(1),
      count: BigInt(10),
    })
    td.when((fetcher as any).pool.idle(td.matchers.anything())).thenReturn('peer0')
    t.equals(fetcher.peer(), 'peer0', 'found peer')
    t.end()
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
