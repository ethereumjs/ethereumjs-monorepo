'use strict'

const Fetcher = require('./fetcher')
const Block = require('ethereumjs-block')
const { BlockPool } = require('../blockchain')
const BN = require('ethereumjs-util').BN

const defaultOptions = {
  maxPerRequest: 128
}

/**
 * Implements an eth/62 based block fetcher
 * @memberof module:sync
 */
class BlockFetcher extends Fetcher {
  /**
   * Create new block fetcher
   * @param {Object}       options constructor parameters
   * @param {PeerPool}     options.pool peer pool
   * @param {Chain}        options.chain blockchain
   * @param {number}       [options.maxPerRequest=128] max items per request
   * @param {Logger}       [options.logger] Logger instance
   */
  constructor (options) {
    super(options)
    options = {...defaultOptions, ...options}
    this.chain = options.chain
    this.blockPool = new BlockPool({
      logger: this.logger,
      chain: this.chain
    })

    this.maxPerRequest = options.maxPerRequest
  }

  /**
   * Open block fetcher. Must be called before fetcher is started
   * @return {Promise}
   */
  async open () {
    if (this.opened) {
      return false
    }
    await this.blockPool.open()
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
   * Fetches blocks for the given task
   * @param  {Object} task
   * @param  {Peer} peer
   * @return {Promise} method must return
   */
  async fetch (task, peer) {
    let count = task.last.sub(task.first).addn(1)
    if (count.gtn(this.maxPerRequest)) {
      count = this.maxPerRequest
    } else {
      count = count.toNumber()
    }
    const headers = await peer.eth.getBlockHeaders({ block: task.first, max: count })
    const bodies = await peer.eth.getBlockBodies(headers.map(h => h.hash()))
    const blocks = bodies.map((body, i) => new Block([headers[i]].concat(body)))
    return { blocks }
  }

  /**
   * Process fetch reply
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

    const { blocks } = reply
    const { task } = entry
    if (!blocks || blocks.length === 0) {
      this.add(task)
    } else {
      const last = new BN(blocks[blocks.length - 1].header.number)
      if (last.lt(task.last)) {
        this.add({ first: last.addn(1), last: task.last })
      }
      this.blockPool.add(blocks).catch(error => {
        this.logger.error(`Block fetch error, trying again: ${error.stack}`)
        this.add({
          first: new BN(blocks[0].header.number),
          last: new BN(blocks[blocks.length - 1].header.number)
        })
      })
    }
  }

  fetchable (peer) {
    return peer.eth && !peer.inbound
  }
}

module.exports = BlockFetcher
