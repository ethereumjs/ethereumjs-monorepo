import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { Chain } from '../../src/blockchain'
import { Config } from '../../src/config'
import { Event } from '../../src/types'

describe('[LightEthereumService]', async () => {
  class PeerPool {
    open() {}
    close() {}
  }
  PeerPool.prototype.open = td.func<any>()
  PeerPool.prototype.close = td.func<any>()
  td.replace<any>('../../src/net/peerpool', { PeerPool })
  const MockChain = td.constructor([] as any)
  MockChain.prototype.open = td.func()
  td.replace<any>('../../src/blockchain', { MockChain })
  const LesProtocol = td.constructor([] as any)
  td.replace<any>('../../src/net/protocol/lesprotocol', { LesProtocol })
  class LightSynchronizer {
    start() {}
    stop() {}
    open() {}
    close() {}
  }
  LightSynchronizer.prototype.start = td.func<any>()
  LightSynchronizer.prototype.stop = td.func<any>()
  LightSynchronizer.prototype.open = td.func<any>()
  LightSynchronizer.prototype.close = td.func<any>()
  td.replace<any>('../../src/sync/lightsync', { LightSynchronizer })

  const { LightEthereumService } = await import('../../src/service/lightethereumservice')

  it('should initialize correctly', async () => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const service = new LightEthereumService({ config, chain })
    assert.ok(service.synchronizer instanceof LightSynchronizer, 'light sync')
    assert.equal(service.name, 'eth', 'got name')
  })

  it('should get protocols', async () => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const service = new LightEthereumService({ config, chain })
    assert.ok(service.protocols[0] instanceof LesProtocol, 'light protocols')
  })

  it('should open', async () => {
    const server = td.object() as any
    const config = new Config({ servers: [server], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const service = new LightEthereumService({ config, chain })
    await service.open()
    td.verify(service.synchronizer.open())
    td.verify(server.addProtocols(td.matchers.anything()))
    service.config.events.on(Event.SYNC_SYNCHRONIZED, () => assert.ok(true, 'synchronized'))
    service.config.events.on(Event.SYNC_ERROR, (err: Error) => {
      if (err.message === 'error0') assert.ok(true, 'got error 1')
    })
    service.config.events.emit(Event.SYNC_SYNCHRONIZED, BigInt(0))
    service.config.events.emit(Event.SYNC_ERROR, new Error('error0'))
    service.config.events.on(Event.SERVER_ERROR, (err: Error) => {
      if (err.message === 'error1') assert.ok(true, 'got error 2')
    })
    service.config.events.emit(Event.SERVER_ERROR, new Error('error1'), server)
    await service.close()
  })

  it('should start/stop', async () => {
    const server = td.object() as any
    const config = new Config({ servers: [server], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const service = new LightEthereumService({ config, chain })
    await service.start()
    td.verify(service.synchronizer.start())
    assert.notOk(await service.start(), 'already started')
    await service.stop()
    td.verify(service.synchronizer.stop())
    assert.notOk(await service.stop(), 'already stopped')
  })

  it('should reset td', () => {
    td.reset()
  })
})
