import { RLP } from '@ethereumjs/rlp'
import { Trie } from '@ethereumjs/trie'
import { hexToBytes, utf8ToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'
import * as td from 'testdouble'

import { Chain } from '../../../src/blockchain'
import { Config } from '../../../src/config'
import { SnapProtocol } from '../../../src/net/protocol'
import { wait } from '../../integration/util'

import { _accountRangeRLP } from './accountfetcher.spec'

const _byteCodesRLP =
  'f89e1af89b9e60806040526004361061003f5760003560e01c806301ffc9a714610044579e60806040526004361061003f5760003560e01c806301ffc9a714610044589e60806040526004361061003f5760003560e01c806301ffc9a714610044599e60806040526004361061003f5760003560e01c806301ffc9a714610044609e60806040526004361061003f5760003560e01c806301ffc9a71461004461'

tape('[ByteCodeFetcher]', async (t) => {
  class PeerPool {
    idle() {}
    ban() {}
  }
  PeerPool.prototype.idle = td.func<any>()
  PeerPool.prototype.ban = td.func<any>()

  const { ByteCodeFetcher } = await import('../../../src/sync/fetcher/bytecodefetcher')

  t.test('should start/stop', async (t) => {
    const config = new Config({ maxPerRequest: 5, transports: [] })
    const pool = new PeerPool() as any
    const fetcher = new ByteCodeFetcher({
      config,
      pool,
      trie: new Trie({ useKeyHashing: false }),
      hashes: [hexToBytes('2034f79e0e33b0ae6bef948532021baceb116adf2616478703bec6b17329f1cc')],
    })
    fetcher.next = () => false
    t.notOk((fetcher as any).running, 'not started')
    t.equals((fetcher as any).in.length, 0, 'No jobs have yet been added')
    t.equal((fetcher as any).hashes.length, 1, 'one codehash have been added')
    fetcher.enqueueByByteCodeRequestList([
      hexToBytes('2034f79e0e33b0ae6bef948532021baceb116adf2616478703bec6b17329f1cc'),
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

  t.test('should process', (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const fetcher = new ByteCodeFetcher({
      config,
      pool,
      trie: new Trie({ useKeyHashing: false }),
      hashes: [],
    })

    const fullResult: any = [utf8ToBytes('')]

    const ByteCodeResponse: any = [utf8ToBytes('')]
    ByteCodeResponse.completed = true
    const task = {
      hashes: [utf8ToBytes('')],
    }
    ;(fetcher as any).running = true
    fetcher.enqueueTask(task)
    const job = (fetcher as any).in.peek()
    t.deepEquals((fetcher.process(job, ByteCodeResponse) as any)[0], fullResult[0], 'got results')
    t.notOk(fetcher.process({} as any, { ByteCodeResponse: [] } as any), 'bad results')
    t.end()
  })

  t.test('should adopt correctly', (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const fetcher = new ByteCodeFetcher({
      config,
      pool,
      trie: new Trie({ useKeyHashing: false }),
      hashes: [],
    })
    const ByteCodeResponse: any = [utf8ToBytes(''), utf8ToBytes('')]
    ByteCodeResponse.completed = false
    const task = {
      hashes: [utf8ToBytes('')],
    }
    ;(fetcher as any).running = true
    fetcher.enqueueTask(task)
    const job = (fetcher as any).in.peek()
    let results = fetcher.process(job as any, ByteCodeResponse)
    t.equal((fetcher as any).in.length, 1, 'Fetcher should still have same job')
    t.equal(job?.partialResult.length, 2, 'Should have two partial results')
    t.equal(results, undefined, 'Process should not return full results yet')
    const remainingBytesCodeData: any = [utf8ToBytes(''), utf8ToBytes(''), utf8ToBytes('')]
    remainingBytesCodeData.completed = true
    results = fetcher.process(job as any, remainingBytesCodeData)
    t.equal((results as any).length, 5, 'Should return full results')
    t.end()
  })

  t.test('should request correctly', async (t) => {
    const config = new Config({ transports: [] })
    const chain = await Chain.create({ config })
    const pool = new PeerPool() as any
    const p = new SnapProtocol({ config, chain })
    const fetcher = new ByteCodeFetcher({
      config,
      pool,
      trie: new Trie({ useKeyHashing: false }),
      hashes: [],
    })

    const task = {
      hashes: [
        hexToBytes('28ec5c6e71bc4243030bc6aa069616b4497c150c883c019dee059279f0593cd8'),
        hexToBytes('418df730969850c4f5c10d09ca929d018ee4c5d71243aa7440560e2265c37aab'),
        hexToBytes('01b45b4d94f26e3f7a84ea31f7338c0f621d3f3ee38e439611a0954da7e2d728'),
        hexToBytes('6bd103c66d7d0908a75ae23d5f6de62865be2784408cf07906eaffe515616212'),
        hexToBytes('0c9d7b40fa7bb308c9b029f7b2840bc1071760c55cdf136b08f0f81ace379399'),
      ],
    }
    const resData = RLP.decode(hexToBytes(_byteCodesRLP)) as unknown
    const res = p.decode(p.messages.filter((message) => message.name === 'ByteCodes')[0], resData)
    const { reqId, codes } = res
    const mockedGetByteCodes = td.func<any>()
    td.when(mockedGetByteCodes(td.matchers.anything())).thenReturn({
      reqId,
      codes,
    })
    const peer = {
      snap: { getByteCodes: mockedGetByteCodes },
      id: 'random',
      address: 'random',
    }
    const job = { peer, task }
    const results = await fetcher.request(job as any)
    td.verify(
      job.peer.snap.getByteCodes({
        hashes: task.hashes,
        bytes: BigInt(50000),
      })
    )
    t.ok(results?.completed === true, 'response processed and matched properly')
    t.equal((results![0] as any).size, 5, 'matched code in the response')

    try {
      await fetcher.store(results! as any)
      t.pass('fetcher stored results successfully')
    } catch (e) {
      t.fail(`fetcher failed to store results, Error: ${(e as Error).message}`)
    }

    t.end()
  })

  t.test('should find a fetchable peer', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const fetcher = new ByteCodeFetcher({
      config,
      pool,
      trie: new Trie({ useKeyHashing: false }),
      hashes: [utf8ToBytes('')],
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
