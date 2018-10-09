'use strict'

const Synchronizer = require('./sync')
const Fetcher = require('./fetcher')
const Block = require('ethereumjs-block')
const { BlockPool } = require('../blockchain')
const BN = require('ethereumjs-util').BN
const { defaultLogger } = require('../logging')

const defaultOptions = {
  logger: defaultLogger
}

const maxPerRequest = 128
const refreshInterval = 1000

async function timeout (delay) {
  await new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * Implements an ethereum fast sync synchronizer
 * @memberof module:sync
 */
class FastSynchronizer extends Synchronizer {
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
    this.synchronized = false
    this.init()
  }

  init () {
    this.pool.on('added', peer => {
      if (peer.eth) {
        this.logger.info(`Found fast peer: ${peer}`)
      }
    })
  }

  /**
   * Request canonical chain height from peer. Returns a promise that resolves
   * to the peer's height once it responds with its latest block header.
   * @param  {Peer}    peer
   * @return {Promise}
   */
  async height (peer) {
    const headers = await peer.eth.getBlockHeaders({block: peer.eth.status.bestHash, max: 1})
    return new BN(headers[0].number)
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
        const td = peer.eth.status.td
        if ((!best && td.gte(this.chain.headers.td)) ||
            (best && best.eth.status.td.lt(td))) {
          best = peer
        }
      }
      try {
        if (best) {
          height = await this.height(best)
        }
      } catch (error) {
        this.pool.ban(best)
        this.logger.debug(`Error getting peer height: ${best} ${error.stack}`)
      }
    }
    return [best, height]
  }

  /**
   * Fetch all blocks with block numbers ranging from first to last. Returns a
   * promise that resolves once all blocks are downloaded.
   * @param  {BN}  first number of first block
   * @param  {BN}  last number of last block
   * @return {Promise}
   */
  async fetch (first, last) {
    const blockFetcher = new BlockFetcher({
      pool: this.pool,
      logger: this.logger
    })
    const blockPool = new BlockPool({
      logger: this.logger,
      chain: this.chain
    })

    await blockPool.open()
    blockFetcher.on('blocks', async (blocks) => {
      if (!this.running) {
        return
      }
      try {
        await blockPool.add(blocks)
      } catch (error) {
        this.logger.error(`Block fetch error, trying again: ${error.stack}`)
        blockFetcher.add({
          first: new BN(blocks[0].header.number),
          last: new BN(blocks[blocks.length - 1].header.number)
        })
      }
    })
    blockFetcher.on('error', (error, task, peer) => {
      this.logger.debug(`Error processing task ${JSON.stringify(task)} with peer ${peer}: ${error.stack}`)
    })
    blockFetcher.add({ first, last })
    blockFetcher.start()

    while (this.running && (blockFetcher.running || blockPool.size)) {
      await timeout(refreshInterval)
    }
    if (blockFetcher.running && !this.running) {
      await blockFetcher.stop()
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
    if (this.chain.headers.height.lt(height)) {
      await this.fetch(this.chain.headers.height.addn(1), height)
    }
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
 * Implements an eth/62 based block fetcher
 * @memberof module:sync
 */
class BlockFetcher extends Fetcher {
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
    if (count.gtn(maxPerRequest)) {
      count = maxPerRequest
    } else {
      count = count.toNumber()
    }
    const headers = await peer.eth.getBlockHeaders({ block: task.first.toBuffer(), max: count })
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
    const { blocks } = reply
    const { task } = entry
    if (!blocks || blocks.length === 0) {
      this.add(task)
    } else {
      const last = new BN(blocks[blocks.length - 1].header.number)
      if (last.lt(task.last)) {
        this.add({ first: last.addn(1), last: task.last })
      }
      this.emit('blocks', blocks)
    }
  }
}

module.exports = FastSynchronizer
