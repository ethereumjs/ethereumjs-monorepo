import { Common, Hardfork, Mainnet, createCommonFromGethGenesis } from '@ethereumjs/common'
import { postMergeGethGenesis } from '@ethereumjs/testdata'
import { TransactionType, createTx } from '@ethereumjs/tx'
import { equalsBytes, hexToBytes, randomBytes } from '@ethereumjs/util'
import { assert, describe, expect, it, vi } from 'vitest'

import { Chain } from '../../src/blockchain/index.ts'
import { Config, SyncMode } from '../../src/config.ts'
import { RlpxServer } from '../../src/net/server/index.ts'
import { Event } from '../../src/types.ts'

import type { Log } from '@ethereumjs/evm'
import type { BeaconSynchronizer } from '../../src/sync/index.ts'

vi.mock('../../src/net/peerpool.ts', () => {
  const PeerPool = vi.fn()
  PeerPool.prototype.open = vi.fn()
  PeerPool.prototype.close = vi.fn()
  PeerPool.prototype.start = vi.fn()
  PeerPool.prototype.stop = vi.fn()
  return { PeerPool }
})

vi.mock('../../src/net/protocol/ethprotocol.ts', () => {
  const EthProtocol = vi.fn()
  EthProtocol.prototype.name = 'eth'
  return { EthProtocol }
})

vi.mock('../../src/sync/fullsync.ts', () => {
  const FullSynchronizer = vi.fn()
  FullSynchronizer.prototype.start = vi.fn()
  FullSynchronizer.prototype.stop = vi.fn()
  FullSynchronizer.prototype.open = vi.fn()
  FullSynchronizer.prototype.close = vi.fn()
  FullSynchronizer.prototype.handleNewBlock = vi.fn()
  FullSynchronizer.prototype.handleNewBlockHashes = vi.fn()
  FullSynchronizer.prototype.type = 'full'

  return { FullSynchronizer }
})
vi.mock('../../src/sync/beaconsync.ts', () => {
  const BeaconSynchronizer = vi.fn()
  BeaconSynchronizer.prototype.start = vi.fn()
  BeaconSynchronizer.prototype.stop = vi.fn()
  BeaconSynchronizer.prototype.open = vi.fn()
  BeaconSynchronizer.prototype.close = vi.fn()
  BeaconSynchronizer.prototype.type = 'beacon'
  return {
    BeaconSynchronizer,
  }
})

vi.mock('../../src/net/server/index.ts')
vi.mock('../../src/execution/index.ts')
const { FullEthereumService } = await import('../../src/service/fullethereumservice.ts')

describe('initialize', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  const service = new FullEthereumService({ config, chain })

  it('should initialize correctly', async () => {
    assert.strictEqual('full', service.synchronizer?.type, 'full mode')
    assert.strictEqual(service.name, 'eth', 'got name')
  })

  it('should get protocols', async () => {
    let config = new Config({ accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    let service = new FullEthereumService({ config, chain })
    assert.isNotEmpty(
      service.protocols.filter((p) => p.name === 'eth'),
      'full protocol',
    )
    assert.isEmpty(
      service.protocols.filter((p) => p.name === 'les'),
      'no light protocol',
    )
    config = new Config({})
    service = new FullEthereumService({ config, chain })
    assert.isNotEmpty(
      service.protocols.filter((p) => p.name === 'eth'),
      'full protocol',
    )
  })
})

describe('should open', async () => {
  const server = new RlpxServer({} as any)
  const config = new Config({ server, accountCache: 10000, storageCache: 1000 })

  const chain = await Chain.create({ config })
  chain.open = vi.fn()
  const service = new FullEthereumService({ config, chain })

  await service.open()
  expect(service.synchronizer!.open).toBeCalled()
  expect(server.addProtocols).toBeCalled()

  it('should synchronize', async () => {
    assert.isTrue(
      await new Promise((resolve) => {
        service.config.events.on(Event.SYNC_SYNCHRONIZED, () => {
          resolve(true)
        })
        service.config.events.emit(Event.SYNC_SYNCHRONIZED, BigInt(0))
        resolve(false)
      }),
      'synchronized',
    )
  })

  it('should get sync error', async () => {
    assert.strictEqual(
      await new Promise((resolve) => {
        service.config.events.on(Event.SYNC_ERROR, (err) => {
          resolve(err.message)
        })
        service.config.events.emit(Event.SYNC_ERROR, new Error('error0'))
        resolve(false)
      }),
      'error0',
      'sync error received',
    )
  })

  it('should get server error', async () => {
    assert.strictEqual(
      await new Promise((resolve) => {
        service.config.events.on(Event.SERVER_ERROR, (err) => {
          resolve(err.message)
        })
        service.config.events.emit(Event.SERVER_ERROR, new Error('error1'), server)
        resolve(false)
      }),
      'error1',
      'server error received',
    )
  })

  await service.close()
})

describe('should start/stop', async () => {
  const server = new RlpxServer({} as any)
  const config = new Config({ server, accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })

  const service = new FullEthereumService({ config, chain })
  it('should start and stop', async () => {
    await service.start()

    expect(service.synchronizer!.start).toBeCalled()
    assert.isFalse(await service.start(), 'already started')
    await service.stop()
    expect(service.synchronizer!.stop).toBeCalled()
    assert.isFalse(await service.stop(), 'already stopped')
  })
})

describe('should correctly handle GetBlockHeaders', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  vi.unmock('../../src/blockchain')
  await import('../../src/blockchain/index.ts')
  const chain = await Chain.create({ config })
  chain.getHeaders = () => [{ number: 1n }] as any
  const service = new FullEthereumService({ config, chain })
  await service.handle(
    {
      name: 'GetBlockHeaders',
      data: { reqId: 1, block: 5n, max: 1, skip: false, reverse: true },
    },
    'eth',
    {
      eth: {
        send: (title: string, msg: any) => {
          it('should send empty headers', () => {
            assert.isTrue(
              title === 'BlockHeaders' && msg.headers.length === 0,
              'sent empty headers when block height is too high',
            )
          })
        },
      },
    } as any,
  )

  service.chain['_headers'] = {
    height: 5n,
    /// @ts-expect-error -- For testing purposes
    td: null,
    /// @ts-expect-error -- For testing purposes
    latest: 5n,
  }

  await service.handle(
    {
      name: 'GetBlockHeaders',
      data: { reqId: 1, block: 1n, max: 1, skip: false, reverse: false },
    },
    'eth',
    {
      eth: {
        send: (title: string, msg: any) => {
          it('should send 1 header', () => {
            assert.isTrue(
              title === 'BlockHeaders' && msg.headers.length === 1,
              'sent 1 header when requested',
            )
          })
        },
      },
    } as any,
  )
})

