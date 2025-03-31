import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { Chain, type ChainHeaders } from '../../src/blockchain/index.ts'
import { Config } from '../../src/config.ts'
import { Synchronizer } from '../../src/sync/sync.ts'
import { Event } from '../../src/types.ts'

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

class PeerPool {
  open() {}
  close() {}
}
PeerPool.prototype.open = td.func<any>()
PeerPool.prototype.close = td.func<any>()
describe('[Synchronizer]', async () => {
  it('should reset td', () => {
    td.reset()
  })
})

describe('should sync', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  config.syncTargetHeight = BigInt(1)
  const pool = new PeerPool() as any
  const chain = await Chain.create({ config })
  const sync = new SynchronizerTest({ config, pool, chain })
  //@ts-expect-error -- Manually overwriting with function for testing
  sync.sync = td.func()
  td.when(sync.sync()).thenResolve(true)
  config.events.on(Event.SYNC_SYNCHRONIZED, async () => {
    it('should sync', async () => {
      assert.isTrue(true, 'synchronized')
      await sync.stop()
      assert.isFalse(sync.running, 'stopped')
      await sync.close()
      await chain.close()
    })
  })
  void sync.start()
  sync['chain']['_headers'] = {
    latest: { hash: () => new Uint8Array(0), number: BigInt(1) },
    td: BigInt(0),
    height: BigInt(1),
  } as ChainHeaders
  config.events.emit(Event.CHAIN_UPDATED)

  // test getting out of sync
  // @ts-expect-error -- Manually overwriting read-only property for testing
  config.syncedStateRemovalPeriod = 0
  config.updateSynchronizedState()
  it('should fall out of sync', async () => {
    assert.equal(config.synchronized, false, 'should fall out of sync')
  })
})
