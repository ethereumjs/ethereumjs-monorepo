import { hexToBytes } from '@ethereumjs/util'
import * as tape from 'tape'
import * as td from 'testdouble'

import { Config } from '../../../src/config'
import { wait } from '../../integration/util'

tape('[TrieNodeFetcher]', async (t) => {
  class PeerPool {
    idle() {}
    ban() {}
  }
  PeerPool.prototype.idle = td.func<any>()
  PeerPool.prototype.ban = td.func<any>()

  const { TrieNodeFetcher } = await import('../../../src/sync/fetcher/trienodefetcher')

  t.test('should start/stop', async (t) => {
    const config = new Config({ maxPerRequest: 5, transports: [] })
    const pool = new PeerPool() as any
    const fetcher = new TrieNodeFetcher({
      config,
      pool,
      root: new Uint8Array(0),
    })
    fetcher.next = () => false
    t.notOk((fetcher as any).running, 'not started')
    t.equals((fetcher as any).in.length, 0, 'No jobs have yet been added')
    t.equal((fetcher as any).pathToNodeRequestData.length, 1, 'one node request has been added')

    void fetcher.fetch()
    await wait(100)
    t.ok((fetcher as any).running, 'started')
    t.ok(fetcher.write() === false, 'fetcher should not setup a new write pipe')
    fetcher.destroy()
    await wait(100)
    t.notOk((fetcher as any).running, 'stopped')
    t.end()
  })

  t.test('should process', (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const fetcher = new TrieNodeFetcher({
      config,
      pool,
      root: new Uint8Array(0),
    })
    const fullResult: any = [Uint8Array.from([0]), Uint8Array.from([1])]
    const NodeDataResponse: any = [Uint8Array.from([0]), Uint8Array.from([1])]
    NodeDataResponse.completed = true
    const task = {
      pathStrings: ['0', '1'],
      paths: [[Uint8Array.from([0])], [Uint8Array.from([1])]],
    }
    ;(fetcher as any).running = true
    fetcher.enqueueTask(task)
    const job = (fetcher as any).in.peek()
    t.deepEquals((fetcher.process(job, NodeDataResponse) as any)[0], fullResult[0], 'got results')
    t.notOk(fetcher.process({} as any, { NodeDataResponse: [] } as any), 'bad results')
    t.end()
  })

  t.test('should request correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const fetcher = new TrieNodeFetcher({
      config,
      pool,
      root: new Uint8Array(0),
    })
    const partialResult: any = [Uint8Array.from([0]), Uint8Array.from([1])]

    const task = {
      pathStrings: ['0', '1'],
      paths: [[Uint8Array.from([0])], [Uint8Array.from([1])]],
    }
    const peer = {
      snap: { getTrieNodes: td.func<any>() },
      id: 'random',
      address: 'random',
    }
    const job = { peer, partialResult, task }
    await fetcher.request(job as any)
    td.verify(
      job.peer.snap.getTrieNodes({
        root: new Uint8Array(0),
        paths: [[Uint8Array.from([0])], [Uint8Array.from([1])]],
        bytes: BigInt(50000),
      })
    )
    t.end()
  })

  t.test('should find a fetchable peer', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const fetcher = new TrieNodeFetcher({
      config,
      pool,
      root: new Uint8Array(0),
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
