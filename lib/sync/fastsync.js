'use strict'

const Synchronizer = require('./sync')
const Fetcher = require('./fetcher')
const Block = require('ethereumjs-block')
const { BlockPool } = require('../blockchain')
const BN = require('ethereumjs-util').BN

const maxPerRequest = 128

/**
 * Implements an ethereum fast sync synchronizer
 * @memberof module:sync
 */
class FastSynchronizer extends Synchronizer {
  /**
   * Create new node
   * @param {Object}      options constructor parameters
   * @param {PeerPool}    options.pool peer pool
   * @param {Chain}       options.chain blockchain
   * @param {number}      [options.interval] refresh interval
   * @param {Logger}      [options.logger] Logger instance
   */
  constructor (options) {
    super(options)
    this.init()
  }

  init () {
    this.pool.on('message:eth', (message, peer) => this.handle(message, peer))
  }

  /**
   * Returns synchronizer type
   * @return {string} type
   */
  get type () {
    return 'fast'
  }

  /**
   * Returns true if peer can be used to fetch blocks
   * @return {boolean}
   */
  fetchable (peer) {
    return peer.eth && !peer.inbound
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
      await this.wait()
      const peers = this.pool.peers.filter(this.fetchable.bind(this))
      if (!peers.length) {
        continue
      }
      for (let peer of peers) {
        const td = peer.eth.status.td
        if ((!best && td.gte(this.chain.blocks.td)) ||
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

    const blockFetcher = new BlockFetcher({
      pool: this.pool,
      sync: this,
      logger: this.logger
    })
    const blockPool = new BlockPool({
      logger: this.logger,
      chain: this.chain
    })
    const first = this.chain.blocks.height.addn(1)

    if (first.gt(last)) {
      return 0
    }

    await blockPool.open()
    blockFetcher.on('blocks', async (blocks) => {
      if (!this.syncing) {
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

    while (this.syncing && (blockFetcher.running || blockPool.size)) {
      await this.wait()
    }
    if (!this.syncing && blockFetcher.running) {
      await blockFetcher.stop()
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

      if (message.name === 'NewBlockHashes') {
        const pairs = message.data
        if (pairs.length) {
          const [, height] = pairs[pairs.length - 1]
          this.sync(height)
        }
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
    const number = this.chain.blocks.height.toString(10)
    const td = this.chain.blocks.td.toString(10)
    const hash = this.chain.blocks.latest.hash().toString('hex').slice(0, 8) + '...'
    this.logger.info(`Latest local block: number=${number} td=${td} hash=${hash}`)
  }
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
   * @param {Synchronizer} options.sync parent synchronizer
   * @param {Logger}       [options.logger] Logger instance
   */
  constructor (options) {
    super(options)
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

  fetchable (peer) {
    return this.sync.fetchable(peer)
  }
}

module.exports = FastSynchronizer
