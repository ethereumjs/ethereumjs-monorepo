'use strict'

exports.Server = require('./server')
exports.RlpxServer = require('./rlpxserver')

/**
 * @module net/server
 */

const servers = {
  'rlpx': exports.RlpxServer
}

Object.assign(exports.Server, {
  fromName (name) {
    return servers[name]
  }
})
