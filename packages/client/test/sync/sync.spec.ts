import tape from 'tape'
import td from 'testdouble'
import { BN } from 'ethereumjs-util'
import { Config } from '../../lib/config'
import { Chain } from '../../lib/blockchain'
import { Synchronizer } from '../../lib/sync/sync'
import { Event } from '../../lib/types'

class SynchronizerTest extends Synchronizer {
  async syncWithPeer() {
    return true
  }
  async sync() {
    return false
  }
  async best() {
    return undefined
  }
}

tape('[Synchronizer]', async (t) => {
  class PeerPool {
    open() {}
    close() {}
  }
  PeerPool.prototype.open = td.func<any>()
  PeerPool.prototype.close = td.func<any>()

  t.test('should sync', async (t) => {
    const config = new Config({ transports: [] })
    config.syncTargetHeight = new BN(1)
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const sync = new SynchronizerTest({ config, pool, chain })
    ;(sync as any).sync = td.func()
    td.when((sync as any).sync()).thenResolve(true)
    config.events.on(Event.SYNC_SYNCHRONIZED, async () => {
      t.ok('synchronized', 'synchronized')
      await sync.stop()
      t.notOk((sync as any).running, 'stopped')
      await sync.close()
      await chain.close()
      t.end()
    })
    void sync.start()
    ;(sync as any).chain._headers = {
      latest: { hash: () => Buffer.from([]) },
      td: new BN(0),
      height: new BN(1),
    }
    config.events.emit(Event.CHAIN_UPDATED)
    await new Promise(() => {}) // resolves once t.end() is called
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
