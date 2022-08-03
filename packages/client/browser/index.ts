import { Chain, Common } from '@ethereumjs/common'
import { isTruthy } from '@ethereumjs/util'
import { Level } from 'level'

import { EthereumClient } from '../lib/client'
import { Config } from '../lib/config'
import { parseMultiaddrs } from '../lib/util'
import { getLogger } from './logging'

// Blockchain
export * from '../lib/blockchain/chain'

// Peer
export * from '../lib/net/peer/libp2ppeer'
export * from '../lib/net/peer/peer'
export * from './libp2pnode'

// Peer Pool
export * from '../lib/net/peerpool'

// Protocol
export * from '../lib/net/protocol/ethprotocol'
export * from '../lib/net/protocol/flowcontrol'
export * from '../lib/net/protocol/lesprotocol'
export * from '../lib/net/protocol/protocol'

// Server
export * from '../lib/net/server/libp2pserver'
export * from '../lib/net/server/server'

// EthereumClient
export * from '../lib/client'

// Service
export * from '../lib/service/fullethereumservice'
export * from '../lib/service/lightethereumservice'
export * from '../lib/service/service'

// Synchronizer
export * from '../lib/sync/fullsync'
export * from '../lib/sync/lightsync'
export * from '../lib/sync/sync'

// Utilities
export * from '../lib/util'

// Logging
export * from './logging'

export async function createClient(args: any) {
  const logger = getLogger({ loglevel: args.loglevel })
  const datadir = args.datadir ?? Config.DATADIR_DEFAULT
  const common = new Common({ chain: args.network ?? Chain.Mainnet })
  const key = await Config.getClientKey(datadir, common)
  const bootnodes = isTruthy(args.bootnodes) ? parseMultiaddrs(args.bootnodes) : undefined
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
  const chainDB = new Level<string | Buffer, string | Buffer>(`${datadir}/${common.chainName()}`)
  return new EthereumClient({ config, chainDB })
}

export async function run(args: any) {
  const client = await createClient(args)
  await client.open()
  await client.start()
  return client
}
