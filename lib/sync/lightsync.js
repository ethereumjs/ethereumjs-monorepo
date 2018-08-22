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
   * @param {Object}   options constructor parameters
   * @param {PeerPool} options.pool peer pool
   * @param {Chain}    options.chain blockchain
   * @param {Logger}   [options.logger] Logger instance
   */
  constructor (options) {
    super(options)
    options = {...defaultOptions, ...options}

    this.logger = options.logger
    this.pool = options.pool
    this.chain = options.chain
    this.running = false
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
        this.logger.debug(`Error getting peer height: ${best} ${error}`)
      }
    }
    return [best, height]
  }

  /**
   * Fetch all headers with block numbers ranings from first to last. Returns a
   * promise that resolves once all headers are downloaded.
   * @param  {BN}  first number of first block header
   * @param  {BN}  last number of last block header
   * @return {Promise}
   */
  async fetch (first, last) {
    const headerFetcher = new HeaderFetcher({
      pool: this.pool,
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
      this.logger.debug(`Error processing task ${JSON.stringify(task)} with peer ${peer}: ${error}`)
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
    this.running = false
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
  fetch (task, peer) {
    const mrcBase = peer.les.status.mrc['GetBlockHeaders'].base
    const mrcReq = peer.les.status.mrc['GetBlockHeaders'].req
    const ble = peer.les.ble || peer.les.status.bl
    const maxCount = Math.min(Math.floor((ble - mrcBase) / mrcReq), maxPerRequest)
    let count = task.last.sub(task.first).addn(1)
    if (count.gtn(maxCount)) {
      count = maxCount
    } else {
      count = count.toNumber()
    }
    return peer.les.getBlockHeaders(task.first.toBuffer(), count, 0, 0)
  }

  /**
   * Process the message payload for the getBlockHeaders response
   * @param  {Object} task
   * @param  {Array} payload rlp encoded payload
   * @emits  headers
   */
  process (task, headers) {
    if (!headers || headers.length === 0) {
      this.add(task)
    } else {
      const last = new BN(headers[headers.length - 1].number)
      if (last.lt(task.last)) {
        this.add({ first: last.addn(1), last: task.last })
      }
      this.emit('headers', headers)
    }
  }
}

module.exports = LightSynchronizer
