import * as tape from 'tape'
import Blockchain from '@ethereumjs/blockchain'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Block } from '@ethereumjs/block'
import { Account, toBuffer } from '@ethereumjs/util'
import { Config } from '../../lib/config'
import { FullEthereumService } from '../../lib/service'
import { Event } from '../../lib/types'
import MockServer from './mocks/mockserver'
import MockChain from './mocks/mockchain'
import { destroy } from './util'

const config = new Config()

tape('[Integration:FullEthereumService]', async (t) => {
  async function setup(): Promise<[MockServer, FullEthereumService]> {
    const server = new MockServer({ config })
    const blockchain = await Blockchain.create({
      common: config.chainCommon,
      validateBlocks: false,
      validateConsensus: false,
    })
    const chain = new MockChain({ config, blockchain })
    const serviceConfig = new Config({ servers: [server as any], lightserv: true })
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

  t.test('should handle ETH requests', async (t) => {
    t.plan(8)
    const [server, service] = await setup()
    const peer = await server.accept('peer0')
    const [reqId1, headers] = await peer.eth!.getBlockHeaders({ block: BigInt(1), max: 2 })
    const hash = Buffer.from(
      'a321d27cd2743617c1c1b0d7ecb607dd14febcdfca8f01b79c3f0249505ea069',
      'hex'
    )
    t.equal(reqId1, BigInt(1), 'handled GetBlockHeaders')
    t.ok(headers![1].hash().equals(hash), 'handled GetBlockHeaders')
    const res = await peer.eth!.getBlockBodies({ hashes: [hash] })
    const [reqId2, bodies] = res
    t.equal(reqId2, BigInt(2), 'handled GetBlockBodies')
    t.deepEquals(bodies, [[[], []]], 'handled GetBlockBodies')
    service.config.events.on(Event.PROTOCOL_MESSAGE, async (msg) => {
      switch (msg.name) {
        case 'NewBlockHashes': {
          t.pass('handled NewBlockHashes')
          break
        }
        case 'NewBlock': {
          t.pass('handled NewBlock')
          await destroy(server, service)
          break
        }
      }
    })
    peer.eth!.send('NewBlockHashes', [[hash, BigInt(2)]])

    const block = Block.fromBlockData(
      {
        header: {
          number: 1,
          difficulty: 1,
        },
      },
      { common: config.chainCommon }
    )
    peer.eth!.send('NewBlock', [block, BigInt(1)])

    const txData =
      '0x02f901100180843b9aca00843b9aca008402625a0094cccccccccccccccccccccccccccccccccccccccc830186a0b8441a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a0afb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9a0479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64'
    const tx = FeeMarketEIP1559Transaction.fromSerializedTx(toBuffer(txData))
    await service.execution.vm.stateManager.putAccount(
      tx.getSenderAddress(),
      new Account(BigInt(0), BigInt('40000000000100000'))
    )
    await service.txPool.add(tx)
    const [_, txs] = await peer.eth!.getPooledTransactions({ hashes: [tx.hash()] })
    t.equal(
      txs[0].hash().toString('hex'),
      tx.hash().toString('hex'),
      'handled GetPooledTransactions'
    )

    peer.eth!.send('Transactions', [tx])
    t.pass('handled Transactions')
  })

  t.test('should handle LES requests', async (t) => {
    const [server, service] = await setup()
    const peer = await server.accept('peer0')
    const { headers } = await peer.les!.getBlockHeaders({ block: BigInt(1), max: 2 })
    t.equals(
      headers[1].hash().toString('hex'),
      'a321d27cd2743617c1c1b0d7ecb607dd14febcdfca8f01b79c3f0249505ea069',
      'handled GetBlockHeaders'
    )
    await destroy(server, service)
  })
})
