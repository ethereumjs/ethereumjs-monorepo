import { Trie } from '@ethereumjs/trie'
import * as tape from 'tape'
import * as td from 'testdouble'

import { Config } from '../../../lib/config'
import { wait } from '../../integration/util'

import { _accountRangeRLP } from './accountfetcher.spec'

const _storageRangesRLP =
  'f83e0bf83af838f7a0290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5639594053cd080a26cb03d5e6d2956cebb31c56e7660cac0'

tape('[ByteCodeFetcher]', async (t) => {
  class PeerPool {
    idle() {}
    ban() {}
  }
  PeerPool.prototype.idle = td.func<any>()
  PeerPool.prototype.ban = td.func<any>()

  const { ByteCodeFetcher } = await import('../../../lib/sync/fetcher/bytecodefetcher')

  t.test('should start/stop', async (t) => {
    const config = new Config({ maxPerRequest: 5, transports: [] })
    const pool = new PeerPool() as any
    const fetcher = new ByteCodeFetcher({
      config,
      pool,
      trie: new Trie({ useKeyHashing: false }),
      hashes: [
        Buffer.from('2034f79e0e33b0ae6bef948532021baceb116adf2616478703bec6b17329f1cc', 'hex'),
      ],
    })
    fetcher.next = () => false
    t.notOk((fetcher as any).running, 'not started')
    t.equals((fetcher as any).in.length, 0, 'No jobs have yet been added')
    t.equal((fetcher as any).hashes.length, 1, 'one codehash have been added')
    fetcher.enqueueByByteCodeRequestList([
      Buffer.from('2034f79e0e33b0ae6bef948532021baceb116adf2616478703bec6b17329f1cc', 'hex'),
    ])
    t.equals((fetcher as any).in.length, 1, 'A new task has been queued')
    const job = (fetcher as any).in.peek()
    t.equal(job!.task.hashes.length, 2, 'two storageRequests are added to job')

    void fetcher.fetch()
    await wait(100)
    t.ok((fetcher as any).running, 'started')
    t.ok(fetcher.write() === false, 'fetcher should not setup a new write pipe')
    fetcher.destroy()
    await wait(100)
    t.notOk((fetcher as any).running, 'stopped')
    t.end()
  })

  t.test('should find a fetchable peer', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const fetcher = new ByteCodeFetcher({
      config,
      pool,
      trie: new Trie({ useKeyHashing: false }),
      hashes: [Buffer.from('')],
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
