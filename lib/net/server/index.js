'use strict'

exports.Server = require('./server')
exports.RlpxServer = require('./rlpxserver')
exports.Libp2pServer = require('./libp2pserver')

/**
 * @module net/server
 */

const servers = {
  'rlpx': exports.RlpxServer,
  'libp2p': exports.Libp2pServer
}

exports.fromName = function (name) {
  return servers[name]
}
