import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Hardfork } from '@ethereumjs/common'
import { MerkleStateManager } from '@ethereumjs/statemanager'
import { createFeeMarket1559TxFromRLP } from '@ethereumjs/tx'
import { Account, equalsBytes, hexToBytes, toBytes } from '@ethereumjs/util'
import * as td from 'testdouble'
import { assert, beforeAll, describe, it } from 'vitest'

import { Config } from '../../src/config.js'
import { FullEthereumService } from '../../src/service/index.js'
import { Event } from '../../src/types.js'

import { MockChain } from './mocks/mockchain.js'
import { MockServer } from './mocks/mockserver.js'

const config = new Config({ accountCache: 10000, storageCache: 1000 })

async function setup(): Promise<[MockServer, FullEthereumService]> {
  const server = new MockServer({ config }) as any
  const blockchain = await createBlockchain({
    common: config.chainCommon,
    validateBlocks: false,
    validateConsensus: false,
  })
  const chain = new MockChain({ config, blockchain })
  const serviceConfig = new Config({ server, lightserv: true })
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

// Stub out setStateRoot since correct state root doesn't exist in mock state.
const _ogSetStateRoot = MerkleStateManager.prototype.setStateRoot
MerkleStateManager.prototype.setStateRoot = (): any => {}
const _originalStateManagerCopy = MerkleStateManager.prototype.shallowCopy
MerkleStateManager.prototype.shallowCopy = function () {
  return this
}

describe('ETH requests', () => {
  let server: MockServer
  let service: FullEthereumService
  let peer: any

  beforeAll(async () => {
    ;[server, service] = await setup()
    peer = await server.accept('peer0')
  }, 20000)

  it('should handle getBlockHeaders', async () => {
    const hash = hexToBytes('0xa321d27cd2743617c1c1b0d7ecb607dd14febcdfca8f01b79c3f0249505ea069')
    const [reqId1, headers] = await peer.eth!.getBlockHeaders({ block: BigInt(1), max: 2 })
    assert.equal(reqId1, BigInt(1), 'handled GetBlockHeaders')
    assert.ok(equalsBytes(headers![1].hash(), hash), 'handled GetBlockHeaders')
  })

  it('should handle getBlockBodies', async () => {
    const hash = hexToBytes('0xa321d27cd2743617c1c1b0d7ecb607dd14febcdfca8f01b79c3f0249505ea069')
    const [reqId2, bodies] = await peer.eth!.getBlockBodies({ hashes: [hash] })
    assert.equal(reqId2, BigInt(2), 'handled GetBlockBodies')
    assert.deepEqual(bodies, [[[], []]], 'handled GetBlockBodies')
  })

  it('should handle newBlockHashes', () => {
    return new Promise<void>((resolve) => {
      const hash = hexToBytes('0xa321d27cd2743617c1c1b0d7ecb607dd14febcdfca8f01b79c3f0249505ea069')
      void service.config.events.once(Event.PROTOCOL_MESSAGE).then((msg) => {
        assert.equal(msg.messageDetails.name, 'NewBlockHashes')
        resolve()
      })
      peer.eth!.send('NewBlockHashes', [[hash, BigInt(2)]])
    })
  })

  it('should handle NewBlock', () => {
    return new Promise<void>((resolve) => {
      const block = createBlock(
        {
          header: {
            number: 1,
            difficulty: 1,
          },
        },
        { common: config.chainCommon },
      )
      void service.config.events.once(Event.PROTOCOL_MESSAGE).then((msg) => {
        assert.equal(msg.messageDetails.name, 'NewBlock')
        resolve()
      })
      peer.eth!.send('NewBlock', [block, BigInt(1)])
    })
  })

  it('should handle GetPooledTransactions', async () => {
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
    assert.ok(equalsBytes(txs[0].hash(), tx.hash()), 'handled GetPooledTransactions')
  })

  it('should handle Transactions', () => {
    return new Promise<void>((resolve) => {
      const txData =
        '0x02f901100180843b9aca00843b9aca008402625a0094cccccccccccccccccccccccccccccccccccccccc830186a0b8441a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a0afb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9a0479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64'
      const tx = createFeeMarket1559TxFromRLP(toBytes(txData))
      void service.config.events.once(Event.PROTOCOL_MESSAGE).then((msg) => {
        assert.equal(msg.messageDetails.name, 'Transactions')
        resolve()
      })
      peer.eth!.send('Transactions', [tx])
    })
  })
}, 25000)
