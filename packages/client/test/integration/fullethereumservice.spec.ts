import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Hardfork } from '@ethereumjs/common'
import { MerkleStateManager } from '@ethereumjs/statemanager'
import { createFeeMarket1559TxFromRLP } from '@ethereumjs/tx'
import { Account, equalsBytes, hexToBytes, toBytes } from '@ethereumjs/util'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { Config } from '../../src/config.ts'
import { FullEthereumService } from '../../src/service/index.ts'
import { Event } from '../../src/types.ts'

import { MockChain } from './mocks/mockchain.ts'
import { MockServer } from './mocks/mockserver.ts'
import { destroy } from './util.ts'

const config = new Config({ accountCache: 10000, storageCache: 1000 })

// Stub out setStateRoot since correct state root doesn't exist in mock state.

MerkleStateManager.prototype.setStateRoot = (): any => {}

MerkleStateManager.prototype.shallowCopy = function () {
  return this
}
async function setup(): Promise<[MockServer, FullEthereumService]> {
  const server = new MockServer({ config }) as any
  const blockchain = await createBlockchain({
    common: config.chainCommon,
    validateBlocks: false,
    validateConsensus: false,
  })
  const chain = new MockChain({ config, blockchain })
  const serviceConfig = new Config({ server })
  const service = new FullEthereumService({
    config: serviceConfig,
    chain,
  })

  await service.open()
  await server.start()
  await service.start()
  service.txPool.start()
  return [server, service]
}

describe(
  'should handle ETH requests',
  async () => {
    const [server, service] = await setup()
    const peer = await server.accept('peer0')
    const hash = hexToBytes('0xa321d27cd2743617c1c1b0d7ecb607dd14febcdfca8f01b79c3f0249505ea069')
    const [reqId1, headers] = await peer.eth!.getBlockHeaders({ block: BigInt(1), max: 2 })
    it('handled getBlockHeaders', async () => {
      assert.equal(reqId1, BigInt(1), 'handled GetBlockHeaders')
      assert.ok(equalsBytes(headers![1].hash(), hash), 'handled GetBlockHeaders')
    })
    const res = await peer.eth!.getBlockBodies({ hashes: [hash] })
    it('handled getBlockBodies', async () => {
      const [reqId2, bodies] = res
      assert.equal(reqId2, BigInt(2), 'handled GetBlockBodies')
      assert.deepEqual(bodies, [[[], []]], 'handled GetBlockBodies')
    })
    service.config.events.on(Event.PROTOCOL_MESSAGE, async (msg) => {
      switch (msg.name) {
        case 'NewBlockHashes': {
          it('should handle newBlockHashes', () => {
            assert.ok(true, 'handled NewBlockHashes')
          })
          break
        }
        case 'NewBlock': {
          it('should handle NewBlock', () => {
            assert.ok(true, 'handled NewBlock')
          })
          await destroy(server, service)
          break
        }
      }
    })
    peer.eth!.send('NewBlockHashes', [[hash, BigInt(2)]])

    const block = createBlock(
      {
        header: {
          number: 1,
          difficulty: 1,
        },
      },
      { common: config.chainCommon },
    )
    peer.eth!.send('NewBlock', [block, BigInt(1)])

    const txData =
      '0x02f901100180843b9aca00843b9aca008402625a0094cccccccccccccccccccccccccccccccccccccccc830186a0b8441a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a0afb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9a0479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64'
    const tx = createFeeMarket1559TxFromRLP(toBytes(txData))
    await service.execution.vm.stateManager.putAccount(
      tx.getSenderAddress(),
      new Account(BigInt(0), BigInt('40000000000100000')),
    )
    await service.txPool.add(tx)
    service.config.chainCommon.getHardforkBy = td.func<typeof config.chainCommon.getHardforkBy>()
    td.when(service.config.chainCommon.getHardforkBy(td.matchers.anything())).thenReturn(
      Hardfork.London,
    )
    const [_, txs] = await peer.eth!.getPooledTransactions({ hashes: [tx.hash()] })
    it('should handle GetPooledTransactions', async () => {
      assert.ok(equalsBytes(txs[0].hash(), tx.hash()), 'handled GetPooledTransactions')
    })

    peer.eth!.send('Transactions', [tx])
  },
  { timeout: 30000 },
)
