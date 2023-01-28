import * as tape from 'tape'
import * as td from 'testdouble'

import { Config } from '../../../lib/config'
import { wait } from '../../integration/util'

import { RLP } from '@ethereumjs/rlp'
import { Chain } from '../../../lib/blockchain'
import { SnapProtocol } from '../../../lib/net/protocol'

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

  t.test('should request correctly', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool() as any
    const fetcher = new AccountFetcher({
      config,
      pool,
      root: Buffer.from(''),
      first: BigInt(1),
      count: BigInt(3),
    })
    const partialResult: any = [
      [
        {
          hash: Buffer.from(''),
          body: [Buffer.from(''), Buffer.from(''), Buffer.from(''), Buffer.from('')],
        },
        {
          hash: Buffer.from(''),
          body: [Buffer.from(''), Buffer.from(''), Buffer.from(''), Buffer.from('')],
        },
      ],
    ]

    const task = { count: 3, first: BigInt(1) }
    const peer = {
      snap: { getAccountRange: td.func<any>() },
      id: 'random',
      address: 'random',
    }
    const job = { peer, partialResult, task }
    await fetcher.request(job as any)
    td.verify(
      job.peer.snap.getAccountRange({
        root: Buffer.from(''),
        origin: td.matchers.anything(),
        limit: td.matchers.anything(),
        bytes: BigInt(50000),
      })
    )
    t.end()
  })

  t.test('should verify proof correctly', async (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new SnapProtocol({ config, chain })
    const pool = new PeerPool() as any
    const fetcher = new AccountFetcher({
      config,
      pool,
      root: Buffer.from(''),
      first: BigInt(1),
      count: BigInt(3),
    })
    const task = { count: 3, first: BigInt(1) }
    const resData = RLP.decode(Buffer.from(accountRangeRLP, 'hex')) as unknown
    const { accounts, proof } = p.decode(
      p.messages.filter((message) => message.name === 'AccountRange')[0],
      resData
    )
    const mockedGetAccountRange = td.func<any>()
    td.when(mockedGetAccountRange()).thenReturn({
      reqId: BigInt(1),
      accounts: accounts,
      proof: proof,
    })
    const peer = {
      snap: { getAccountRange: mockedGetAccountRange },
      id: 'random',
      address: 'random',
    }
    const job = { peer, task }
    t.equals(
      await fetcher.request(job as any),
      undefined,
      'No errors with proof verification in request function'
    )
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

const accountRangeRLP =
  'f9097101f87ce6a000009b82f07b6d086a2f1574482af15472d565ea145ff42edfa412a1bd632625c411808080e6a00001b989dc49b9df17e95a9e1e50870aabf88e21b9d4cd4811b5507dad53517cc401808080eda00001ea42267f6ff20ada8604d602387163b25e87102bf3d214d52ceec8dcecefcb01870360051c8960008080f908efb90214f90211a0c1278c80295a5fd765db6f3ddb5848683d8451ce795e45cb45e58c2bbea38b23a09058fbfd1194da5ea2c32fe6621c87c311a521f3ade5a6fcdfb2ce6c77cc9457a0ca279fd327589e0862fe3108b5ded8d1591af95c21e49de44a7c530da86d1d5ba0060137d87fe07e9e74d2ced2631f31ff0f2e1a77ec8e55a0e3c0d95049aa3a81a0c7153c1a920cf18b4ddf2069572c60429a82fac1d617c7186eb5f2f6c67bb3eea008cb3728001b9e04fcf14818826a5c379cccc3f45df0b76c2a86bb7588354462a09bec68f4684acd7c0b81b49b6705cb90a21390046e5233eb8a3eceb362d7e699a0954b9259abd98bb1bbf3caef798f9b2c67394670c926900ccf5751253ed4f87aa003beafd9e8e865d5610de7f137d404814cf6c4a12085dae8892266de62ef660ba06236e72b0960753708738bacb7cb4f4ff1c8b2e915e9a18599c75603dda597eea0b063b409a64860fc0d300eba3d772b30680881d938e6ebaabd80f82a753b4414a0846bff10a2dd3084bd983544aaeaf01770867aa572162869a6fe77609bb36dbfa0e467d24298c2eabe85e2c94b8c923a1a514c12a5c9b8e2181216d8317e010693a0bad67c670ec6fd973215ff412f58f3f54a9018866b04869002d3e6e4208f4c2ea086fe0af717dc7e5c127ec7396e1d0e16fad054109942cb0a8dc4348ebb82398da011bb9f0056d3a9e901b99c73d2d3e76215b47c333365d8b8a73e1acade5bda4b80b90214f90211a0b00ba2f0bfa01de02b767dcdf38c7f5691e5c340def6df806741a59d85bd2a13a05658dbc276709dbf6bf2b28872227646841f6f0d0fe1da001a0d08725b9a060ca09c950f1c934b5298bdebd8e65a26bf8f6edb269cd3fcaaf37915695aa30e870fa05f46b447501b5831596af8212cdb5f5d00fa3c70e9eaa13f5b3731d4a2a1bf5ba0d247a7b93cca2a31070f508fb093576145e0f9a83ccff8fa2d6bf2ff42abd78ca0be5a7c7a50fe9ff7e9c6c0e1a8a960721fa3ca81dad009b3f74da76ac905c1eda0713fbc2d738d788f9de1e3b9c21cb51a8ef8814c0b2c650e93edfd442125fdb5a04174b732f2b7b079ad9941c2a445d2c23c604c5d448b9200c9bc24332f0d018ba04bc37f9ba4124a538df315d7d07718f30fd9e715cbf0837a89a4ea0e8db2852ea0a948b1640a4cfe054be12c3d92f4c7a8c2b93e87f5cbf0df9f6ebe89160b6ccaa0bf660df9cd53c9ce329942f8a6ce5e276fe29fde33e4ed94a73ffd11d116ac20a02051566c8da26729f53eaa1c08b8fb80d955a8dce41b52ea1a80d19604225e79a0d7977ed0bc385e1554e9fdc7fc1fa5f11e1ab354edcbb2b2bbc86b3458e16bfca07e455873c9ab889267be0090716d6b81981ee744a498e5e7c7e7537b3660e09da0f4e9fee500e1d0c09356223097b8b4bdd562575cbd6c7520a791b5d1d06bcc8ca075ea32ed4754e8fa6ac42396ec52159c755319ef139a40c89135780f02d2cd3d80b90214f90211a005d5c908571626e6429a2e60c12fb0a7cbb792990237b07f0b895262dd468002a0e8832065be7f27bfc9622718b3217e764a64139809e83a4f346974d0bf6d4cb1a0884edcf8063cd210c4f055c9a65fa9ba9f3140ed7b5ffea534eb46543747312ca06939eb03dfec57d4b19633637f591f9c9eaf823bb4b881cfee6d4f2cc438de15a0b3465275b807743c9d2babcc187bccfd4d5875e3be850ba15bdb49ecb0756b33a019f64beddb99d42a6d0aa559bb742099b75a56119110e536aec1e0dc8426d4bda00b2a64b5cfd0465225a77e8d36f33a8cd2e2955dd27f17858c6bff058560073da06d29ec54698740d1b0a31fbc108f7a7f34b54fca2469a1e741a7e6d238ca3223a089b0a60705c5aabdc613843831737ab0d4924dfaa98e36d0da5c5c701b9a184fa0beb52c58a15cbc60614935c901236d604e45a6fb777c5c2a96bbdaa6c5643401a091e8e3621e73c2f97d2f8a1e6aa0502c2d39c760c8ec75d5bb74dcb8c6042b07a0919f563a2f826f3375e0171d7aaed13d5d430231bb3ab153a804dea6ff3fad48a076199370d103d86301ddcfbac8dca567b32156d50d3884cefc52c86229b9c4dfa0d37db1d1a795c0ffd9fd3dab57c98b0986529ab1f32d306cdfd5063a2371875da019c8b72759269ffff97d1b3284696b037eb984c4520d3be799b49716e77d888fa08a5777ee67d4d9592dcd388b0f0f14a02225468f9d3339dc1d9ef25fb85f30f280b90174f90171a093c39d2f8d596b9d295b60221892e54bf39c276b77f25be68195379766ac6f1aa0f67ae81c632b1fcabbf55700389ff5735666139a48fcb88b1ec49e76d89f0dcda03ff27dc7b513d1790150232542a066f377c345d94891b818098ee07539656f8f80a04d0bd2a7147dd2e8dbd0b3e1166ec5f8f38e2509c4d7647bcb4d5f88bd0c015ba08d5f743d005ba218dbda14eb3e599616dfd95de81a52271cc7068c8d7d02b954a0319a502e4ba85543f9e87b56742ffa93e6bad838f6621173c268b6a47d927c66a0042be4c968761c0bb12a1663afc013d9224cdaafd24faa13af29ec685c5a9681808080a04c058f78c59efa16cf457b01f273d9a593d9bdb7b80bdee9172e1aa94bfb56e6a0e7198822750da3bafcda0bd58bc813c190a3e220710c8bb6eef3036061234dc0a028fb2d97af7dea9285b566bbd754bd20b8cb24abb865d382ebc14e7c2994be7fa0ac77041d0371ae76a4ffb9440a3bc827660d4bd2fc535cfd95c213524e89fd908080b86af8689f209b82f07b6d086a2f1574482af15472d565ea145ff42edfa412a1bd632625b846f8441180a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470b853f8518080808080808080808080a00cd5b0af242798bc101250a06cbfbdf37aec6ddb42aa1428ea9e51440650c3d18080a0f6d819bdf6861f54f23de70f48431954d5f0e20a0372ecb1cbdbf526beafd6b88080b870f86e9e3a42267f6ff20ada8604d602387163b25e87102bf3d214d52ceec8dcecefb84df84b01870360051c896000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
