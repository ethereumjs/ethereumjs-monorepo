import { createBlock } from '@ethereumjs/block'
import * as td from 'testdouble'
import { assert, describe, it, vi } from 'vitest'

import { Common } from '@ethereumjs/common'
import type { PrefixedHexString } from '@ethereumjs/util'
import { Chain } from '../../src/blockchain/index.ts'
import { Config } from '../../src/config.ts'
import { Event } from '../../src/types.ts'
import { wait } from '../integration/util.ts'

const powConfig = {
  name: 'testnet',
  chainId: 12345,
  defaultHardfork: 'byzantium',
  consensus: {
    type: 'pow',
    algorithm: 'ethash',
  },
  comment: 'PoW network [test]',
  url: '[TESTNET_URL]',
  genesis: {
    gasLimit: 1000000,
    difficulty: 1,
    nonce: '0xbb00000000000000' as PrefixedHexString,
    extraData: ('0x' + '00'.repeat(97)) as PrefixedHexString,
  },
  hardforks: [
    {
      name: 'chainstart',
      block: 0,
    },
    {
      name: 'homestead',
      block: 1,
    },
    {
      name: 'tangerineWhistle',
      block: 2,
    },
    {
      name: 'spuriousDragon',
      block: 3,
    },
    {
      name: 'byzantium',
      block: 4,
    },
  ],
  bootstrapNodes: [],
}

const powCommon = new Common({ chain: powConfig })
const cliqueConfig = JSON.parse(JSON.stringify(powConfig))
cliqueConfig.consensus = {
  type: 'poa',
  algorithm: 'clique',
  clique: {
    period: 15,
    epoch: 30000,
  },
}
const cliqueCommon = new Common({ chain: cliqueConfig })

