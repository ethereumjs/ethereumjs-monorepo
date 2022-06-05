import Common, { Chain } from '@ethereumjs/common'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const level = require('level')

// Blockchain
export * from '../lib/blockchain/chain.js'

// Peer
export * from '../lib/net/peer/peer.js'
export * from '../lib/net/peer/libp2ppeer.js'
export * from './libp2pnode.js'

// Peer Pool
export * from '../lib/net/peerpool.js'

// Protocol
export * from '../lib/net/protocol/protocol.js'
export * from '../lib/net/protocol/ethprotocol.js'
export * from '../lib/net/protocol/lesprotocol.js'
export * from '../lib/net/protocol/flowcontrol.js'

// Server
export * from '../lib/net/server/server.js'
export * from '../lib/net/server/libp2pserver.js'

// EthereumClient
export * from '../lib/client.js'
import EthereumClient from '../lib/client.js'

// Service
export * from '../lib/service/service.js'
export * from '../lib/service/fullethereumservice.js'
export * from '../lib/service/lightethereumservice.js'

// Synchronizer
export * from '../lib/sync/sync.js'
export * from '../lib/sync/fullsync.js'
export * from '../lib/sync/lightsync.js'

// Utilities
export * from '../lib/util/index.js'
import { parseMultiaddrs } from '../lib/util/index.js'
import { Config } from '../lib/config.js'

// Logging
export * from './logging.js'
import { getLogger } from './logging.js'

export async function createClient(args: any) {
  const logger = getLogger({ loglevel: args.loglevel })
  const datadir = args.datadir ?? Config.DATADIR_DEFAULT
  const common = new Common({ chain: args.network ?? Chain.Mainnet })
  const key = await Config.getClientKey(datadir, common)
  const bootnodes = args.bootnodes ? parseMultiaddrs(args.bootnodes) : undefined
  const config = new Config({
    common,
    key,
    transports: ['libp2p'],
    syncmode: args.syncmode,
    bootnodes,
    multiaddrs: [],
    logger,
    maxPerRequest: args.maxPerRequest,
    minPeers: args.minPeers,
    maxPeers: args.maxPeers,
    discDns: false,
  })
  config.events.setMaxListeners(50)
  const chainDB = level(`${datadir}/${common.chainName()}`)
  return new EthereumClient({ config, chainDB })
}

export async function run(args: any) {
  const client = await createClient(args)
  await client.open()
  await client.start()
  return client
}
