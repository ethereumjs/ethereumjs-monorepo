import { RLP } from '@ethereumjs/rlp'
import { hexToBytes, utf8ToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'
import * as td from 'testdouble'

import { Chain } from '../../../src/blockchain'
import { Config } from '../../../src/config'
import { SnapProtocol } from '../../../src/net/protocol'
import { wait } from '../../integration/util'

import { _accountRangeRLP } from './accountfetcher.spec'

const _storageRangesRLP =
  'f83e0bf83af838f7a0290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5639594053cd080a26cb03d5e6d2956cebb31c56e7660cac0'

tape('[StorageFetcher]', async (t) => {
  class PeerPool {
    idle() {}
    ban() {}
  }
  PeerPool.prototype.idle = td.func<any>()
  PeerPool.prototype.ban = td.func<any>()

  const { StorageFetcher } = await import('../../../src/sync/fetcher/storagefetcher')

  t.test('should start/stop', async (t) => {
    const config = new Config({ maxPerRequest: 5, transports: [] })
    const pool = new PeerPool() as any
    const fetcher = new StorageFetcher({
      config,
      pool,
      root: hexToBytes('e794e45a596856bcd5412788f46752a559a4aa89fe556ab26a8c2cf0fc24cb5e'),
      storageRequests: [
        {
          accountHash: hexToBytes(
            '352a47fc6863b89a6b51890ef3c1550d560886c027141d2058ba1e2d4c66d99a'
          ),
          storageRoot: hexToBytes(
            '556a482068355939c95a3412bdb21213a301483edb1b64402fb66ac9f3583599'
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
        accountHash: hexToBytes('e9a5016cb1a53dbc750d06e725514ac164231d71853cafdcbff42f5adb6ca6f1'),
        storageRoot: hexToBytes('69522138e4770e642ec8d7bd5e2b71a23fb732bb447cd4faf838b45cfe3b2a92'),
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
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const fetcher = new StorageFetcher({
      config,
      pool,
      root: utf8ToBytes(''),
      first: BigInt(1),
      count: BigInt(10),
    })
    const fullResult: any = [
      [
        [{ hash: utf8ToBytes(''), body: utf8ToBytes('') }],
        [{ hash: utf8ToBytes(''), body: utf8ToBytes('') }],
      ],
    ]
    const StorageDataResponse: any = [
      [
        [{ hash: utf8ToBytes(''), body: utf8ToBytes('') }],
        [{ hash: utf8ToBytes(''), body: utf8ToBytes('') }],
      ],
    ]
    StorageDataResponse.completed = true
    const task = {
      storageRequests: [
        {
          accountHash: hexToBytes(
            'e9a5016cb1a53dbc750d06e725514ac164231d71853cafdcbff42f5adb6ca6f1'
          ),
          storageRoot: hexToBytes(
            '69522138e4770e642ec8d7bd5e2b71a23fb732bb447cd4faf838b45cfe3b2a92'
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
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const fetcher = new StorageFetcher({
      config,
      pool,
      root: utf8ToBytes(''),
    })
    const StorageDataResponse: any = [
      [
        [{ hash: utf8ToBytes(''), body: utf8ToBytes('') }],
        [{ hash: utf8ToBytes(''), body: utf8ToBytes('') }],
      ],
    ]
    StorageDataResponse.completed = false
    const task = {
      storageRequests: [
        {
          accountHash: hexToBytes(
            'e9a5016cb1a53dbc750d06e725514ac164231d71853cafdcbff42f5adb6ca6f1'
          ),
          storageRoot: hexToBytes(
            '69522138e4770e642ec8d7bd5e2b71a23fb732bb447cd4faf838b45cfe3b2a92'
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
        [{ hash: utf8ToBytes(''), body: utf8ToBytes('') }],
        [{ hash: utf8ToBytes(''), body: utf8ToBytes('') }],
        [{ hash: utf8ToBytes(''), body: utf8ToBytes('') }],
      ],
    ]
    remainingStorageData.completed = true
    results = fetcher.process(job as any, remainingStorageData)
    t.equal((results as any)[0].length, 5, 'Should return full results')
    t.end()
  })

  t.test('should request correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const pool = new PeerPool() as any
    const p = new SnapProtocol({ config, chain })
    const fetcher = new StorageFetcher({
      config,
      pool,
      root: utf8ToBytes(''),
    })
    const partialResult: any = [
      [
        [{ hash: utf8ToBytes(''), body: utf8ToBytes('') }],
        [{ hash: utf8ToBytes(''), body: utf8ToBytes('') }],
      ],
    ]

    const task = {
      storageRequests: [
        {
          accountHash: hexToBytes(
            'e9a5016cb1a53dbc750d06e725514ac164231d71853cafdcbff42f5adb6ca6f1'
          ),
          storageRoot: hexToBytes(
            '69522138e4770e642ec8d7bd5e2b71a23fb732bb447cd4faf838b45cfe3b2a92'
          ),
          first: BigInt(0),
          count: BigInt(2) ** BigInt(256) - BigInt(1),
        },
      ],
    }
    const resData = RLP.decode(hexToBytes(_storageRangesRLP)) as unknown
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
        root: utf8ToBytes(''),
        accounts: [hexToBytes('e9a5016cb1a53dbc750d06e725514ac164231d71853cafdcbff42f5adb6ca6f1')],
        origin: td.matchers.anything(),
        limit: td.matchers.anything(),
        bytes: BigInt(50000),
      })
    )
    t.end()
  })

  t.test('should verify proof correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const pool = new PeerPool() as any
    const p = new SnapProtocol({ config, chain })
    const fetcher = new StorageFetcher({
      config,
      pool,
      root: utf8ToBytes(''),
    })
    const partialResult: any = [
      [
        [{ hash: utf8ToBytes(''), body: utf8ToBytes('') }],
        [{ hash: utf8ToBytes(''), body: utf8ToBytes('') }],
      ],
    ]

    const task = {
      storageRequests: [
        {
          accountHash: hexToBytes(
            '00009e5969eba9656d7e4dad5b0596241deb87c29bbab71c23b602c2b88a7276'
          ),
          storageRoot: hexToBytes(
            '4431bd7d69241190bb930b74485c1e31ff75552f67d758d0b6612e7bd9226121'
          ),
          first: BigInt(0),
          count: BigInt(2) ** BigInt(256) - BigInt(1),
        },
      ],
    }
    const resData = RLP.decode(hexToBytes(_storageRangesRLP)) as unknown
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
    let results = await fetcher.request(job as any)
    t.ok(results !== undefined, 'Proof verification is completed without errors')

    results!.completed = true
    results = fetcher.process(job as any, results!)
    t.ok(results !== undefined, 'Response should be processed correctly')
    t.equal(results![0].length, 3, '3 results should be there with dummy partials')
    // remove out the dummy partials
    results![0].splice(0, 2)
    t.equal(results![0].length, 1, 'valid slot in results')

    try {
      await fetcher.store(results! as any)
      t.pass('fetcher stored results successfully')
    } catch (e) {
      t.fail(`fetcher failed to store results, Error: ${(e as Error).message}`)
    }

    // We have not been able to captured valid storage proof yet but we can try invalid
    // proof for coverage. A valid proof test can be added later
    const accResData = RLP.decode(hexToBytes(_accountRangeRLP)) as unknown
    const { proof: proofInvalid } = p.decode(
      p.messages.filter((message) => message.name === 'AccountRange')[0],
      accResData
    )
    const dummyStorageRoot = hexToBytes(
      '39ed8daab7679c0b1b7cf3667c50108185d4d9d1431c24a1c35f696a58277f8f'
    )
    const dummyOrigin = new Uint8Array(32)
    try {
      await fetcher['verifyRangeProof'](dummyStorageRoot, dummyOrigin, {
        slots,
        proof: proofInvalid,
      })
      t.fail('verifyRangeProof should have failed for an proofInvalid')
    } catch (e) {
      t.pass(`verifyRangeProof correctly failed on invalid proof, Error: ${(e as Error).message}`)
    }

    // send end of range input to store
    ;(fetcher as any)['destroyWhenDone'] = false
    await fetcher.store([Object.create(null)] as any)
    t.ok(fetcher['destroyWhenDone'] === true, 'should have marked fetcher to close')

    t.end()
  })

  t.test('should find a fetchable peer', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const fetcher = new StorageFetcher({
      config,
      pool,
      root: utf8ToBytes(''),
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