describe('[FullSynchronizer]', async () => {
  const txPool: any = { removeNewBlockTxs: () => {}, checkRunState: () => {} }
  const execution: any = { run: () => {} }
  class PeerPool {
    open() {}
    close() {}
    idle() {}
    ban(_peer: any) {}
  }
  PeerPool.prototype.open = vi.fn()
  PeerPool.prototype.close = vi.fn()
  PeerPool.prototype.idle = vi.fn()
  class BlockFetcher {
    fetch() {}
    clear() {}
    destroy() {}
  }
  BlockFetcher.prototype.fetch = vi.fn()
  BlockFetcher.prototype.clear = vi.fn()
  BlockFetcher.prototype.destroy = vi.fn()
  vi.doMock('../../src/sync/fetcher/index.ts', () => {
    return {
      default: () => ({ BlockFetcher }),
    }
  })

  const { FullSynchronizer } = await import('../../src/sync/fullsync.ts')

  it('should initialize correctly', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new FullSynchronizer({ config, pool, chain, txPool, execution })
    assert.strictEqual(sync.type, 'full', 'full type')
  })

  it('should open', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new FullSynchronizer({
      config,
      pool,
      chain,
      txPool,
      execution,
    })
    sync['pool'].open = vi.fn().mockResolvedValue(null)
    /// @ts-expect-error -- Assigning simpler config for testing
    sync['pool'].peers = []
    await sync.open()
    assert.isTrue(true, 'opened')
    await sync.close()
  })

  it('should get height', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new FullSynchronizer({ config, pool, chain, txPool, execution })
    const peer = {
      eth: {
        getBlockHeaders: vi.fn((input) => {
          const headers = [{ number: BigInt(5) }]
          if (JSON.stringify(input) === JSON.stringify({ block: 'hash', max: 1 }))
            return [BigInt(1), headers]
        }),
        status: { bestHash: 'hash' },
      },
      latest: async () => {
        return {
          number: BigInt(5),
          hash: () => new Uint8Array(0),
        }
      },
    }
    const latest = await peer.latest()
    assert.strictEqual(latest!.number, BigInt(5), 'got height')
    await sync.stop()
    await sync.close()
  })

  for (const common of [powCommon, cliqueCommon]) {
    it(`should find best (${common.consensusAlgorithm()})`, async () => {
      const config = new Config({ accountCache: 10000, storageCache: 1000, common })
      const pool = new PeerPool() as any
      const chain = await Chain.create({ config })
      const sync = new FullSynchronizer({
        config,
        interval: 1,
        pool,
        chain,
        txPool,
        execution,
      })
      sync['running'] = true
      const peers = [
        { eth: { status: { td: BigInt(1) } }, inbound: false },
        { eth: { status: { td: BigInt(2) } }, inbound: false },
      ]
      /// @ts-expect-error -- Assigning simpler config for testing
      sync.height = vi.fn((input) => {
        if (JSON.stringify(input) === JSON.stringify(peers[0]))
          return Promise.resolve(peers[0].eth.status.td)
        if (JSON.stringify(input) === JSON.stringify(peers[1]))
          return Promise.resolve(peers[1].eth.status.td)
      })
      /// @ts-expect-error -- Assigning simpler config for testing
      sync.chain = { blocks: { td: BigInt(1) } }
      /// @ts-expect-error -- Assigning simpler config for testing
      sync.pool = { peers }
      sync['forceSync'] = true
      assert.strictEqual(await sync.best(), peers[1] as any, 'found best')
      await sync.stop()
      await sync.close()
    })
  }

  it('should sync', async () => {
    const config = new Config({
      accountCache: 10000,
      storageCache: 1000,
      safeReorgDistance: 0,
    })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new FullSynchronizer({
      config,
      interval: 1,
      pool,
      chain,
      txPool,
      execution,
    })
    sync.best = td.func<(typeof sync)['best']>()
    td.when(sync.best()).thenResolve({
      les: { status: { headNum: BigInt(2) } },
      latest: () => {
        return {
          number: BigInt(2),
          hash: () => new Uint8Array(0),
        }
      },
    } as any)
    let count = 0
    BlockFetcher.prototype.fetch = vi.fn(async () => {
      if (count < 2) {
        count--
        await wait(2000)
        return undefined
      } else {
        throw new Error('stubbed function called more than twice')
      }
    })
    /// @ts-expect-error -- Assigning simpler config for testing
    sync['chain'] = { blocks: { height: BigInt(3) } }
    assert.isFalse(await sync.sync(), 'local height > remote height')
    sync['chain'] = {
      /// @ts-expect-error -- Assigning simpler config for testing
      blocks: { height: BigInt(0) },
    }
    setTimeout(() => {
      config.events.emit(Event.SYNC_SYNCHRONIZED, BigInt(0))
    }, 100)
    assert.isTrue(await sync.sync(), 'local height < remote height')
    BlockFetcher.prototype.fetch = vi.fn().mockRejectedValue(new Error('err0'))
    try {
      await sync.sync()
    } catch (err: any) {
      assert.strictEqual(err.message, 'err0', 'got error')
      await sync.stop()
      await sync.close()
    }
  })

  it('should send NewBlock/NewBlockHashes to right peers', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new FullSynchronizer({
      config,
      interval: 1,
      pool,
      chain,
      txPool,
      execution,
    })
    /// @ts-expect-error -- Assigning simpler config for testing
    sync['_fetcher'] = {
      enqueueByNumberList: (blockNumberList: bigint[], min: bigint) => {
        assert.strictEqual(
          blockNumberList[0],
          BigInt(0),
          'enqueueing the correct block in the Fetcher',
        )
        assert.strictEqual(
          blockNumberList.length,
          1,
          'correct number of blocks enqueued in Fetcher',
        )
        assert.strictEqual(min, BigInt(0), 'correct start block number in Fetcher')
      },
    }
    Object.defineProperty(sync, 'fetcher', {
      get() {
        return this._fetcher
      },
    })

    let timesSentToPeer2 = 0
    const peers = [
      {
        id: 'Peer 1',
        eth: {
          status: { td: BigInt(1) },
          send(name: string) {
            assert.strictEqual(name, 'NewBlock', 'sent NewBlock to Peer 1')
          },
        },
        inbound: false,
      },
      {
        id: 'Peer 2',
        eth: {
          status: { td: BigInt(2) },
          send(name: string) {
            assert.strictEqual(name, 'NewBlockHashes', 'sent NewBlockHashes to Peer 2')
            timesSentToPeer2++
          },
        },
        inbound: false,
      },
      {
        id: 'Peer 3',
        eth: {
          status: { td: BigInt(3) },
          send() {
            assert.fail('should not send announcement to peer3')
          },
        },
        inbound: false,
      },
    ]
    /// @ts-expect-error -- Assigning simpler config for testing
    sync.pool = { peers }

    const chainTip = createBlock({
      header: {},
    })
    const newBlock = createBlock({
      header: {
        parentHash: chainTip.hash(),
      },
    })
    chain.getCanonicalHeadBlock = vi.fn()
    chain.putBlocks = vi.fn((input) => {
      assert.strictEqual(
        JSON.stringify(input),
        JSON.stringify([newBlock]),
        'putBlocks is called as expected',
      )
    }) as any
    // NewBlock message from Peer 3
    await sync.handleNewBlock(newBlock, peers[2] as any)

    assert.strictEqual(config.syncTargetHeight, BigInt(0), 'sync target height should be set to 0')
    await sync.handleNewBlock(newBlock)
    assert.strictEqual(timesSentToPeer2, 1, 'sent NewBlockHashes to Peer 2 once')
    assert.isTrue(true, 'did not send NewBlock to Peer 3')
    /// @ts-expect-error -- Assigning simpler config for testing
    sync['chain']._blocks = {
      latest: chainTip,
    }
    sync['newBlocksKnownByPeer'].delete(peers[0].id)
    await sync.handleNewBlock(newBlock, peers[2] as any)
  })

  it('should process blocks', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const pool = new PeerPool() as any
    const chain = await Chain.create({ config })
    const sync = new FullSynchronizer({
      config,
      interval: 1,
      pool,
      chain,
      txPool,
      execution,
    })

    const chainTip = createBlock({
      header: {},
    })
    const newBlock = createBlock({
      header: {
        parentHash: chainTip.hash(),
      },
    })

    sync.running = true
    assert.isTrue(await sync.processBlocks([newBlock]), 'should successfully process blocks')
  })
})
