'use strict'

const Synchronizer = require('./sync')
const { BlockFetcher } = require('./fetcher')
const BN = require('ethereumjs-util').BN
const { short } = require('../util')

/**
 * Implements an ethereum fast sync synchronizer
 * @memberof module:sync
 */
class FastSynchronizer extends Synchronizer {
  /**
   * Returns synchronizer type
   * @return {string} type
   */
  get type () {
    return 'fast'
  }

  /**
   * Returns true if peer can be used for syncing
   * @return {boolean}
   */
  syncable (peer) {
    return peer.eth
  }

  /**
   * Finds the best peer to sync with. We will synchronize to this peer's
   * blockchain. Returns null if no valid peer is found
   * @param  {number} min minimum numbers of peers to search
   * @return {Peer}
   */
  best () {
    let best
    const peers = this.pool.peers.filter(this.syncable.bind(this))
    if (peers.length < this.minPeers && !this.forceSync) return
    for (let peer of peers) {
      const td = peer.eth.status.td
      if ((!best && td.gte(this.chain.blocks.td)) ||
          (best && best.eth.status.td.lt(td))) {
        best = peer
      }
    }
    return best
  }

  /**
   * Get latest header of peer
   * @return {Promise} Resolves with header
   */
  async latest (peer) {
    const headers = await peer.eth.getBlockHeaders({
      block: peer.eth.status.bestHash, max: 1
    })
    return headers[0]
  }

  /**
   * Sync all blocks and state from peer starting from current height.
   * @param  {Peer} peer remote peer to sync with
   * @return {Promise} Resolves when sync completed
   */
  async syncWithPeer (peer) {
    if (!peer) return false
    const latest = await this.latest(peer)
    const height = new BN(latest.number)
    const first = this.chain.blocks.height.addn(1)
    const count = height.sub(first).addn(1)
    if (count.lten(0)) return false

    this.logger.debug(`Syncing with peer: ${peer.toString(true)} height=${height.toString(10)}`)

    this.blockFetcher = new BlockFetcher({
      pool: this.pool,
      chain: this.chain,
      common: this.common,
      logger: this.logger,
      interval: this.interval,
      first,
      count
    })
    this.blockFetcher
      .on('error', (error) => {
        this.emit('error', error)
      })
      .on('fetched', blocks => {
        const first = new BN(blocks[0].header.number)
        const hash = short(blocks[0].hash())
        this.logger.info(`Imported blocks count=${blocks.length} number=${first.toString(10)} hash=${hash} peers=${this.pool.size}`)
      })
    await this.blockFetcher.fetch()
    delete this.blockFetcher
    return true

    // TO DO: Fetch state trie as well
  }

  /**
   * Fetch all blocks from current height up to highest found amongst peers and
   * fetch entire recent state trie
   * @return {Promise} Resolves with true if sync successful
   */
  async sync () {
    const peer = this.best()
    return this.syncWithPeer(peer)
  }

  /**
   * Chain was updated
   * @param  {Object[]} announcements new block hash announcements
   * @param  {Peer}     peer peer
   * @return {Promise}
   */
  async announced (announcements, peer) {
    if (announcements.length) {
      const [hash, height] = announcements[announcements.length - 1]
      this.logger.debug(`New height: number=${height.toString(10)} hash=${short(hash)}`)
      // TO DO: download new blocks
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
    const hash = this.chain.blocks.latest.hash()
    this.logger.info(`Latest local block: number=${number} td=${td} hash=${short(hash)}`)
  }

  /**
   * Stop synchronization. Returns a promise that resolves once its stopped.
   * @return {Promise}
   */
  async stop () {
    if (!this.running) {
      return false
    }
    if (this.blockFetcher) {
      this.blockFetcher.destroy()
      delete this.blockFetcher
    }
    await super.stop()
  }
}

module.exports = FastSynchronizer
