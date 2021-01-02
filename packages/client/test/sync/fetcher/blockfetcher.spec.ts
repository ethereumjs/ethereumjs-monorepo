import { EventEmitter } from 'events'
import tape from 'tape-catch'
import td from 'testdouble'
import { BN } from 'ethereumjs-util'
import { Config } from '../../../lib/config'
import { Chain } from '../../../lib/blockchain/chain'

async function wait(delay?: number) {
  await new Promise((resolve) => setTimeout(resolve, delay ?? 10))
}

tape('[BlockFetcher]', async (t) => {
  class PeerPool extends EventEmitter {
    idle() {}
    ban() {}
  }
  PeerPool.prototype.idle = td.func<any>()
  PeerPool.prototype.ban = td.func<any>()
  td.replace('../../lib/net/peerpool', { PeerPool })

  const { BlockFetcher } = await import('../../../lib/sync/fetcher/blockfetcher')

  t.test('should start/stop', async (t) => {
    const config = new Config({ loglevel: 'error', transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const fetcher = new BlockFetcher({
      config,
      pool,
      chain,
      first: new BN(1),
      count: new BN(10),
      maxPerRequest: 5,
      timeout: 5,
    })
    fetcher.next = () => false
    t.notOk((fetcher as any).running, 'not started')
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetcher.fetch()
    t.equals((fetcher as any).in.size(), 2, 'added 2 tasks')
    await wait()
    t.ok((fetcher as any).running, 'started')
    fetcher.destroy()
    await wait()
    t.notOk((fetcher as any).running, 'stopped')
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
    const blocks = [{ header: { number: 1 } }, { header: { number: 2 } }]
    //@ts-ignore
    t.deepEquals(fetcher.process({ task: { count: 2 } }, blocks), blocks, 'got results')
    //@ts-ignore
    t.notOk(fetcher.process({ task: { count: 2 } }, { blocks: [] }), 'bad results')
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
