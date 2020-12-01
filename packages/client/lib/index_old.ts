/**
 * Define a library component for lazy loading. Borrowed from
 * https://github.com/bcoin-org/bcoin/blob/master/lib/bcoin.js
 * @param  {string} name
 * @param  {string} path
 */
exports.define = function define(name: string, path: string) {
  let cache: any = null
  Object.defineProperty(exports, name, {
    enumerable: true,
    get() {
      if (!cache) {
        cache = require(path)
      }
      return cache
    },
  })
}

// Blockchain
exports.define('blockchain', './blockchain')
exports.define('Chain', './blockchain/chain')

// Handler
exports.define('handler', './handler')
exports.define('Handler', './handler/handler')
exports.define('EthHandler', './handler/ethhandler')
exports.define('LesHandler', './handler/leshandler')

// Peer
exports.define('peer', './net/peer')
exports.define('Peer', './net/peer/peer')
exports.define('RlpxPeer', './net/peer/rlpxpeer')
exports.define('Libp2pPeer', './net/peer/libp2ppeer')

// Peer Pool
exports.define('PeerPool', './net/peerpool')

// Protocol
exports.define('protocol', './net/protocol')
exports.define('Protocol', './net/protocol/protocol')
exports.define('EthProtocol', './net/protocol/ethprotocol')
exports.define('LesProtocol', './net/protocol/lesprotocol')
exports.define('FlowControl', './net/protocol/flowcontrol')

// Server
exports.define('server', './net/server')
exports.define('Server', './net/server/server')
exports.define('RlpxServer', './net/server/rlpxserver')
exports.define('Libp2pServer', './net/server/libp2pserver')

// EthereumClient
exports.define('EthereumClient', './client')

// RPC Manager
exports.define('RPCManager', './rpc')

// Config
exports.define('Config', 'config')

// Service
exports.define('service', './service')
exports.define('Service', './service/service')
exports.define('EthereumService', './service/ethereumservice')

// Synchronizer
exports.define('sync', './sync')
exports.define('Synchronizer', './sync/sync')
exports.define('FullSynchronizer', './sync/fullsync')
exports.define('LightSynchronizer', './sync/lightsync')

// Utilities
exports.define('util', './util')

// Logging
exports.define('logging', './logging')

export = exports
