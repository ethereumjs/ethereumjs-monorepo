'use strict'

const Synchronizer = require('./sync')
const Fetcher = require('./fetcher')
const { HeaderPool } = require('../blockchain')
const BN = require('ethereumjs-util').BN
const { defaultLogger } = require('../logging')

const defaultOptions = {
  logger: defaultLogger
}

const maxPerRequest = 192
const refreshInterval = 1000

async function timeout (delay) {
  await new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * Implements an ethereum light sync synchronizer
 * @memberof module:sync
 */
class LightSynchronizer extends Synchronizer {
  /**
   * Create new node
   * @param {Object}      options constructor parameters
   * @param {PeerPool}    options.pool peer pool
   * @param {Chain}       options.chain blockchain
   * @param {FlowControl} options.flow flow control manager
   * @param {Logger}      [options.logger] Logger instance
   */
  constructor (options) {
    super(options)
    options = {...defaultOptions, ...options}

    this.logger = options.logger
    this.pool = options.pool
    this.chain = options.chain
    this.flow = options.flow
    this.running = false
    this.synchronized = false
    this.init()
  }

  init () {
    this.pool.on('message:les', (message, peer) => this.handle(message, peer))
  }

  /**
   * Find an origin peer that contains the highest total difficulty. We will
   * synchronize to this peer's blockchain. Returns a promise that resolves once
   * an origin peer is found.
   * @return {Promise} [description]
   */
  async origin () {
    let best
    let height
    while (!height) {
      await timeout(refreshInterval)
      if (!this.pool.peers.length) {
        continue
      }
      for (let peer of this.pool.peers) {
        const td = peer.les.status.headTd
        if ((!best && td.gt(this.chain.headers.td)) ||
            (best && best.les.status.headTd.lt(td))) {
          best = peer
        }
      }
      try {
        if (best) {
          height = best.les.status.headNum
        }
      } catch (error) {
        this.pool.ban(best)
        this.logger.debug(`Error getting peer height: ${best} ${error.stack}`)
      }
    }
    return [best, height]
  }

  /**
   * Fetch all headers with block numbers ranging from first to last. Returns a
   * promise that resolves once all headers are downloaded.
   * @param  {BN}  first number of first block header
   * @param  {BN}  last number of last block header
   * @return {Promise}
   */
  async fetch (first, last) {
    const headerFetcher = new HeaderFetcher({
      pool: this.pool,
      flow: this.flow,
      logger: this.logger
    })
    const headerPool = new HeaderPool({
      logger: this.logger,
      chain: this.chain
    })

    await headerPool.open()
    headerFetcher.on('headers', async (headers) => {
      if (!this.running) {
        return
      }
      try {
        await headerPool.add(headers)
      } catch (error) {
        this.logger.error(`Header fetch error, trying again: ${error.stack}`)
        headerFetcher.add({
          first: new BN(headers[0].number),
          last: new BN(headers[headers.length - 1].number)
        })
      }
    })
    headerFetcher.on('error', (error, task, peer) => {
      this.logger.debug(`Error processing task ${JSON.stringify(task)} with peer ${peer}: ${error.stack}`)
    })
    headerFetcher.add({ first, last })
    headerFetcher.start()

    while (this.running && (headerFetcher.running || headerPool.size)) {
      await timeout(refreshInterval)
    }
    if (!this.running && headerFetcher.running) {
      await headerFetcher.stop()
    }
  }

  /**
   * Handler for incoming requests from connected peers
   * @param  {Object}  message message object
   * @param  {Peer}    peer peer
   * @return {Promise}
   */
  async handle (message, peer) {
    try {
      if (!this.chain.opened) {
        await this.chain.open()
      }

      if (message.name === 'GetBlockHeaders') {
        const { reqId, block, max, skip, reverse } = message.data
        const bv = this.flow.handleRequest(peer, message.name, max)
        if (bv < 0) {
          this.pool.ban(peer, 300000)
          this.logger.debug(`Dropping peer for violating flow control ${peer}`)
        } else {
          const headers = await this.chain.getHeaders(block, max, skip, reverse)
          peer.les.send('BlockHeaders', { reqId, bv, headers })
        }
      } else if (message.name === 'Announce') {
        const { headNumber, reorgDepth } = message.data
        // TO DO: handle re-orgs
        if (this.synchronized && this.chain.headers.height.lt(headNumber) && !reorgDepth) {
          this.synchronized = false
          await this.fetch(this.chain.headers.height.addn(1), headNumber)
          this.synchronized = true
        }
      }
    } catch (error) {
      this.emit('error', error)
    }
  }

  /**
   * Synchronize blockchain. Returns a promise that resolves once chain is
   * synchronized
   * @return {Promise}
   */
  async start () {
    if (this.running) {
      return false
    }
    this.running = true
    await this.chain.open()
    await this.pool.open()
    const number = this.chain.headers.height.toString(10)
    const td = this.chain.headers.td.toString(10)
    const hash = this.chain.headers.latest.hash().toString('hex').slice(0, 8) + '...'
    this.logger.info(`Latest local header: number=${number} td=${td} hash=${hash}`)
    const [ origin, height ] = await this.origin()
    this.logger.info(`Using origin peer: ${origin.toString(true)} height=${height.toString(10)}`)
    await this.fetch(this.chain.headers.height.addn(1), height)
    this.synchronized = true
    this.emit('synchronized')
  }

  /**
   * Stop synchronization. Returns a promise that resolves once its stopped.
   * @return {Promise}
   */
  async stop () {
    if (!this.running) {
      return false
    }
    this.running = false
    await timeout(refreshInterval)
  }
}

/**
 * Implements an les/1 based header fetcher
 * @memberof module:sync
 */
class HeaderFetcher extends Fetcher {
  /**
   * Create new header fetcher
   * @param {Object}      options constructor parameters
   * @param {PeerPool}    options.pool peer pool
   * @param {FlowControl} options.flow flow control manager
   * @param {Logger}      [options.logger] Logger instance
   */
  constructor (options) {
    super(options)
    this.flow = options.flow
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
      this.flow.maxRequestCount(peer, 'GetBlockHeaders'),
      maxPerRequest
    )
    if (maxCount === 0) {
      // we reached our request limit
      await timeout(1000)
      return false
    }
    let count = task.last.sub(task.first).addn(1)
    if (count.gtn(maxCount)) {
      count = maxCount
    } else {
      count = count.toNumber()
    }
    return peer.les.getBlockHeaders({ block: task.first.toBuffer(), max: count })
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
      this.emit('headers', headers)
    }
  }
}

module.exports = LightSynchronizer
