import { RLP } from '@ethereumjs/rlp'
import * as tape from 'tape'
import * as td from 'testdouble'

import { Chain } from '../../../lib/blockchain'
import { Config } from '../../../lib/config'
import { SnapProtocol } from '../../../lib/net/protocol'
import { wait } from '../../integration/util'

const _storageRangesRLP =
  'f83e0bf83af838f7a0290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5639594053cd080a26cb03d5e6d2956cebb31c56e7660cac0'

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
      root: Buffer.from('e794e45a596856bcd5412788f46752a559a4aa89fe556ab26a8c2cf0fc24cb5e', 'hex'),
      storageRequests: [
        {
          accountHash: Buffer.from(
            '352a47fc6863b89a6b51890ef3c1550d560886c027141d2058ba1e2d4c66d99a',
            'hex'
          ),
          storageRoot: Buffer.from(
            '556a482068355939c95a3412bdb21213a301483edb1b64402fb66ac9f3583599',
            'hex'
          ),
          first: BigInt(0),
          count: BigInt(2) ** BigInt(256) - BigInt(1),
        },
      ],
    })
    fetcher.next = () => false
    t.notOk((fetcher as any).running, 'not started')
    t.equals((fetcher as any).in.length, 0, 'No jobs have yet been added')
    t.equal((fetcher as any).storageRequests.length, 1, 'one storageRequests have been added')
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
    const job = (fetcher as any).in.peek()
    t.equal(job!.task.storageRequests.length, 2, 'two storageRequests are added to job')

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

  t.test('should request correctly', async (t) => {
    const config = new Config({ transports: [] })
    const chain = await Chain.create({ config })
    const pool = new PeerPool() as any
    const p = new SnapProtocol({ config, chain })
    const fetcher = new StorageFetcher({
      config,
      pool,
      root: Buffer.from(''),
    })
    const partialResult: any = [
      [
        [{ hash: Buffer.from(''), body: Buffer.from('') }],
        [{ hash: Buffer.from(''), body: Buffer.from('') }],
      ],
    ]

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
    const resData = RLP.decode(Buffer.from(_storageRangesRLP, 'hex')) as unknown
    const res = p.decode(
      p.messages.filter((message) => message.name === 'StorageRanges')[0],
      resData
    )
    const { reqId, slots, proof } = res
    const mockedGetStorageRanges = td.func<any>()
    td.when(mockedGetStorageRanges(td.matchers.anything())).thenReturn({
      reqId,
      slots,
      proof,
    })
    const peer = {
      snap: { getStorageRanges: mockedGetStorageRanges },
      id: 'random',
      address: 'random',
    }
    const job = { peer, partialResult, task }
    await fetcher.request(job as any)
    td.verify(
      job.peer.snap.getStorageRanges({
        root: Buffer.from(''),
        accounts: [
          Buffer.from('e9a5016cb1a53dbc750d06e725514ac164231d71853cafdcbff42f5adb6ca6f1', 'hex'),
        ],
        origin: td.matchers.anything(),
        limit: td.matchers.anything(),
        bytes: BigInt(50000),
      })
    )
    t.end()
  })

  t.test('should verify proof correctly', async (t) => {
    const config = new Config({ transports: [] })
    const chain = await Chain.create({ config })
    const pool = new PeerPool() as any
    const p = new SnapProtocol({ config, chain })
    const fetcher = new StorageFetcher({
      config,
      pool,
      root: Buffer.from(''),
    })
    const partialResult: any = [
      [
        [{ hash: Buffer.from(''), body: Buffer.from('') }],
        [{ hash: Buffer.from(''), body: Buffer.from('') }],
      ],
    ]

    const task = {
      storageRequests: [
        {
          accountHash: Buffer.from(
            '00009e5969eba9656d7e4dad5b0596241deb87c29bbab71c23b602c2b88a7276',
            'hex'
          ),
          storageRoot: Buffer.from(
            '4431bd7d69241190bb930b74485c1e31ff75552f67d758d0b6612e7bd9226121',
            'hex'
          ),
          first: BigInt(0),
          count: BigInt(2) ** BigInt(256) - BigInt(1),
        },
      ],
    }
    const resData = RLP.decode(Buffer.from(_storageRangesRLP, 'hex')) as unknown
    const res = p.decode(
      p.messages.filter((message) => message.name === 'StorageRanges')[0],
      resData
    )
    const { reqId, slots, proof } = res
    const mockedGetStorageRanges = td.func<any>()
    td.when(mockedGetStorageRanges(td.matchers.anything())).thenReturn({
      reqId,
      slots,
      proof,
    })
    const peer = {
      snap: { getStorageRanges: mockedGetStorageRanges },
      id: 'random',
      address: 'random',
    }
    const job = { peer, partialResult, task }
    t.ok(await fetcher.request(job as any), 'Proof verification is completed without errors')
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
