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

tape('[Integration:Merge]', async (t) => {
  const commonPoA = Common.custom(
    {
      consensus: {
        type: ConsensusType.ProofOfAuthority,
        algorithm: ConsensusAlgorithm.Clique,
        clique: {
          period: 1, // use 1s period for quicker test execution
          epoch: 30000,
        },
      },
      hardforks: [
        { name: 'london', block: 0 },
        {
          name: 'merge',
          block: null,
          forkHash: null,
          td: 5,
        },
      ],
    },
    { baseChain: ChainCommon.Goerli }
  )
  // set genesis stateRoot for this custom common
  // that's derived after generateCanonicalGenesis()
  ;(commonPoA as any)._chainParams['genesis'].stateRoot =
    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
  const commonPoW = Common.custom(
    {
      genesis: {
        hash: '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d',
        timestamp: null,
        gasLimit: 16777216,
        difficulty: 1,
        nonce: '0x0000000000000042',
        extraData: '0x3535353535353535353535353535353535353535353535353535353535353535',
        stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      },
      hardforks: [
        { name: 'london', block: 0 },
        {
          name: 'merge',
          block: null,
          forkHash: null,
          td: 1000,
        },
      ],
    },
    { baseChain: ChainCommon.Ropsten, hardfork: Hardfork.London }
  )
  const accounts: [Address, Buffer][] = [
    [
      new Address(Buffer.from('0b90087d864e82a284dca15923f3776de6bb016f', 'hex')),
      Buffer.from('64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993', 'hex'),
    ],
  ]
  async function minerSetup(common: Common): Promise<[MockServer, FullEthereumService]> {
    const config = new Config({ common })
    const server = new MockServer({ config })
    const blockchain = await Blockchain.create({
      common,
      validateBlocks: false,
      validateConsensus: false,
    })
    ;(blockchain.consensus as CliqueConsensus).cliqueActiveSigners = () => [accounts[0][0]] // stub
    const serviceConfig = new Config({
      common,
      servers: [server as any],
      mine: true,
      accounts,
    })
    const chain = new Chain({ config: serviceConfig, blockchain })
    // attach server to centralized event bus
    ;(server.config as any).events = serviceConfig.events
    const service = new FullEthereumService({
      config: serviceConfig,
      chain,
    })
    await service.open()
    await server.start()
    await service.start()
    return [server, service]
  }

  t.test('should mine and stop at the merge (PoA)', async (t) => {
    const [server, service] = await minerSetup(commonPoA)
    const [remoteServer, remoteService] = await setup({
      location: '127.0.0.2',
      height: 0,
      common: commonPoA,
    })
    ;(remoteService.chain.blockchain.consensus as CliqueConsensus).cliqueActiveSigners = () => [
      accounts[0][0],
    ] // stub
    await server.discover('remotePeer1', '127.0.0.2')
    const targetTTD = BigInt(5)
    remoteService.config.events.on(Event.SYNC_SYNCHRONIZED, async () => {
      const { td } = remoteService.chain.headers
      if (td === targetTTD) {
        t.equal(
          remoteService.chain.headers.td,
          targetTTD,
          'synced blocks to the merge successfully'
        )
        // Make sure the miner has stopped
        t.notOk(service.miner!.running, 'miner should not be running')
        await destroy(server, service)
        await destroy(remoteServer, remoteService)
        t.end()
      }
      if (td > targetTTD) {
        t.fail('chain should not exceed merge TTD')
      }
    })
    await remoteService.synchronizer.start()
    await new Promise(() => {}) // resolves once t.end() is called
  })

  t.test('should mine and stop at the merge (PoW)', async (t) => {
    const [server, service] = await minerSetup(commonPoW)
    const [remoteServer, remoteService] = await setup({
      location: '127.0.0.2',
      height: 0,
      common: commonPoW,
    })
    await server.discover('remotePeer1', '127.0.0.2')
    const targetTTD = BigInt(1000)
    let terminalHeight: bigint | undefined
    remoteService.config.events.on(Event.CHAIN_UPDATED, async () => {
      const { height, td } = remoteService.chain.headers
      if (td > targetTTD) {
        if (!terminalHeight) {
          terminalHeight = height
        }
        t.equal(
          remoteService.chain.headers.height,
          terminalHeight,
          'synced blocks to the merge successfully'
        )
        // Make sure the miner has stopped
        t.notOk(service.miner!.running, 'miner should not be running')
        await destroy(server, service)
        await destroy(remoteServer, remoteService)
        t.end()
      }
      if (terminalHeight && terminalHeight < height) {
        t.fail('chain should not exceed merge terminal block')
      }
    })
    await remoteService.synchronizer.start()
    await new Promise(() => {}) // resolves once t.end() is called
  })
})
