'use strict'

const BN = require('ethereumjs-util').BN
const { defaultLogger } = require('../logging')

const defaultOptions = {
  logger: defaultLogger
}

/**
 * Pool of blockchain segment
 * @memberof module:blockchain
 */
class BlockPool {
  /**
   * Create new block pool
   * @param {Object} options constructor parameters
   * @param {Chain} options.chain blockchain
   * @param {Logger} [options.logger] Logger instance
   */
  constructor (options) {
    options = {...defaultOptions, ...options}

    this.logger = options.logger
    this.chain = options.chain
    this.pool = new Map()
    this.init()
  }

  init () {
    this._opened = false
  }

  /**
   * Open block pool and wait for blockchain to open
   * @return {Promise}
   */
  async open () {
    if (this._opened) {
      return
    }
    await this.chain.open()
    this._opened = true
  }

  /**
   * Add a blockchain segment to the pool. Returns a promise that resolves once
   * the segment has been added to the pool. Segments are automatically inserted
   * into the blockchain once prior gaps are filled.
   * @param {Block[]} blocks list of sequential blocks
   * @return {Promise}
   */
  async add (blocks) {
    if (!Array.isArray(blocks)) {
      blocks = [ blocks ]
    }

    let latest = this.chain.height
    let first = new BN(blocks[0].header.number)

    if (first.gt(latest.addn(1))) {
      // if block segment arrived out of order, save it to the pool
      this.pool.set(first.toString(), blocks)
      return
    }
    while (blocks) {
      // otherwise save headers and keep saving headers from header pool in order
      let last = new BN(blocks[blocks.length - 1].header.number)
      let hash = blocks[0].hash().toString('hex').slice(0, 8) + '...'
      await this.chain.add(blocks)
      this.logger.info(`Imported blocks count=${blocks.length} number=${first.toString(10)} hash=${hash}`)
      latest = last
      blocks = this.pool.get(last.addn(1).toString())
      if (blocks) {
        this.pool.delete(last.addn(1).toString())
        first = new BN(blocks[0].header.number)
      }
    }
  }
}

module.exports = BlockPool
