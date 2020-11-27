import Common from '@ethereumjs/common'
const level = require('level')

// Blockchain
export * from '../lib/blockchain/chain'

// Peer
export * from '../lib/net/peer/peer'
export * from '../lib/net/peer/libp2ppeer'
export * from './libp2pclient'

// Peer Pool
export * from '../lib/net/peerpool'

// Protocol
export * from '../lib/net/protocol/protocol'
export * from '../lib/net/protocol/ethprotocol'
export * from '../lib/net/protocol/lesprotocol'
export * from '../lib/net/protocol/flowcontrol'

// Server
export * from '../lib/net/server/server'
export * from '../lib/net/server/libp2pserver'

// EthereumClient
export * from '../lib/client'

// Service
export * from '../lib/service/service'
export * from '../lib/service/fullethereumservice'
export * from '../lib/service/lightethereumservice'

// Synchronizer
export * from '../lib/sync/sync'
export * from '../lib/sync/fullsync'
export * from '../lib/sync/lightsync'

// Utilities
export * from '../lib/util'

// Logging
export * from './logging'
import { getLogger } from './logging'

export function createClient(args: any) {
  const logger = getLogger({ loglevel: args.loglevel })
  const options = {
    common: new Common({ chain: args.network ?? 'mainnet' }),
    servers: [new exports.Libp2pServer({ multiaddrs: [], ...args })],
    syncmode: args.syncmode ?? 'full',
    db: level(args.db ?? 'ethereumjs'),
    logger: logger,
  }
  return new exports.EthereumClient(options)
}

export function run(args: any) {
  const client = createClient(args)
  const logger = client.logger
  logger.info('Initializing Ethereumjs client...')
  logger.info(`Connecting to network: ${client.common.chainName()}`)
  client.on('error', (err: any) => logger.error(err))
  client.on('listening', (details: any) => {
    logger.info(`Listener up transport=${details.transport} url=${details.url}`)
  })
  client.on('synchronized', () => {
    logger.info('Synchronized')
  })
  client.open().then(() => {
    logger.info('Synchronizing blockchain...')
    client.start()
  })
  return client
}
