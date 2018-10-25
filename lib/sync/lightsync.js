'use strict'

const Synchronizer = require('./sync')
const Fetcher = require('./fetcher')
const { HeaderPool } = require('../blockchain')
const BN = require('ethereumjs-util').BN

const maxPerRequest = 192

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
   * @param {number}      [options.interval] refresh interval
   * @param {Logger}      [options.logger] Logger instance
   */
  constructor (options) {
    super(options)
    this.flow = options.flow
    this.init()
  }

  init () {
    this.pool.on('message:les', (message, peer) => this.handle(message, peer))
  }

  /**
   * Returns true if peer can be used to fetch headers
   * @return {boolean}
   */
  fetchable (peer) {
    return peer.les && peer.les.status.serveHeaders && !peer.inbound
  }

  /**
   * Returns synchronizer type
   * @return {string} type
   */
  get type () {
    return 'light'
  }

  /**
   * Find an origin peer that contains the highest total difficulty. We will
   * synchronize to this peer's blockchain. Returns a promise that resolves once
   * an origin peer is found.
   * @return {Promise} Resolves with [ origin peer, height ]
   */
  async origin () {
    let best
    let height
    while (!height) {
      await this.wait()
      const peers = this.pool.peers.filter(this.fetchable.bind(this))
      if (!peers.length) {
        continue
      }
      for (let peer of this.pool.peers) {
        const td = peer.les.status.headTd
        if ((!best && td.gte(this.chain.headers.td)) ||
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
   * Fetch all headers from current height up to specified number (last). Returns
   * a promise that resolves once all headers are downloaded.
   * @param  {BN} [last] number of last block header to download. If last is not
   * specified, the best height will be used from existing peers.
   * @return {Promise} Resolves with count of number of headers fetched
   */
  async fetch (last) {
    if (!last) {
      const [ origin, height ] = await this.origin()
      this.logger.info(`Using origin peer: ${origin.toString(true)} height=${height.toString(10)}`)
      last = height
    }

    const headerFetcher = new HeaderFetcher({
      pool: this.pool,
      flow: this.flow,
      sync: this,
      logger: this.logger
    })
    const headerPool = new HeaderPool({
      logger: this.logger,
      chain: this.chain
    })
    const first = this.chain.headers.height.addn(1)

    if (first.gt(last)) {
      return 0
    }

    await headerPool.open()
    headerFetcher.on('headers', async (headers) => {
      if (!this.syncing) {
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

    while (this.syncing && (headerFetcher.running || headerPool.size)) {
      await this.wait()
    }
    if (!this.syncing && headerFetcher.running) {
      await headerFetcher.stop()
    }
    return last.sub(first).toNumber() + 1
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

      if (message.name === 'Announce') {
        const { headNumber, reorgDepth } = message.data
        // TO DO: handle re-orgs
        if (reorgDepth) {
          return
        }
        this.sync(headNumber)
      }
    } catch (error) {
      this.emit('error', error)
    }
  }

  /**
   * Open synchronizer. Must be called before sync() is called
   * @return {Promise}
   */
  async open () {
    await this.chain.open()
    await this.pool.open()
    const number = this.chain.headers.height.toString(10)
    const td = this.chain.headers.td.toString(10)
    const hash = this.chain.headers.latest.hash().toString('hex').slice(0, 8) + '...'
    this.logger.info(`Latest local header: number=${number} td=${td} hash=${hash}`)
  }
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
   * @param {Synchronizer} options.sync parent synchronizer
   * @param {Logger}       [options.logger] Logger instance
   */
  constructor (options) {
    super(options)
    this.flow = options.flow
    this.sync = options.sync
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

  fetchable (peer) {
    return this.sync.fetchable(peer)
  }
}

module.exports = LightSynchronizer
