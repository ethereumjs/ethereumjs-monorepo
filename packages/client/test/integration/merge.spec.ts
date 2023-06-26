import { BlockHeader } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import {
  Chain as ChainCommon,
  Common,
  ConsensusAlgorithm,
  ConsensusType,
  Hardfork,
} from '@ethereumjs/common'
import { Address, hexStringToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { Chain } from '../../src/blockchain'
import { Config } from '../../src/config'
import { FullEthereumService } from '../../src/service'
import { Event } from '../../src/types'

import { MockServer } from './mocks/mockserver'
import { destroy, setup } from './util'

import type { CliqueConsensus } from '@ethereumjs/blockchain'

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
        { name: 'chainstart', block: 0 },
        { name: 'london', block: 0 },
        {
          name: 'paris',
          block: null,
          forkHash: null,
          ttd: BigInt(5),
        },
      ],
    },
    { baseChain: ChainCommon.Goerli, hardfork: Hardfork.London }
  )
  const commonPoW = Common.custom(
    {
      genesis: {
        gasLimit: 16777216,
        difficulty: 1,
        nonce: '0x0000000000000042',
        extraData: '0x3535353535353535353535353535353535353535353535353535353535353535',
      },
      hardforks: [
        { name: 'chainstart', block: 0 },
        { name: 'london', block: 0 },
        {
          name: 'paris',
          block: null,
          forkHash: null,
          ttd: BigInt(1000),
        },
      ],
    },
    { baseChain: ChainCommon.Ropsten, hardfork: Hardfork.London }
  )
  const accounts: [Address, Uint8Array][] = [
    [
      new Address(hexStringToBytes('0b90087d864e82a284dca15923f3776de6bb016f')),
      hexStringToBytes('64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993'),
    ],
  ]
  async function minerSetup(common: Common): Promise<[MockServer, FullEthereumService]> {
    const config = new Config({ common, accountCache: 10000, storageCache: 1000 })
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
    const chain = await Chain.create({ config: serviceConfig, blockchain })
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
    BlockHeader.prototype._consensusFormatValidation = () => {} //stub
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
    await remoteService.synchronizer!.start()
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
        if (terminalHeight === undefined || terminalHeight === BigInt(0)) {
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
      if (
        typeof terminalHeight === 'bigint' &&
        terminalHeight !== BigInt(0) &&
        terminalHeight < height
      ) {
        t.fail('chain should not exceed merge terminal block')
      }
    })
    await remoteService.synchronizer!.start()
    await new Promise(() => {}) // resolves once t.end() is called
  })
})
