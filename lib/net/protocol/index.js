'use strict'

exports.Protocol = require('./protocol')
exports.EthProtocol = require('./ethprotocol')
exports.Sender = require('./sender')
exports.RlpxSender = require('./rlpxsender')

/**
 * @module net/protocol
 */

const protocols = {
  'eth': exports.EthProtocol
}

Object.assign(exports.Protocol, {
  fromName (name) {
    return protocols[name]
  }
})
