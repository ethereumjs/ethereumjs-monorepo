import { assert, describe, expect, it, vi } from 'vitest'

import { Chain } from '../../src/blockchain/chain.js'
import { Config } from '../../src/config.js'
import { LesProtocol } from '../../src/net/protocol/index.js'
import { RlpxServer } from '../../src/net/server/index.js'
import { LightSynchronizer } from '../../src/sync/lightsync.js'
import { Event } from '../../src/types.js'

vi.mock('../../src/net/peerpool.js')

vi.mock('../../src/net/server/index.js')
vi.mock('../../src/blockchain/index.js', () => {
  const Chain = vi.fn()
  Chain.prototype.open = vi.fn()
  return { Chain }
})
vi.mock('../../src/net/protocol/lesprotocol.js', () => {
  const LesProtocol = vi.fn()
  return { LesProtocol }
})
vi.mock('../../src/sync/lightsync', () => {
  const LightSynchronizer = vi.fn()
  LightSynchronizer.prototype.start = vi.fn()
  LightSynchronizer.prototype.stop = vi.fn()
  LightSynchronizer.prototype.open = vi.fn()
  LightSynchronizer.prototype.close = vi.fn()
  return { LightSynchronizer }
})

const { LightEthereumService } = await import('../../src/service/lightethereumservice.js')

describe('should initialize correctly', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  const service = new LightEthereumService({ config, chain })
  it('should initialize light sync', () => {
    assert.ok(service.synchronizer instanceof LightSynchronizer, 'light sync')
    assert.equal(service.name, 'eth', 'got name')
  })
})

describe('should get protocols', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  const service = new LightEthereumService({ config, chain })
  it('should initialize les protocols', () => {
    assert.ok(service.protocols[0] instanceof LesProtocol, 'light protocols')
  })
})

describe('should open', async () => {
  const server = new RlpxServer({} as any)
  const config = new Config({ server, accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  const service = new LightEthereumService({ config, chain })
  await service.open()
  it('should open', () => {
    expect(service.synchronizer.open).toHaveBeenCalled()
    expect(server.addProtocols).toBeCalled()
  })
  service.config.events.on(Event.SYNC_SYNCHRONIZED, () => {
    it('should syncronize', () => {
      assert.ok(true, 'synchronized')
    })
  })
  service.config.events.on(Event.SYNC_ERROR, (err: Error) => {
    it('should get error', () => {
      assert.equal(err.message, 'error0')
    })
  })
  service.config.events.emit(Event.SYNC_SYNCHRONIZED, BigInt(0))
  service.config.events.emit(Event.SYNC_ERROR, new Error('error0'))
  service.config.events.on(Event.SERVER_ERROR, (err: Error) => {
    it('should get error', () => {
      assert.equal(err.message, 'error1', 'got error 2')
    })
  })
  service.config.events.emit(Event.SERVER_ERROR, new Error('error1'), server)
  await service.close()
})

describe('should start/stop', async () => {
  const server = new RlpxServer({} as any)
  const config = new Config({ server, accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  const service = new LightEthereumService({ config, chain })
  it('should start', async () => {
    await service.start()
    expect(service.synchronizer.start).toBeCalled()
    assert.notOk(await service.start(), 'already started')
  })
  it('should stop', async () => {
    await service.stop()
    expect(service.synchronizer.stop).toBeCalled()
    assert.notOk(await service.stop(), 'already stopped')
  })
})
