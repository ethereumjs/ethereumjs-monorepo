import tape from 'tape'
import Blockchain, { CliqueConsensus } from '@ethereumjs/blockchain'
import Common, {
  Chain as ChainCommon,
  ConsensusType,
  ConsensusAlgorithm,
  Hardfork,
} from '@ethereumjs/common'
import { Address } from 'ethereumjs-util'
import { Config } from '../../lib/config'
import { Chain } from '../../lib/blockchain'
import { FullEthereumService } from '../../lib/service'
import { Event } from '../../lib/types'
import MockServer from './mocks/mockserver'
import { setup, destroy } from './util'

tape('[Integration:Miner]', async (t) => {
  const hardforks = new Common({ chain: ChainCommon.Goerli })
    .hardforks()
    .map((h) => (h.name === Hardfork.London ? { ...h, block: 0 } : h))
  const common = Common.custom(
    {
      hardforks,
      consensus: {
        type: ConsensusType.ProofOfAuthority,
        algorithm: ConsensusAlgorithm.Clique,
        clique: {
          period: 1, // use 1s period for quicker test execution
          epoch: 30000,
        },
      },
    },
    { baseChain: ChainCommon.Goerli }
  )
  // set genesis stateRoot for this custom common
  // that's derived after generateCanonicalGenesis()
  ;(common as any)._chainParams['genesis'].stateRoot =
    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
  const accounts: [Address, Buffer][] = [
    [
      new Address(Buffer.from('0b90087d864e82a284dca15923f3776de6bb016f', 'hex')),
      Buffer.from('64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993', 'hex'),
    ],
  ]
  async function minerSetup(): Promise<[MockServer, FullEthereumService]> {
    const config = new Config({ common })
    const server = new MockServer({ config })

    const blockchain = await Blockchain.create({
      common,
      validateBlocks: false,
      validateConsensus: false,
    })
    ;(blockchain.consensus as CliqueConsensus).cliqueActiveSigners = () => [accounts[0][0]] // stub
    const chain = new Chain({ config, blockchain })
    const serviceConfig = new Config({
      common,
      servers: [server as any],
      mine: true,
      accounts,
    })
    // attach chain to centralized event bus
    ;(chain.config as any).events = serviceConfig.events
    const service = new FullEthereumService({
      config: serviceConfig,
      chain,
    })
    service.execution.run = async () => 1 // stub
    await service.open()
    await server.start()
    await service.start()
    return [server, service]
  }

  t.test(
    'should mine blocks while a peer stays connected to tip of chain',
    { timeout: 25000 },
    async (t) => {
      const [server, service] = await minerSetup()
      const [remoteServer, remoteService] = await setup({
        location: '127.0.0.2',
        height: 0,
        common,
      })
      ;(remoteService.chain.blockchain.consensus as CliqueConsensus).cliqueActiveSigners = () => [
        accounts[0][0],
      ] // stub
      ;(remoteService as FullEthereumService).execution.run = async () => 1 // stub
      await server.discover('remotePeer1', '127.0.0.2')
      const targetHeight = BigInt(5)
      remoteService.config.events.on(Event.SYNC_SYNCHRONIZED, async (chainHeight) => {
        if (chainHeight === targetHeight) {
          t.equal(remoteService.chain.blocks.height, targetHeight, 'synced blocks successfully')
          await destroy(server, service)
          await destroy(remoteServer, remoteService)
          t.end()
        }
      })
      await remoteService.synchronizer.start()
      await new Promise(() => {}) // resolves once t.end() is called
    }
  )
})
