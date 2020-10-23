'use strict'

const Common = require('ethereumjs-common').default
const level = require('level')

// Blockchain
exports.Chain = require('../lib/blockchain/chain')

// Peer
exports.Peer = require('../lib/net/peer/peer')
exports.Libp2pPeer = require('../lib/net/peer/libp2ppeer')
exports.Libp2pNode = require('./libp2pnode')

// Peer Pool
exports.PeerPool = require('../lib/net/peerpool')

// Protocol
exports.Protocol = require('../lib/net/protocol/protocol')
exports.EthProtocol = require('../lib/net/protocol/ethprotocol')
exports.LesProtocol = require('../lib/net/protocol/lesprotocol')
exports.FlowControl = require('../lib/net/protocol/flowcontrol')

// Server
exports.Server = require('../lib/net/server/server')
exports.Libp2pServer = require('../lib/net/server/libp2pserver')

// Node
exports.Node = require('../lib/node')

// Service
exports.Service = require('../lib/service/service')
exports.FastEthereumService = require('../lib/service/fastethereumservice')
exports.LightEthereumService = require('../lib/service/lightethereumservice')

// Synchronizer
exports.Synchronizer = require('../lib/sync/sync')
exports.FastSynchronizer = require('../lib/sync/fastsync')
exports.LightSynchronizer = require('../lib/sync/lightsync')

// Utilities
exports.util = require('../lib/util')

// Logging
exports.logging = require('./logging')

exports.createNode = function (args) {
  const logger = exports.logging.getLogger({ loglevel: args.loglevel })
  const options = {
    common: new Common(args.network || 'mainnet'),
    servers: [new exports.Libp2pServer({ multiaddrs: [], ...args })],
    syncmode: args.syncmode || 'fast',
    db: level(args.db || 'ethereumjs'),
    logger: logger,
  }
  return new exports.Node(options)
}

exports.run = function (args) {
  const node = exports.createNode(args)
  const logger = node.logger
  logger.info('Initializing Ethereumjs client...')
  logger.info(`Connecting to network: ${node.common.chainName()}`)
  node.on('error', (err) => logger.error(err))
  node.on('listening', (details) => {
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
