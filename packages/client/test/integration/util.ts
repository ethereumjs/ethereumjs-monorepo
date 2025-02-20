import { CliqueConsensus, createBlockchain } from '@ethereumjs/blockchain'
import { type Common, ConsensusAlgorithm } from '@ethereumjs/common'
import { MemoryLevel } from 'memory-level'

import { Config } from '../../src/config.js'
import { FullEthereumService } from '../../src/service/index.js'
import { Event } from '../../src/types.js'

import { MockChain } from './mocks/mockchain.js'
import { MockServer } from './mocks/mockserver.js'

import type { SyncMode } from '../../src/config.js'
import type { ConsensusDict } from '@ethereumjs/blockchain'

interface SetupOptions {
  location?: string
  height?: number
  interval?: number
  syncmode?: SyncMode
  minPeers?: number
  common?: Common
}

export async function setup(
  options: SetupOptions = {},
): Promise<[MockServer, FullEthereumService]> {
  const { location, height, interval, syncmode } = options
  const minPeers = options.minPeers ?? 1

  const common = options.common?.copy()
  const config = new Config({
    syncmode,

    minPeers,
    common,
    safeReorgDistance: 0,
    accountCache: 10000,
    storageCache: 1000,
  })

  const server = new MockServer({ config, location }) as any
  const consensusDict: ConsensusDict = {}
  consensusDict[ConsensusAlgorithm.Clique] = new CliqueConsensus()
  const blockchain = await createBlockchain({
    validateBlocks: false,
    validateConsensus: false,
    consensusDict,
    common,
  })

  const chain = new MockChain({ config, blockchain, height })

  const serviceConfig = new Config({
    syncmode,
    server,

    minPeers,
    common,
    safeReorgDistance: 0,
  })
  // attach server to centralized event bus
  server.config.events = serviceConfig.events
  const serviceOpts = {
    config: serviceConfig,
    chain,
    interval: interval ?? 500, // do not make this too low, this will otherwise cause side effects
  }

  const service = new FullEthereumService({
    ...serviceOpts,
    metaDB: new MemoryLevel(),
  })

  await service.open()
  await service.start()
  await server.start()

  return [server, service]
}

export async function destroy(server: MockServer, service: FullEthereumService): Promise<void> {
  service.config.events.emit(Event.CLIENT_SHUTDOWN)
  await server.stop()
  await service.stop()
}

export async function wait(delay: number) {
  await new Promise((resolve) => setTimeout(resolve, delay))
}
