'use strict'

const EventEmitter = require('events')
const { defaultLogger } = require('../logging')

const defaultOptions = {
  logger: defaultLogger
}

/**
 * Base class for protocol handlers
 * @memberof module:handler
 */
class Handler extends EventEmitter {
  /**
   * Create new handler
   * @param {Object}      options constructor parameters
   * @param {PeerPool}    options.pool peer pool
   * @param {Chain}       options.chain blockchain
   * @param {Logger}      [options.logger] Logger instance
   */
  constructor (options) {
    super(options)
    options = {...defaultOptions, ...options}

    this.logger = options.logger
    this.pool = options.pool
    this.chain = options.chain
  }

  /**
   * Handles incoming request from connected peer
   * @param  {Object}  message message object
   * @param  {Peer}    peer peer
   * @return {Promise}
   */
  async handle (message, peer) {
  }
}

module.exports = Handler
