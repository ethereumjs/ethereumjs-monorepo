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
    this.running = false
    this.pool.on(this.event, (message, peer) => {
      if (this.running) {
        this.handle(message, peer)
      }
    })
  }

  /**
   * Message event to listen for
   * @return {string} name of message event
   */
  get event () {
    throw new Error('Unimplemented')
  }

  /**
   * Start handler
   */
  start () {
    this.running = true
  }

  /**
   * Stop handler
   */
  stop () {
    this.running = false
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
