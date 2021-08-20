import { EventEmitter } from 'events'
import tape from 'tape-catch'
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
  best() {
    return undefined
  }
}

tape('[Synchronizer]', async (t) => {
  class PeerPool extends EventEmitter {
    open() {}
    close() {}
  }
  PeerPool.prototype.open = td.func<any>()
  PeerPool.prototype.close = td.func<any>()
  td.replace('../../lib/net/peerpool', { PeerPool })

  t.test('should sync', async (t) => {
    const config = new Config({ loglevel: 'error', transports: [] })
    const pool = new PeerPool() as any
    const chain = new Chain({ config })
    const sync = new SynchronizerTest({ config, pool, chain })
    ;(sync as any).sync = td.func()
    td.when((sync as any).sync()).thenResolve(true)
    config.events.on(Event.SYNC_SYNCHRONIZED, async () => {
      t.ok('synchronized')
      await sync.stop()
      t.notOk((sync as any).running, 'stopped')
      t.end()
    })
    sync.syncTargetHeight = new BN(1)
    setTimeout(() => {
      // eslint-disable-next-line no-extra-semi
      ;(sync as any).chain._headers = {
        latest: { hash: () => Buffer.from([]) },
        td: new BN(0),
        height: new BN(1),
      }
      config.events.emit(Event.CHAIN_UPDATED)
    }, 100)
    await sync.start()
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
