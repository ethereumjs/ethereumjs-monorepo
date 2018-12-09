'use strict'

const Fetcher = require('./fetcher')
const { HeaderPool } = require('../blockchain')
const BN = require('ethereumjs-util').BN

const defaultOptions = {
  maxPerRequest: 192
}

/**
 * Implements an les/1 based header fetcher
 * @memberof module:sync
 */
class HeaderFetcher extends Fetcher {
  /**
   * Create new header fetcher
   * @param {Object}       options constructor parameters
   * @param {PeerPool}     options.pool peer pool
   * @param {FlowControl}  options.flow flow control manager
   * @param {Chain}        options.chain blockchain
   * @param {number}       [options.maxPerRequest=192] max items per request
   * @param {Logger}       [options.logger] Logger instance
   */
  constructor (options) {
    super(options)
    options = {...defaultOptions, ...options}
    this.flow = options.flow
    this.chain = options.chain
    this.headerPool = new HeaderPool({
      logger: this.logger,
      chain: this.chain
    })
    this.maxPerRequest = options.maxPerRequest
  }

  /**
   * Open header fetcher. Must be called before fetcher is started
   * @return {Promise}
   */
  async open () {
    if (this.opened) {
      return false
    }
    await this.headerPool.open()
    return super.open()
  }

  /**
   * Prioritizes tasks based on first block number
   * @param  {Object}  taskOne
   * @param  {Object}  taskTwo
   * @return {boolean} true if taskOne has a lower first number than taskTwo
   */
  before (taskOne, taskTwo) {
    return taskOne.first.lt(taskTwo.first)
  }

  /**
   * Fetches block headers for the given task
   * @param  {Object} task
   * @param  {Peer} peer
   * @return {Promise} method must return
   */
  async fetch (task, peer) {
    const maxCount = Math.min(
      this.flow.maxRequestCount(peer, 'GetBlockHeaders'), this.maxPerRequest
    )
    if (maxCount === 0) {
      // we reached our request limit
      await this.wait()
      return false
    }
    let count = task.last.sub(task.first).addn(1)
    if (count.gtn(maxCount)) {
      count = maxCount
    } else {
      count = count.toNumber()
    }
    return peer.les.getBlockHeaders({ block: task.first, max: count })
  }

  /**
   * Process the getBlockHeaders reply
   * @param  {Object} entry entry object
   * @param  {Object} entry.task fetch task
   * @param  {Peer}   entry.peer peer that handled task
   * @param  {number} entry.time time task was generated
   * @param  {Object} reply reply data
   * @emits  headers
   */
  process (entry, reply) {
    if (!this.running) {
      return
    }

    const { bv, headers } = reply
    const { task, peer } = entry
    if (!headers || headers.length === 0) {
      this.add(task)
    } else {
      const last = new BN(headers[headers.length - 1].number)
      if (last.lt(task.last)) {
        this.add({ first: last.addn(1), last: task.last })
      }
      this.flow.handleReply(peer, bv)
      this.headerPool.add(headers).catch(error => {
        this.logger.error(`Header fetch error, trying again: ${error.stack}`)
        this.add({
          first: new BN(headers[0].number),
          last: new BN(headers[headers.length - 1].number)
        })
      })
    }
  }

  fetchable (peer) {
    return peer.les && peer.les.status.serveHeaders && !peer.inbound
  }
}

module.exports = HeaderFetcher
