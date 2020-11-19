import Common from '@ethereumjs/common'
const level = require('level')

// Blockchain
export * from '../lib/blockchain/chain'

// Peer
export * from '../lib/net/peer/peer'
export * from '../lib/net/peer/libp2ppeer'
export * from './libp2pnode'

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

// Node
export * from '../lib/node'

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

export function createNode(args: any) {
  const logger = getLogger({ loglevel: args.loglevel })
  const options = {
    common: new Common({ chain: args.network ?? 'mainnet' }),
    servers: [new exports.Libp2pServer({ multiaddrs: [], ...args })],
    syncmode: args.syncmode ?? 'full',
    db: level(args.db ?? 'ethereumjs'),
    logger: logger,
  }
  return new exports.Node(options)
}

export function run(args: any) {
  const node = createNode(args)
  const logger = node.logger
  logger.info('Initializing Ethereumjs client...')
  logger.info(`Connecting to network: ${node.common.chainName()}`)
  node.on('error', (err: any) => logger.error(err))
  node.on('listening', (details: any) => {
    logger.info(`Listener up transport=${details.transport} url=${details.url}`)
  })
  node.on('synchronized', () => {
    logger.info('Synchronized')
  })
  node.open().then(() => {
    logger.info('Synchronizing blockchain...')
    node.start()
  })
  return node
}
