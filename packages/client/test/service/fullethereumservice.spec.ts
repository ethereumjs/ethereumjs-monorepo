import { Common, Hardfork } from '@ethereumjs/common'
import { TransactionFactory, TransactionType } from '@ethereumjs/tx'
import { equalsBytes, hexToBytes, randomBytes } from '@ethereumjs/util'
import { assert, describe, expect, it, vi } from 'vitest'

import { Chain } from '../../src/blockchain'
import { Config, SyncMode } from '../../src/config'
import { RlpxServer } from '../../src/net/server'
import { Event } from '../../src/types'
import genesisJSON from '../testdata/geth-genesis/post-merge.json'

import type { BeaconSynchronizer } from '../../src/sync'
import type { Log } from '@ethereumjs/evm'

vi.mock('../../src/net/peerpool', () => {
  const PeerPool = vi.fn()
  PeerPool.prototype.open = vi.fn()
  PeerPool.prototype.close = vi.fn()
  PeerPool.prototype.start = vi.fn()
  PeerPool.prototype.stop = vi.fn()
  return { PeerPool }
})

vi.mock('../../src/net/protocol/ethprotocol', () => {
  const EthProtocol = vi.fn()
  EthProtocol.prototype.name = 'eth'
  return { EthProtocol }
})

vi.mock('../../src/net/protocol/lesprotocol', () => {
  const LesProtocol = vi.fn()
  LesProtocol.prototype.name = 'les'
  return { LesProtocol }
})

vi.mock('../../src/sync/fullsync', () => {
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
vi.mock('../../src/sync/beaconsync', () => {
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

vi.mock('../../src/net/server')
vi.mock('../../src/execution')
const { FullEthereumService } = await import('../../src/service/fullethereumservice')

describe('initialize', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  const service = new FullEthereumService({ config, chain })

  it('should initialize correctly', async () => {
    assert.equal('full', service.synchronizer?.type, 'full mode')
    assert.equal(service.name, 'eth', 'got name')
  })

  it('should get protocols', async () => {
    let config = new Config({ accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    let service = new FullEthereumService({ config, chain })
    assert.ok(service.protocols.filter((p) => p.name === 'eth').length > 0, 'full protocol')
    assert.notOk(service.protocols.filter((p) => p.name === 'les').length > 0, 'no light protocol')
    config = new Config({ lightserv: true })
    service = new FullEthereumService({ config, chain })
    assert.ok(service.protocols.filter((p) => p.name === 'eth').length > 0, 'full protocol')
    assert.ok(service.protocols.filter((p) => p.name === 'les').length > 0, 'lightserv protocols')
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
  service.config.events.on(Event.SYNC_SYNCHRONIZED, () => {
    it('should syncronize', () => {
      assert.ok('synchronized')
    })
  })
  service.config.events.on(Event.SYNC_ERROR, (err) => {
    it('should get error', () => {
      assert.equal(err.message, 'error0', 'got error 1')
    })
  })
  service.config.events.emit(Event.SYNC_SYNCHRONIZED, BigInt(0))
  service.config.events.emit(Event.SYNC_ERROR, new Error('error0'))
  service.config.events.on(Event.SERVER_ERROR, (err) => {
    it('should get error', () => {
      assert.equal(err.message, 'error1')
    })
  })
  service.config.events.emit(Event.SERVER_ERROR, new Error('error1'), server)
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
    assert.notOk(await service.start(), 'already started')
    await service.stop()
    expect(service.synchronizer!.stop).toBeCalled()
    assert.notOk(await service.stop(), 'already stopped')
  })
})

describe('should correctly handle GetBlockHeaders', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  vi.unmock('../../src/blockchain')
  await import('../../src/blockchain')
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
            assert.ok(
              title === 'BlockHeaders' && msg.headers.length === 0,
              'sent empty headers when block height is too high'
            )
          })
        },
      } as any,
    } as any
  )
  ;(service.chain as any)._headers = {
    height: 5n,
    td: null,
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
            assert.ok(
              title === 'BlockHeaders' && msg.headers.length === 1,
              'sent 1 header when requested'
            )
          })
        },
      } as any,
    } as any
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
    assert.ok(
      (service.synchronizer as BeaconSynchronizer).type === 'beacon',
      'switched to BeaconSynchronizer'
    )
    assert.ok(service.beaconSync, 'can access BeaconSynchronizer')
  })
})

