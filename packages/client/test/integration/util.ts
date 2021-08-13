import { Config } from '../../lib/config'
import { FullEthereumService, LightEthereumService } from '../../lib/service'
import MockServer from './mocks/mockserver'
import MockChain from './mocks/mockchain'
import Blockchain from '@ethereumjs/blockchain'
import Common from '@ethereumjs/common'

interface SetupOptions {
  location?: string
  height?: number
  interval?: number
  syncmode?: string
  common?: Common
}

export async function setup(
  options: SetupOptions = {}
): Promise<[MockServer, FullEthereumService | LightEthereumService]> {
  const { location, height, interval, syncmode, common } = options
  console.log('starting setup for ', location)
  const loglevel = 'error'
  const lightserv = syncmode === 'full'
  const config = new Config({ loglevel, syncmode, lightserv, common })

  console.log('setting up mockserver')
  const server = new MockServer({ config, location })
  const blockchain = await Blockchain.create({
    validateBlocks: false,
    validateConsensus: false,
  })
  console.log('setting up blockchain')
  const chain = new MockChain({ config, blockchain, height })
  console.log('finished setting up mockchain')
  const servers = [server] as any
  const serviceConfig = new Config({
    loglevel,
    syncmode,
    servers,
    lightserv,
    minPeers: 1,
    common: common,
  })
  //@ts-ignore -- attach server eventbus to ethereums service eventbus (to simulate centralized client eventbus))
  server.config.events = serviceConfig.events
  const serviceOpts = {
    config: serviceConfig,
    chain,
    interval: interval ?? 10,
  }

  let service
  if (syncmode === 'light') {
    service = new LightEthereumService(serviceOpts)
  } else {
    service = new FullEthereumService({
      ...serviceOpts,
      lightserv: true,
    })
  }
  console.log('opening service')
  await service.open()
  if ('execution' in service.synchronizer) {
    service.synchronizer.execution.syncing = false
  }
  console.log('starting service')
  await service.start()
  console.log('starting server')
  await server.start()

  return [server, service]
}

export async function destroy(
  server: MockServer,
  service: FullEthereumService | LightEthereumService
): Promise<void> {
  await server.stop()
  await service.stop()
}

export async function wait(delay: number) {
  await new Promise((resolve) => setTimeout(resolve, delay))
}