describe('should call handleNewBlock on NewBlock and handleNewBlockHashes on NewBlockHashes', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  const service = new FullEthereumService({ config, chain })
  it('should handle new block', async () => {
    await service.handle({ name: 'NewBlock', data: [{}, BigInt(1)] }, 'eth', undefined as any)
    expect((service.synchronizer as any).handleNewBlock).toBeCalled()
  })
  it('should handle new blockhashes', async () => {
    await service.handle({ name: 'NewBlockHashes', data: [{}, BigInt(1)] }, 'eth', undefined as any)
    expect((service.synchronizer as any).handleNewBlockHashes).toBeCalledWith([{}, BigInt(1)])
  })
  // should not call when using BeaconSynchronizer
  // (would error if called since handleNewBlock and handleNewBlockHashes are not available on BeaconSynchronizer)
  it('should switch to beacon sync', async () => {
    await service.switchToBeaconSync()
    assert.strictEqual(
      (service.synchronizer as BeaconSynchronizer).type,
      'beacon',
      'switched to BeaconSynchronizer',
    )
    assert.isDefined(service.beaconSync, 'can access BeaconSynchronizer')
  })
})

describe('should ban peer for sending NewBlock/NewBlockHashes after merge', async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Paris })
  const config = new Config({ common, accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  chain.config.chainCommon.setHardfork(Hardfork.Paris)
  const service = new FullEthereumService({ config, chain })
  service.pool.ban = () => {
    it('should ban peer', () => {
      assert.isTrue(true, 'banned peer when NewBlock/NewBlockHashes announced after Merge')
    })
  }

  await service.handle({ name: 'NewBlock', data: [{}, BigInt(1)] }, 'eth', { id: 1 } as any)
  await service.handle({ name: 'NewBlockHashes', data: [] }, 'eth', { id: 1 } as any)
})

describe('should send Receipts on GetReceipts', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  const service = new FullEthereumService({ config, chain })
  const blockHash = new Uint8Array(32).fill(1)
  const receipts = [
    {
      status: 1 as 0 | 1,
      cumulativeBlockGasUsed: BigInt(100),
      bitvector: new Uint8Array(256),
      logs: [
        [new Uint8Array(20), [new Uint8Array(32), new Uint8Array(32).fill(1)], new Uint8Array(10)],
      ] as Log[],
      txType: TransactionType.FeeMarketEIP1559,
    },
    {
      status: 0 as 0 | 1,
      cumulativeBlockGasUsed: BigInt(1000),
      bitvector: new Uint8Array(25).fill(1),
      logs: [
        [
          new Uint8Array(20).fill(1),
          [new Uint8Array(32).fill(1), new Uint8Array(32).fill(1)],
          new Uint8Array(10),
        ],
      ] as Log[],
      txType: TransactionType.Legacy,
    },
  ]
  service.execution = {
    receiptsManager: { getReceipts: vi.fn().mockReturnValue(receipts) },
  } as any

  const peer = { eth: { send: vi.fn() } } as any
  it('should handle getReceipts', async () => {
    await service.handle({ name: 'GetReceipts', data: [BigInt(1), [blockHash]] }, 'eth', peer)
    expect(peer.eth.send).toBeCalledWith('Receipts', { reqId: BigInt(1), receipts })
  })
})

