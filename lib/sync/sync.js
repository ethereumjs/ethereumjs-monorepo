'use strict'

const EventEmitter = require('events')
const AwaitLock = require('await-lock')
const { defaultLogger } = require('../logging')

const defaultOptions = {
  logger: defaultLogger,
  interval: 1000
}

/**
 * Base class for blockchain synchronizers
 * @memberof module:sync
 */
class Synchronizer extends EventEmitter {
  /**
   * Create new node
   * @param {Object}   options constructor parameters
   * @param {PeerPool} options.pool peer pool
   * @param {Chain}    options.chain blockchain
   * @param {number}   [options.interval] refresh interval
   * @param {Logger}   [options.logger] Logger instance
   */
  constructor (options) {
    super()
    options = {...defaultOptions, ...options}

    this.logger = options.logger
    this.pool = options.pool
    this.chain = options.chain
    this.interval = options.interval
    this.lock = new AwaitLock()
    this.syncing = false

    this.pool.on('added', peer => {
      if (this.fetchable(peer)) {
        this.logger.info(`Found ${this.type} peer: ${peer}`)
      }
    })
  }

  /**
   * Returns synchronizer type
   * @return {string} type
   */
  get type () {
    throw new Error('Unimplemented')
  }

  /**
   * Open synchronizer. Must be called before sync() is called
   * @return {Promise}
   */
  async open () {
  }

  /**
   * Returns true if peer can be used to fetch data
   * @return {boolean}
   */
  fetchable (peer) {
    return true
  }

  /**
   * Synchronize blockchain. Returns a promise that resolves once chain is
   * synchronized
   * @param  {BN} [height] number of last block to fetch. Will be discovered from
   * peers if not specified.
   * @return {Promise}
   */
  async sync (height) {
    if (this.syncing) {
      return false
    }
    await this.lock.acquireAsync()
    this.syncing = true
    try {
      this.emit('synchronized', {
        count: await this.fetch(height),
        type: this.type
      })
    } catch (err) {
      this.emit('error', err)
    } finally {
      this.syncing = false
      this.lock.release()
    }
  }

  /**
   * Stop synchronization. Returns a promise that resolves once its stopped.
   * @return {Promise}
   */
  async stop () {
    if (!this.syncing) {
      return false
    }
    this.syncing = false
    await this.wait()
  }

  async wait (delay) {
    await new Promise(resolve => setTimeout(resolve, delay || this.interval))
  }
}

module.exports = Synchronizer
