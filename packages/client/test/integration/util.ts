import { Blockchain } from '@ethereumjs/blockchain'
import { MemoryLevel } from 'memory-level'

import { Config } from '../../src/config'
import { FullEthereumService, LightEthereumService } from '../../src/service'
import { Event } from '../../src/types'

import { MockChain } from './mocks/mockchain'
import { MockServer } from './mocks/mockserver'

import type { SyncMode } from '../../src/config'
import type { Common } from '@ethereumjs/common'

interface SetupOptions {
  location?: string
  height?: number
  interval?: number
  syncmode?: SyncMode
  minPeers?: number
  common?: Common
}

export async function setup(
  options: SetupOptions = {}
): Promise<[MockServer, FullEthereumService | LightEthereumService]> {
  const { location, height, interval, syncmode } = options
  const minPeers = options.minPeers ?? 1

  const lightserv = syncmode === 'full'
  const common = options.common?.copy()
  const config = new Config({
    syncmode,
    lightserv,
    minPeers,
    common,
    safeReorgDistance: 0,
    accountCache: 10000,
    storageCache: 1000,
  })

  const server = new MockServer({ config, location })
  const blockchain = await Blockchain.create({
    validateBlocks: false,
    validateConsensus: false,
    common,
  })

  const chain = new MockChain({ config, blockchain, height })

  const servers = [server] as any
  const serviceConfig = new Config({
    syncmode,
    servers,
    lightserv,
    minPeers,
    common,
    safeReorgDistance: 0,
  })
  // attach server to centralized event bus
  ;(server.config as any).events = serviceConfig.events
  const serviceOpts = {
    config: serviceConfig,
    chain,
    interval: interval ?? 500, // do not make this too low, this will otherwise cause side effects
  }

  let service
  if (syncmode === 'light') {
    service = new LightEthereumService(serviceOpts)
  } else {
    service = new FullEthereumService({
      ...serviceOpts,
      metaDB: new MemoryLevel(),
      lightserv: true,
    })
  }
  await service.open()
  await service.start()
  await server.start()

  return [server, service]
}

export async function destroy(
  server: MockServer,
  service: FullEthereumService | LightEthereumService
): Promise<void> {
  service.config.events.emit(Event.CLIENT_SHUTDOWN)
  await server.stop()
  await service.stop()
}

export async function wait(delay: number) {
  await new Promise((resolve) => setTimeout(resolve, delay))
}