describe('should handle Transactions', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  const service = new FullEthereumService({ config, chain })
  service.txPool.handleAnnouncedTxs = async (msg, _peer, _pool) => {
    it('should handle transaction message', () => {
      assert.deepEqual(msg[0], createTx({ type: 2 }), 'handled Transactions message')
    })
  }

  await service.handle(
    {
      name: 'Transactions',
      data: [createTx({ type: 2 })],
    },
    'eth',
    undefined as any,
  )
})

describe('should handle NewPooledTransactionHashes', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  const service = new FullEthereumService({ config, chain })
  service.txPool.handleAnnouncedTxHashes = async (msg, _peer, _pool) => {
    it('should handle NewPooledTransactionHashes', () => {
      assert.deepEqual(msg[0], hexToBytes('0xabcd'), 'handled NewPooledTransactionHashes')
    })
  }

  await service.handle(
    {
      name: 'NewPooledTransactionHashes',
      data: [hexToBytes('0xabcd')],
    },
    'eth',
    {
      eth: {
        versions: [66],
      },
    } as any,
  )
})

describe('should handle GetPooledTransactions', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  const service = new FullEthereumService({ config, chain })
  /// @ts-expect-error -- Assigning simpler config for testing
  service.txPool.validate = () => {}

  const tx = createTx({ type: 2 }).sign(randomBytes(32))
  await service.txPool.add(tx)

  await service.handle(
    { name: 'GetPooledTransactions', data: { reqId: 1, hashes: [tx.hash()] } },
    'eth',
    {
      eth: {
        send: (_: string, data: any): any => {
          it('should handle getPooledTransactions', () => {
            assert.isTrue(
              equalsBytes(data.txs[0].hash(), tx.hash()),
              'handled getPooledTransactions',
            )
          })
        },
      } as any,
    } as any,
  )
})

describe('should handle decoding NewPooledTransactionHashes with eth/68 message format', async () => {
  const txHash = randomBytes(32)

  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  const service = new FullEthereumService({ config, chain })
  /// @ts-expect-error -- Assigning simpler config for testing
  service.txPool.validate = () => {}
  /// @ts-expect-error -- Assigning simpler config for testing
  service.txPool['handleAnnouncedTxHashes'] = (hashes: Uint8Array[], _peer: any, _pool: any) => {
    it('should get correct tx hash from eth68 message', () => {
      assert.deepEqual(hashes[0], txHash)
    })
  }

  await service.handle(
    { name: 'NewPooledTransactionHashes', data: [[1], [100], [txHash]] },
    'eth',
    {
      /// @ts-expect-error -- Assigning simpler config for testing
      eth: {
        versions: [67, 68],
      },
    },
  )
})

describe.skip('should handle structuring NewPooledTransactionHashes with eth/68 message format', async () => {
  const txHash = randomBytes(32)
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  const service = new FullEthereumService({ config, chain })
  /// @ts-expect-error -- Assigning simpler config for testing
  service.txPool.validate = () => {}
  service.txPool.sendNewTxHashes(
    [[1], [100], [txHash]],
    [
      {
        /// @ts-expect-error -- Assigning simpler config for testing
        eth: {
          versions: [67, 68],
          request: (data: any): any => {
            it('should handle', () => {
              assert.isTrue(equalsBytes(data[0][2], txHash), 'handled getPooledTransactions')
            })
          },
        },
      },
    ],
  )
})

describe('should start on beacon sync when past merge', async () => {
  const common = createCommonFromGethGenesis(postMergeGethGenesis, { chain: 'post-merge' })
  common.setHardforkBy({ blockNumber: BigInt(0) })
  const config = new Config({ accountCache: 10000, storageCache: 1000, common })
  const chain = await Chain.create({ config })
  it('should be available', () => {
    const service = new FullEthereumService({ config, chain })
    assert.isDefined(service.beaconSync, 'beacon sync should be available')
  })
  it('should not be available', () => {
    const configDisableBeaconSync = new Config({ common, syncmode: SyncMode.None })
    const service = new FullEthereumService({ config: configDisableBeaconSync, chain })
    assert.isUndefined(service.beaconSync, 'beacon sync should not be available')
  })
})
