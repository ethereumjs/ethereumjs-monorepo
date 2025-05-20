import { MemoryLevel } from 'memory-level'
import { assert, describe, it, vi } from 'vitest'

import { EthereumClient } from '../src/client.ts'
import { Config } from '../src/config.ts'
import { PeerPool } from '../src/net/peerpool.ts'
import { RlpxServer } from '../src/net/server/index.ts'

describe('[EthereumClient]', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  class FullEthereumService {
    open() {}
    start() {}
    stop() {}
    config = config
    pool = new PeerPool({ config })
  }
  FullEthereumService.prototype.open = vi.fn().mockResolvedValue(null)
  FullEthereumService.prototype.start = vi.fn().mockResolvedValue(null)
  FullEthereumService.prototype.stop = vi.fn().mockResolvedValue(null)
  vi.doMock('../src/service/index.ts', () => {
    return {
      FullEthereumService,
    }
  })

  class Server {
    open() {}
    start() {}
    stop() {}
    bootstrap() {}
  }
  Server.prototype.open = vi.fn()
  Server.prototype.start = vi.fn().mockResolvedValue(null)
  Server.prototype.stop = vi.fn().mockResolvedValue(null)
  Server.prototype.bootstrap = vi.fn().mockResolvedValue(null)
  vi.doMock('../src/net/server/server.ts', () => {
    return {
      Server,
    }
  })

  it('should initialize correctly', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const client = await EthereumClient.create({ config })
    assert.property(client.service, 'execution', 'added FullEthereumService')
    assert.property(client.service, 'txPool', 'added FullEthereumService')
  })

  it('should open', async () => {
    const server = new RlpxServer({ config: new Config() })
    const config = new Config({ server, accountCache: 10000, storageCache: 1000 })
    const client = await EthereumClient.create({ config, metaDB: new MemoryLevel() })

    await client.open()
    assert.isTrue(client.opened, 'opened')
    assert.strictEqual(await client.open(), false, 'already opened')
  }, 30000)

  it('should start/stop', async () => {
    const server = new Server() as any
    const config = new Config({ server, accountCache: 10000, storageCache: 1000 })
    const client = await EthereumClient.create({ config, metaDB: new MemoryLevel() })
    await (client.service as any)['execution'].setupMerkleVM()
    await client.start()
    assert.isTrue(client.started, 'started')
    assert.strictEqual(await client.start(), false, 'already started')
    await client.stop()
    assert.isFalse(client.started, 'stopped')
    assert.strictEqual(await client.stop(), false, 'already stopped')
  }, 30000)
})
