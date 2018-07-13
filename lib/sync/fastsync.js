'use strict'

const Synchronizer = require('./sync')
const Fetcher = require('./fetcher')
const { BlockPool } = require('../blockchain')
const Block = require('ethereumjs-block')
const BN = require('ethereumjs-util').BN
const { defaultLogger } = require('../logging')
const { codes } = require('../net/protocol').EthProtocol

const defaultOptions = {
  logger: defaultLogger,
  minPeers: 2
}

const MAX_PER_REQUEST = 100

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
   * @param {number}   [options.minPeers=2] minimum peers needed for synchronization
   * @param {Logger}   [options.logger] Logger instance
   */
  constructor (options) {
    super(options)
    options = {...defaultOptions, ...options}

    this.logger = options.logger
    this.pool = options.pool
    this.chain = options.chain
    this.minPeers = options.minPeers
    this.fetchers = new Map()
    this.init()
  }

  init () {
    this.opened = false
    this.syncing = false
    this.pool.on('message:eth', (message, peer) => this.handle(message, peer))
  }

  /**
   * Handler for peer messages
   * @private
   * @param  {Object}  message
   * @param  {Peer}    peer
   * @return {Promise}
   */
  async handle (message, peer) {
    const fetcher = this.fetchers.get(message.code)
    if (fetcher) {
      await fetcher.handle(message, peer)
    }
  }

  /**
   * Open fast sync synchronizer and wait for all components to initialize
   * @return {Promise}
   */
  async open () {
    if (this.opened) {
      return
    }
    await this.pool.open()
    await this.chain.open()
    this.opened = true
    const number = this.chain.height.toString(10)
    const td = this.chain.td.toString(10)
    this.logger.info(`Latest local header: number=${number} td=${td}`)
  }

  /**
   * Request canonical chain height from peer. Returns a promise that resolves
   * to the peer's height once it responds with its latest block header.
   * @param  {Peer}    peer
   * @return {Promise}
   */
  async height (peer) {
    peer.eth.getBlockHeaders(peer.eth.head, 1, 0, 0)
    const headers = await peer.eth.response(codes.BLOCK_HEADERS)
    const header = new Block.Header(headers[0])
    return new BN(header.number)
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
      await timeout(1000)
      if (this.pool.peers.length < this.minPeers) {
        continue
      }
      for (let peer of this.pool.peers) {
        if (!best || best.eth.td < peer.eth.td) {
          best = peer
        }
      }
      try {
        height = await this.height(best)
      } catch (error) {
        this.pool.ban(best)
        this.logger.debug(`Error getting peer height: ${best} ${error}`)
      }
    }
    return [best, height]
  }

  /**
   * Fetch all headers with block numbers ranings from first to last. Returns a
   * promise that resolves once all headers are downloaded. TO DO: Actually insert
   * headers into the blockchain.
   * @param  {BN}  first number of first block header
   * @param  {BN}  last number of last block header
   * @return {Promise}
   */
  async fetch (first, last) {
    const headerFetcher = new HeaderFetcher({
      pool: this.pool,
      logger: this.logger
    })
    const blockPool = new BlockPool({
      logger: this.logger,
      chain: this.chain
    })

    this.fetchers.set(codes.BLOCK_HEADERS, headerFetcher)
    headerFetcher.on('headers', async (headers) => {
      try {
        const blocks = headers.map(header => new Block([header.raw, [], []]))
        await blockPool.add(blocks)
      } catch (error) {
        this.logger.error(`Header fetch error, trying again: ${error.stack}`)
        headerFetcher.add({
          first: new BN(headers[0].number),
          last: new BN(headers[headers.length - 1].number)
        })
      }
    })
    headerFetcher.add({ first, last })
    await headerFetcher.run()
    this.fetchers.delete(codes.BLOCK_HEADERS)
  }

  /**
   * Synchronization blockchain. Returns a promise that resolves once chain
   * is synchronized
   * @return {Promise}
   */
  async sync () {
    this.syncing = true
    const [ origin, height ] = await this.origin()
    this.logger.info(`Using origin peer: ${origin.toString(true)} height=${height.toString(10)}`)
    await this.fetch(this.chain.height.addn(1), height)
    this.syncing = false
  }
}

/**
 * Implements an eth/62 based header fetcher
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
   */
  fetch (task, peer) {
    let count = task.last.sub(task.first).addn(1)
    if (count.gtn(MAX_PER_REQUEST)) {
      count = MAX_PER_REQUEST
    } else {
      count = count.toNumber()
    }
    peer.eth.getBlockHeaders(task.first.toBuffer(), count, 0, 0)
  }

  /**
   * Process the message payload for the getBlockHeaders response
   * @param  {Object} task
   * @param  {Array} payload rlp encoded payload
   * @emits  headers
   */
  process (task, payload) {
    if (!payload || payload.length === 0) {
      this.add(task)
    } else {
      const headers = payload.map(h => new Block.Header(h))
      const last = new BN(headers[headers.length - 1].number)
      if (last.lt(task.last)) {
        this.add({ first: last.addn(1), last: task.last })
      }
      this.emit('headers', headers)
    }
  }
}

module.exports = FastSynchronizer
