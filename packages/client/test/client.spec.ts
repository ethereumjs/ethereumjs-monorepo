import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { EthereumClient } from '../src/client'
import { Config } from '../src/config'
import { PeerPool } from '../src/net/peerpool'
import { RlpxServer } from '../src/net/server'

describe('[EthereumClient]', async () => {
  const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
  class FullEthereumService {
    open() {}
    start() {}
    stop() {}
    config = config
    pool = new PeerPool({ config })
  }
  FullEthereumService.prototype.open = td.func<any>()
  FullEthereumService.prototype.start = td.func<any>()
  FullEthereumService.prototype.stop = td.func<any>()
  td.replace<any>('../src/service', { FullEthereumService })
  td.when(FullEthereumService.prototype.open()).thenResolve()
  td.when(FullEthereumService.prototype.start()).thenResolve()
  td.when(FullEthereumService.prototype.stop()).thenResolve()

  class Server {
    open() {}
    start() {}
    stop() {}
    bootstrap() {}
  }
  Server.prototype.open = td.func<any>()
  Server.prototype.start = td.func<any>()
  Server.prototype.stop = td.func<any>()
  Server.prototype.bootstrap = td.func<any>()
  td.replace<any>('../src/net/server/server', { Server })
  td.when(Server.prototype.start()).thenResolve()
  td.when(Server.prototype.stop()).thenResolve()
  td.when(Server.prototype.bootstrap()).thenResolve()

  // const { EthereumClient } = await import('../src/client')

  it(
    'should initialize correctly',
    async () => {
      const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
      const client = await EthereumClient.create({ config })
      assert.ok('lightserv' in client.services[0], 'added FullEthereumService')
      assert.ok('execution' in client.services[0], 'added FullEthereumService')
      assert.ok('txPool' in client.services[0], 'added FullEthereumService')
    },
    { timeout: 30000 }
  )

  it(
    'should open',
    async () => {
      const servers = [new RlpxServer({ config: new Config() })]
      const config = new Config({ servers, accountCache: 10000, storageCache: 1000 })
      const client = await EthereumClient.create({ config })

      await client.open()
      assert.ok(client.opened, 'opened')
      assert.equal(await client.open(), false, 'already opened')
    },
    { timeout: 15000 }
  )

  it(
    'should start/stop',
    async () => {
      const servers = [new Server()] as any
      const config = new Config({ servers, accountCache: 10000, storageCache: 1000 })
      const client = await EthereumClient.create({ config })
      await client.start()
      assert.ok(client.started, 'started')
      assert.equal(await client.start(), false, 'already started')
      await client.stop()
      assert.notOk(client.started, 'stopped')
      assert.equal(await client.stop(), false, 'already stopped')
    },
    { timeout: 10000 }
  )

  it('should reset td', () => {
    td.reset()
  })
})
