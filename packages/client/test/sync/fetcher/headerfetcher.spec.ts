import { EventEmitter } from 'events'
import tape from 'tape-catch'
import td from 'testdouble'
import { Config } from '../../../lib/config'
import { BN } from 'ethereumjs-util'

tape('[HeaderFetcher]', async (t) => {
  class PeerPool extends EventEmitter {
    idle() {}
    ban() {}
  }
  PeerPool.prototype.idle = td.func<any>()
  PeerPool.prototype.ban = td.func<any>()
  td.replace('../../lib/net/peerpool', { PeerPool })

  const { HeaderFetcher } = await import('../../../lib/sync/fetcher/headerfetcher')

  t.test('should process', (t) => {
    const config = new Config({ loglevel: 'error', transports: [] })
    const pool = new PeerPool()
    const flow = td.object()
    const fetcher = new HeaderFetcher({ config, pool, flow })
    const headers = [{ number: 1 }, { number: 2 }]
    t.deepEquals(
      //@ts-ignore
      fetcher.process({ task: { count: 2 }, peer: 'peer0' }, { headers, bv: new BN(1) }),
      headers,
      'got results'
    )
    //@ts-ignore
    t.notOk(fetcher.process({ task: { count: 2 } }, { headers: [], bv: new BN(1) }), 'bad results')
    td.verify((fetcher as any).flow.handleReply('peer0', 1))
    t.end()
  })

  t.test('should find a fetchable peer', async (t) => {
    const config = new Config({ loglevel: 'error', transports: [] })
    const pool = new PeerPool()
    const fetcher = new HeaderFetcher({ config, pool })
    td.when((fetcher as any).pool.idle(td.matchers.anything())).thenReturn('peer0')
    //@ts-ignore
    t.equals(fetcher.peer(undefined), 'peer0', 'found peer')
    t.end()
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
