import tape from 'tape'
import { BN } from 'ethereumjs-util'
import { Config } from '../../lib/config'
import { FullEthereumService } from '../../lib/service'
import MockServer from './mocks/mockserver'
import MockChain from './mocks/mockchain'
import { destroy } from './util'
import Blockchain from '@ethereumjs/blockchain'

tape('[Integration:FullEthereumService]', async (t) => {
  async function setup(
    generateCanonicalGenesis = false
  ): Promise<[MockServer, FullEthereumService]> {
    const loglevel = 'error'
    const config = new Config({ loglevel })
    const server = new MockServer({ config })
    const blockchain = new Blockchain({
      validateBlocks: false,
      validateConsensus: false,
    })
    const chain = new MockChain({ config, blockchain, generateCanonicalGenesis })
    const serviceConfig = new Config({
      loglevel,
      servers: [server as any],
      lightserv: true,
      wit: true,
    })
    const service = new FullEthereumService({
      config: serviceConfig,
      chain,
    })
    // Set syncing to false to skip VM execution
    service.synchronizer.execution.syncing = false
    await service.open()
    await service.start()
    await server.start()
    return [server, service]
  }

  t.test('should handle ETH requests', async (t) => {
    const [server, service] = await setup()
    const peer = await server.accept('peer0')
    const [reqId1, headers] = await peer.eth!.getBlockHeaders({ block: new BN(1), max: 2 })
    const hash = Buffer.from(
      'a321d27cd2743617c1c1b0d7ecb607dd14febcdfca8f01b79c3f0249505ea069',
      'hex'
    )
    t.ok(reqId1.eqn(1), 'handled GetBlockHeaders')
    t.ok(headers![1].hash().equals(hash), 'handled GetBlockHeaders')
    const [reqId2, bodies] = await peer.eth!.getBlockBodies({ hashes: [hash] })
    t.ok(reqId2.eqn(2), 'handled GetBlockBodies')
    t.deepEquals(bodies, [[[], []]], 'handled GetBlockBodies')
    peer.eth!.send('NewBlockHashes', [[hash, new BN(2)]])
    t.pass('handled NewBlockHashes')
    await destroy(server, service)
    t.end()
  })

  t.test('should handle LES requests', async (t) => {
    const [server, service] = await setup()
    const peer = await server.accept('peer0')
    const { headers } = await peer.les!.getBlockHeaders({ block: new BN(1), max: 2 })
    const hash = (await service.chain.getHeaders(new BN(2)))[0].hash()
    t.ok(headers[1].hash().equals(hash), 'handled GetBlockHeaders')
    await destroy(server, service)
    t.end()
  })

  t.test('should handle WIT requests', async (t) => {
    const [server, service] = await setup(true)
    const peer = await server.accept('peer0')
    const block = await service.chain.getLatestBlock()
    const blockHash = block.hash()

    await service.synchronizer.execution.vm.runBlockchain(service.chain.blockchain)

    const result = await peer.wit!.getBlockWitnessHashes({ blockHash })
    t.ok(result.witnessHashes.length > 0, 'handled GetBlockWitnessHashes')
    await destroy(server, service)
    t.end()
  })
})