describe('should ban peer for sending NewBlock/NewBlockHashes after merge', async () => {
  const common = new Common({ chain: 'mainnet', hardfork: Hardfork.Paris })
  const config = new Config({ common, accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  chain.config.chainCommon.setHardfork(Hardfork.Paris)
  const service = new FullEthereumService({ config, chain })
  service.pool.ban = () => {
    it('should ban peeer', () => {
      assert.ok(true, 'banned peer when NewBlock/NewBlockHashes announced after Merge')
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
      assert.deepEqual(
        msg[0],
        TransactionFactory.fromTxData({ type: 2 }),
        'handled Transactions message'
      )
    })
  }

  await service.handle(
    {
      name: 'Transactions',
      data: [TransactionFactory.fromTxData({ type: 2 })],
    },
    'eth',
    undefined as any
  )
})

describe('should handle NewPooledTransactionHashes', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  const service = new FullEthereumService({ config, chain })
  service.txPool.handleAnnouncedTxHashes = async (msg, _peer, _pool) => {
    it('should handle NewPooledTransactionHashes', () => {
      assert.deepEqual(msg[0], hexToBytes('0xabcd'), 'handled NewPooledTransactionhashes')
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
    } as any
  )
})

describe('should handle GetPooledTransactions', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  const service = new FullEthereumService({ config, chain })
  ;(service.txPool as any).validate = () => {}

  const tx = TransactionFactory.fromTxData({ type: 2 }).sign(randomBytes(32))
  await service.txPool.add(tx)

  await service.handle(
    { name: 'GetPooledTransactions', data: { reqId: 1, hashes: [tx.hash()] } },
    'eth',
    {
      eth: {
        send: (_: string, data: any): any => {
          it('should handle getPooledTransactions', () => {
            assert.ok(equalsBytes(data.txs[0].hash(), tx.hash()), 'handled getPooledTransactions')
          })
        },
      } as any,
    } as any
  )
})

describe('should handle decoding NewPooledTransactionHashes with eth/68 message format', async () => {
  const txHash = randomBytes(32)

  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  const service = new FullEthereumService({ config, chain })
  ;(service.txPool as any).validate = () => {}
  ;(service.txPool as any).handleAnnouncedTxHashes = (
    hashes: Uint8Array[],
    _peer: any,
    _pool: any
  ) => {
    it('should get correct tx hash from eth68 message', () => {
      assert.deepEqual(hashes[0], txHash)
    })
  }

  await service.handle(
    { name: 'NewPooledTransactionHashes', data: [[1], [100], [txHash]] },
    'eth',
    {
      eth: {
        versions: [67, 68],
      },
    } as any
  )
})

describe.skip('should handle structuring NewPooledTransactionHashes with eth/68 message format', async () => {
  const txHash = randomBytes(32)
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const chain = await Chain.create({ config })
  const service = new FullEthereumService({ config, chain })
  ;(service.txPool as any).validate = () => {}
  service.txPool.sendNewTxHashes(
    [[1], [100], [txHash]],
    [
      {
        eth: {
          versions: [67, 68],
          request: (data: any): any => {
            it('should handle', () => {
              assert.ok(equalsBytes(data[0][2], txHash), 'handled getPooledTransactions')
            })
          },
        },
      } as any,
    ]
  )
})

describe('should start on beacon sync when past merge', async () => {
  const common = Common.fromGethGenesis(genesisJSON, { chain: 'post-merge' })
  common.setHardforkBy({ blockNumber: BigInt(0), td: BigInt(0) })
  const config = new Config({ accountCache: 10000, storageCache: 1000, common })
  const chain = await Chain.create({ config })
  it('should be available', () => {
    const service = new FullEthereumService({ config, chain })
    assert.ok(service.beaconSync, 'beacon sync should be available')
  })
  it('should not be available', () => {
    const configDisableBeaconSync = new Config({ common, syncmode: SyncMode.None })
    const service = new FullEthereumService({ config: configDisableBeaconSync, chain })
    assert.notOk(service.beaconSync, 'beacon sync should not be available')
  })
})
