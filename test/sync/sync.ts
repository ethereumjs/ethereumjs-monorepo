import tape from 'tape-catch'
const td = require('testdouble')
import { EventEmitter } from 'events'
import { defaultLogger } from '../../lib/logging'
defaultLogger.silent = true

tape('[Synchronizer]', (t) => {
  class PeerPool extends EventEmitter {}
  td.replace('../../lib/net/peerpool', PeerPool)
  // const Synchronizer = require('../../lib/sync/sync')
  //
  // t.test('should sync', async (t) => {
  //   const pool = new PeerPool()
  //   const sync = new Synchronizer({pool})
  //   sync.fetch = td.func()
  //   td.when(sync.fetch(2)).thenResolve(2)
  //   sync.on('synchronized', info => {
  //     t.equals(info.count, 2, 'synchronized')
  //     t.end()
  //   })
  //   sync.sync(2)
  // })
  //
  // t.test('should stop', async (t) => {
  //   const pool = new PeerPool()
  //   const sync = new Synchronizer({pool})
  //   sync.fetch = () => {
  //     return new Promise(resolve => {
  //       setTimeout(() => {
  //         resolve(sync.syncing ? 2 : 1)
  //       }, 100)
  //     })
  //   }
  //   sync.on('synchronized', info => {
  //     t.equals(info.count, 1, 'synchronized')
  //     t.end()
  //   })
  //   sync.sync(2)
  //   setTimeout(() => sync.stop(), 50)
  // })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
