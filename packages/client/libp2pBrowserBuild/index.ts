import { Blockchain } from '@ethereumjs/blockchain'
import { Chain, Common } from '@ethereumjs/common'
import debug from 'debug'
import { Level } from 'level'

import { EthereumClient } from '../src/client'
import { Config } from '../src/config'
import { LevelDB } from '../src/execution/level'
import { parseMultiaddrs } from '../src/util'

import { getLogger } from './logging'
// Blockchain
export * from '../src/blockchain/chain'

// Peer
export * from '../src/net/peer/libp2ppeer'
export * from '../src/net/peer/peer'
export * from './libp2pnode'

// Peer Pool
export * from '../src/net/peerpool'

// Protocol
export * from '../src/net/protocol/ethprotocol'
export * from '../src/net/protocol/flowcontrol'
export * from '../src/net/protocol/lesprotocol'
export * from '../src/net/protocol/protocol'

// Server
export * from '../src/net/server/libp2pserver'
export * from '../src/net/server/server'

// EthereumClient
export * from '../src/client'

// Service
export * from '../src/service/fullethereumservice'
export * from '../src/service/lightethereumservice'
export * from '../src/service/service'

// Synchronizer
export * from '../src/sync/fullsync'
export * from '../src/sync/lightsync'
export * from '../src/sync/sync'

// Utilities
export * from '../src/util/parse'

// Logging
export * from './logging'

export async function createClient(args: any) {
  // Turn on `debug` logs, defaults to all client logging
  debug.enable(args.debugLogs ?? '')
  const logger = getLogger({ loglevel: args.loglevel })
  const datadir = args.datadir ?? Config.DATADIR_DEFAULT
  const common = new Common({ chain: args.network ?? Chain.Mainnet })
  const key = await Config.getClientKey(datadir, common)
  const bootnodes = args.bootnodes !== undefined ? parseMultiaddrs(args.bootnodes) : undefined
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
  const chainDB = new Level<string | Uint8Array, string | Uint8Array>(
    `${datadir}/${common.chainName()}`
  )

  const blockchain = await Blockchain.create({
    db: new LevelDB(chainDB),
    common: config.chainCommon,
    hardforkByHeadBlockNumber: true,
    validateBlocks: true,
    validateConsensus: false,
  })
  return EthereumClient.create({ config, blockchain, chainDB })
}

export async function run(args: any) {
  const client = await createClient(args)
  await client.open()
  await client.start()
  return client
}
