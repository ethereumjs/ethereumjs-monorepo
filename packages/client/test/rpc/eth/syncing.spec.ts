import tape from 'tape-catch'
import td from 'testdouble'
import { Config } from '../../../lib/config'
import { PeerPool } from '../../../lib/net/peerpool'
import { params, baseRequest, createClient, createManager, startRPC } from '../helpers'
import { EventEmitter } from 'events'
import Blockchain from '@ethereumjs/blockchain'
import { LightEthereumService } from '../../../lib/service'

const method = 'eth_syncing'

tape(`${method} should return false when chain is synced`, async (t) => {
  const config = new Config({ transports: [], loglevel: 'error' })
  class FullEthereumService extends EventEmitter {
    open() {}
    start() {}
    stop() {}
    config = config
    pool = new PeerPool({ config })
  }
  FullEthereumService.prototype.open = td.func<any>()
  FullEthereumService.prototype.start = td.func<any>()
  FullEthereumService.prototype.stop = td.func<any>()
  td.replace('../../../lib/service', { FullEthereumService })
  td.when(FullEthereumService.prototype.open()).thenResolve()
  td.when(FullEthereumService.prototype.start()).thenResolve()
  td.when(FullEthereumService.prototype.stop()).thenResolve()

  class Server extends EventEmitter {
    open() {}
    start() {}
    stop() {}
    bootstrap() {}
  }
  Server.prototype.open = td.func<any>()
  Server.prototype.start = td.func<any>()
  Server.prototype.stop = td.func<any>()
  Server.prototype.bootstrap = td.func<any>()
  td.replace('../../../lib/net/server/server', { Server })
  td.when(Server.prototype.start()).thenResolve()
  td.when(Server.prototype.stop()).thenResolve()
  td.when(Server.prototype.bootstrap()).thenResolve()

  const { default: EthereumClient } = await import('../../../lib/client')

  t.test('should initialize correctly', async (t) => {
    const blockchain = await Blockchain.create()

    const client = createClient({ blockchain })
    const manager = createManager(client)
    const server = startRPC(manager.getMethods())

    const service = client.services.find((s) => s.name === 'eth') as LightEthereumService

    console.log('Synchronized? ', client.synchronized)
    service.synchronizer.emit('synchronized')

    const req = params(method, [])
    console.log(req)
    const expectRes = (res: any) => {
      const msg = 'should return false'
      t.equal(res.body.result, false, msg)
    }
    baseRequest(t, server, req, 200, expectRes)
  })
})

tape(`${method}: returns object with sync status when chain is not synced`, (t) => {
  const manager = createManager(createClient())
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const msg = 'should result object with sync status'
    t.equal(res.body.result, 'TODO', msg)
  }
  baseRequest(t, server, req, 200, expectRes)
})
