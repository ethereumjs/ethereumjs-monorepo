import tape from 'tape'
import td from 'testdouble'
import { BN } from 'ethereumjs-util'
import { Config } from '../../../lib/config'
import { Chain } from '../../../lib/blockchain/chain'
import { wait } from '../../integration/util'

tape('[BlockFetcher]', async (t) => {
  class PeerPool {
    idle() {}
    ban() {}
  }
  PeerPool.prototype.idle = td.func<any>()
  PeerPool.prototype.ban = td.func<any>()

  const { BlockFetcher } = await import('../../../lib/sync/fetcher/blockfetcher')

  t.test('should start/stop', async (t) => {
    const config = new Config({ maxPerRequest: 5, loglevel: 'error', transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const fetcher = new BlockFetcher({
      config,
      pool,
      chain,
      first: new BN(1),
      count: new BN(10),
      timeout: 5,
    })
    fetcher.next = () => false
    t.notOk((fetcher as any).running, 'not started')
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetcher.fetch()
    t.equals((fetcher as any).in.size(), 2, 'added 2 tasks')
    await wait(100)
    t.ok((fetcher as any).running, 'started')
    fetcher.destroy()
    await wait(100)
    t.notOk((fetcher as any).running, 'stopped')
    t.end()
  })

  t.test('enqueueByNumberList()', async (t) => {
    const config = new Config({ maxPerRequest: 5, loglevel: 'error', transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const fetcher = new BlockFetcher({
      config,
      pool,
      chain,
      first: new BN(1),
      count: new BN(10),
      timeout: 5,
    })
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetcher.fetch()
    t.equals((fetcher as any).in.size(), 2, 'added 2 tasks')
    await wait(100)

    let blockNumberList = [new BN(11), new BN(12)]
    let min = new BN(11)
    fetcher.enqueueByNumberList(blockNumberList, min)
    t.equals((fetcher as any).in.size(), 3, '1 new task for two subsequent block numbers')

    blockNumberList = [new BN(13), new BN(15)]
    min = new BN(13)
    fetcher.enqueueByNumberList(blockNumberList, min)
    t.equals((fetcher as any).in.size(), 5, '2 new tasks for two non-subsequent block numbers')
    fetcher.destroy()
    t.end()
  })

  t.test('should process', (t) => {
    const config = new Config({ loglevel: 'error', transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const fetcher = new BlockFetcher({
      config,
      pool,
      chain,
      first: new BN(0),
      count: new BN(0),
    })
    const blocks: any = [{ header: { number: 1 } }, { header: { number: 2 } }]
    t.deepEquals(fetcher.process({ task: { count: 2 } } as any, blocks), blocks, 'got results')
    t.notOk(fetcher.process({ task: { count: 2 } } as any, { blocks: [] } as any), 'bad results')
    t.end()
  })

  t.test('should find a fetchable peer', async (t) => {
    const config = new Config({ loglevel: 'error', transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const fetcher = new BlockFetcher({
      config,
      pool,
      chain,
      first: new BN(0),
      count: new BN(0),
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
