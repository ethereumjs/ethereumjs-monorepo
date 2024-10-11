import { RLP } from '@ethereumjs/rlp'
import { hexToBytes } from '@ethereumjs/util'
import { utf8ToBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it, vi } from 'vitest'

import { Chain } from '../../../src/blockchain/index.js'
import { Config } from '../../../src/config.js'
import { SnapProtocol } from '../../../src/net/protocol/index.js'
import { wait } from '../../integration/util.js'

import { _accountRangeRLP } from './accountfetcher.spec.js'

const _byteCodesRLP =
  '0xf89e1af89b9e60806040526004361061003f5760003560e01c806301ffc9a714610044579e60806040526004361061003f5760003560e01c806301ffc9a714610044589e60806040526004361061003f5760003560e01c806301ffc9a714610044599e60806040526004361061003f5760003560e01c806301ffc9a714610044609e60806040526004361061003f5760003560e01c806301ffc9a71461004461'

describe('[ByteCodeFetcher]', async () => {
  class PeerPool {
    idle() {}
    ban() {}
  }
  PeerPool.prototype.idle = vi.fn()
  PeerPool.prototype.ban = vi.fn()

  const { ByteCodeFetcher } = await import('../../../src/sync/fetcher/bytecodefetcher.js')

  it('should start/stop', async () => {
    const config = new Config({ maxPerRequest: 5 })
    const pool = new PeerPool() as any
    const fetcher = new ByteCodeFetcher({
      config,
      pool,
      hashes: [hexToBytes('0x2034f79e0e33b0ae6bef948532021baceb116adf2616478703bec6b17329f1cc')],
    })
    fetcher.next = () => false
    assert.notOk((fetcher as any).running, 'not started')
    assert.equal((fetcher as any).in.length, 0, 'No jobs have yet been added')
    assert.equal((fetcher as any).hashes.length, 1, 'one codehash have been added')
    fetcher.enqueueByByteCodeRequestList([
      hexToBytes('0x2034f79e0e33b0ae6bef948532021baceb116adf2616478703bec6b17329f1cc'),
    ])
    assert.equal((fetcher as any).in.length, 1, 'A new task has been queued')
    const job = (fetcher as any).in.peek()
    assert.equal(job!.task.hashes.length, 2, 'two storageRequests are added to job')

    void fetcher.fetch()
    await wait(100)
    assert.ok((fetcher as any).running, 'started')
    assert.ok(fetcher.write() === false, 'fetcher should not setup a new write pipe')
    fetcher.destroy()
    await wait(100)
    assert.notOk((fetcher as any).running, 'stopped')
  })

  it('should process', () => {
    const config = new Config({})
    const pool = new PeerPool() as any
    const fetcher = new ByteCodeFetcher({
      config,
      pool,
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
    assert.deepEqual(
      (fetcher.process(job, ByteCodeResponse) as any)[0],
      fullResult[0],
      'got results',
    )
    assert.notOk(fetcher.process({} as any, { ByteCodeResponse: [] } as any), 'bad results')
  })

  it('should adopt correctly', () => {
    const config = new Config({})
    const pool = new PeerPool() as any
    const fetcher = new ByteCodeFetcher({
      config,
      pool,
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
    assert.equal((fetcher as any).in.length, 1, 'Fetcher should still have same job')
    assert.equal(job?.partialResult.length, 2, 'Should have two partial results')
    assert.equal(results, undefined, 'Process should not return full results yet')
    const remainingBytesCodeData: any = [utf8ToBytes(''), utf8ToBytes(''), utf8ToBytes('')]
    remainingBytesCodeData.completed = true
    results = fetcher.process(job as any, remainingBytesCodeData)
    assert.equal((results as any).length, 5, 'Should return full results')
  })

  it('should request correctly', async () => {
    const config = new Config({})
    const chain = await Chain.create({ config })
    const pool = new PeerPool() as any
    const p = new SnapProtocol({ config, chain })
    const fetcher = new ByteCodeFetcher({
      config,
      pool,
      hashes: [],
    })

    const task = {
      hashes: [
        hexToBytes('0x28ec5c6e71bc4243030bc6aa069616b4497c150c883c019dee059279f0593cd8'),
        hexToBytes('0x418df730969850c4f5c10d09ca929d018ee4c5d71243aa7440560e2265c37aab'),
        hexToBytes('0x01b45b4d94f26e3f7a84ea31f7338c0f621d3f3ee38e439611a0954da7e2d728'),
        hexToBytes('0x6bd103c66d7d0908a75ae23d5f6de62865be2784408cf07906eaffe515616212'),
        hexToBytes('0x0c9d7b40fa7bb308c9b029f7b2840bc1071760c55cdf136b08f0f81ace379399'),
      ],
    }
    const resData = RLP.decode(hexToBytes(_byteCodesRLP)) as unknown
    const res = p.decode(p.messages.filter((message) => message.name === 'ByteCodes')[0], resData)
    const { reqId, codes } = res
    const mockedGetByteCodes = vi.fn((input) => {
      const expected = {
        hashes: task.hashes,
        bytes: BigInt(50000),
      }
      assert.deepEqual(input, expected)

      return { reqId, codes }
    })
    const peer = {
      snap: { getByteCodes: mockedGetByteCodes },
      id: 'random',
      address: 'random',
      latest: vi.fn(),
    }
    const job = { peer, task }
    const results = await fetcher.request(job as any)
    assert.ok(results?.completed === true, 'response processed and matched properly')
    assert.equal((results![0] as any).size, 5, 'matched code in the response')

    try {
      await fetcher.store(results! as any)
      assert.ok(true, 'fetcher stored results successfully')
    } catch (e) {
      assert.fail(`fetcher failed to store results, Error: ${(e as Error).message}`)
    }
  })

  it('should find a fetchable peer', async () => {
    const config = new Config({})
    const pool = new PeerPool() as any
    pool.idle = vi.fn(() => {
      return 'peer0'
    })
    const fetcher = new ByteCodeFetcher({
      config,
      pool,
      hashes: [utf8ToBytes('')],
    })
    assert.equal(fetcher.peer(), 'peer0' as any, 'found peer')
  })
})
