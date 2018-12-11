'use strict'

const Synchronizer = require('./sync')
const BlockFetcher = require('./blockfetcher')
const BN = require('ethereumjs-util').BN

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
    this.blockFetcher = new BlockFetcher({
      pool: this.pool,
      chain: this.chain,
      logger: this.logger
    })
    this.init()
  }

  init () {
    this.pool.on('message:eth', (message, peer) => this.handle(message, peer))
    this.blockFetcher.on('error', (error, task, peer) => {
      this.logger.debug(`Error processing task ${JSON.stringify(task)} with peer ${peer}: ${error.stack}`)
    })
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
    while (!height && this.syncing) {
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
      if (!origin || !height) {
        return 0
      }
      this.logger.info(`Using origin peer: ${origin.toString(true)} height=${height.toString(10)}`)
      last = height
    }
    const first = this.chain.blocks.height.addn(1)

    if (first.gt(last)) {
      return 0
    }

    await this.blockFetcher.open()
    this.blockFetcher.add({ first, last })
    await this.blockFetcher.start()
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

  /**
   * Stop synchronization. Returns a promise that resolves once its stopped.
   * @return {Promise}
   */
  async stop () {
    if (!this.syncing) {
      return false
    }
    super.stop()
    await this.blockFetcher.stop()
  }
}

module.exports = FastSynchronizer
