import { Blockchain } from '@ethereumjs/blockchain'
import {
  Chain as ChainCommon,
  Common,
  ConsensusAlgorithm,
  ConsensusType,
  Hardfork,
} from '@ethereumjs/common'
import { Address, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Chain } from '../../src/blockchain'
import { Config } from '../../src/config'
import { FullEthereumService } from '../../src/service'
import { Event } from '../../src/types'

import { MockServer } from './mocks/mockserver'
import { destroy, setup } from './util'

import type { CliqueConsensus } from '@ethereumjs/blockchain'

// Schedule london at 0 and also unset any past scheduled timestamp hardforks that might collide with test
const hardforks = new Common({ chain: ChainCommon.Goerli })
  .hardforks()
  .map((h) =>
    h.name === Hardfork.London
      ? { ...h, block: 0, timestamp: undefined }
      : { ...h, timestamp: undefined }
  )
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
  { baseChain: ChainCommon.Goerli, hardfork: Hardfork.London }
)
const accounts: [Address, Uint8Array][] = [
  [
    new Address(hexToBytes('0x0b90087d864e82a284dca15923f3776de6bb016f')),
    hexToBytes('0x64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993'),
  ],
]
async function minerSetup(): Promise<[MockServer, FullEthereumService]> {
  const config = new Config({ common, accountCache: 10000, storageCache: 1000 })
  const server = new MockServer({ config }) as any

  const blockchain = await Blockchain.create({
    common,
    validateBlocks: false,
    validateConsensus: false,
  })
  ;(blockchain.consensus as CliqueConsensus).cliqueActiveSigners = () => [accounts[0][0]] // stub
  const chain = await Chain.create({ config, blockchain })
  const serviceConfig = new Config({
    common,
    server,
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

describe(
  'should mine blocks while a peer stays connected to tip of chain',
  async () => {
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
    await new Promise((resolve) => {
      remoteService.config.events.on(Event.SYNC_SYNCHRONIZED, async (chainHeight) => {
        if (chainHeight === targetHeight) {
          it('should sync blocks', () => {
            assert.equal(
              remoteService.chain.blocks.height,
              targetHeight,
              'synced blocks successfully'
            )
          })
          await destroy(server, service)
          await destroy(remoteServer, remoteService)
          resolve(undefined)

          void remoteService.synchronizer!.start()
        }
      })
    })
  },
  { timeout: 25000 }
)
