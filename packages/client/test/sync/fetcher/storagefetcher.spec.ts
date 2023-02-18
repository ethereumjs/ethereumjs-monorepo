import * as tape from 'tape'
import * as td from 'testdouble'

import { Config } from '../../../lib/config'
import { wait } from '../../integration/util'

tape('[StorageFetcher]', async (t) => {
  class PeerPool {
    idle() {}
    ban() {}
  }
  PeerPool.prototype.idle = td.func<any>()
  PeerPool.prototype.ban = td.func<any>()

  const { StorageFetcher } = await import('../../../lib/sync/fetcher/storagefetcher')

  t.test('should start/stop', async (t) => {
    const config = new Config({ maxPerRequest: 5, transports: [] })
    const pool = new PeerPool() as any
    const fetcher = new StorageFetcher({
      config,
      pool,
      root: Buffer.from(''),
    })
    fetcher.next = () => false
    t.notOk((fetcher as any).running, 'not started')
    t.equals((fetcher as any).in.length, 0, 'No storageRequests have yet been added')
    fetcher.enqueueByStorageRequestList([
      {
        accountHash: Buffer.from(
          'e9a5016cb1a53dbc750d06e725514ac164231d71853cafdcbff42f5adb6ca6f1',
          'hex'
        ),
        storageRoot: Buffer.from(
          '69522138e4770e642ec8d7bd5e2b71a23fb732bb447cd4faf838b45cfe3b2a92',
          'hex'
        ),
        first: BigInt(0),
        count: BigInt(2) ** BigInt(256) - BigInt(1),
      },
    ])
    t.equals((fetcher as any).in.length, 1, 'A new task has been queued')
    void fetcher.fetch()
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
    const fetcher = new StorageFetcher({
      config,
      pool,
      root: Buffer.from(''),
      first: BigInt(1),
      count: BigInt(10),
    })
    const fullResult: any = [
      [
        [{ hash: Buffer.from(''), body: Buffer.from('') }],
        [{ hash: Buffer.from(''), body: Buffer.from('') }],
      ],
    ]
    const StorageDataResponse: any = [
      [
        [{ hash: Buffer.from(''), body: Buffer.from('') }],
        [{ hash: Buffer.from(''), body: Buffer.from('') }],
      ],
    ]
    StorageDataResponse.completed = true
    const task = {
      storageRequests: [
        {
          accountHash: Buffer.from(
            'e9a5016cb1a53dbc750d06e725514ac164231d71853cafdcbff42f5adb6ca6f1',
            'hex'
          ),
          storageRoot: Buffer.from(
            '69522138e4770e642ec8d7bd5e2b71a23fb732bb447cd4faf838b45cfe3b2a92',
            'hex'
          ),
          first: BigInt(0),
          count: BigInt(2) ** BigInt(256) - BigInt(1),
        },
      ],
    }
    ;(fetcher as any).running = true
    fetcher.enqueueTask(task)
    const job = (fetcher as any).in.peek()
    t.deepEquals(
      (fetcher.process(job, StorageDataResponse) as any)[0],
      fullResult[0],
      'got results'
    )
    t.notOk(fetcher.process({} as any, { StorageDataResponse: [] } as any), 'bad results')
    t.end()
  })

  t.test('should adopt correctly', (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const fetcher = new StorageFetcher({
      config,
      pool,
      root: Buffer.from(''),
    })
    const StorageDataResponse: any = [
      [
        [{ hash: Buffer.from(''), body: Buffer.from('') }],
        [{ hash: Buffer.from(''), body: Buffer.from('') }],
      ],
    ]
    StorageDataResponse.completed = false
    const task = {
      storageRequests: [
        {
          accountHash: Buffer.from(
            'e9a5016cb1a53dbc750d06e725514ac164231d71853cafdcbff42f5adb6ca6f1',
            'hex'
          ),
          storageRoot: Buffer.from(
            '69522138e4770e642ec8d7bd5e2b71a23fb732bb447cd4faf838b45cfe3b2a92',
            'hex'
          ),
          first: BigInt(0),
          count: BigInt(2) ** BigInt(256) - BigInt(1),
        },
      ],
    }
    ;(fetcher as any).running = true
    fetcher.enqueueTask(task)
    const job = (fetcher as any).in.peek()
    let results = fetcher.process(job as any, StorageDataResponse)
    t.equal((fetcher as any).in.length, 1, 'Fetcher should still have same job')
    t.equal(job?.partialResult[0].length, 2, 'Should have two partial results')
    t.equal(results, undefined, 'Process should not return full results yet')
    const remainingStorageData: any = [
      [
        [{ hash: Buffer.from(''), body: Buffer.from('') }],
        [{ hash: Buffer.from(''), body: Buffer.from('') }],
        [{ hash: Buffer.from(''), body: Buffer.from('') }],
      ],
    ]
    remainingStorageData.completed = true
    results = fetcher.process(job as any, remainingStorageData)
    t.equal((results as any)[0].length, 5, 'Should return full results')
    t.end()
  })

  t.test('should find a fetchable peer', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const fetcher = new StorageFetcher({
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
