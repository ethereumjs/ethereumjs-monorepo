
const Synchronizer = require('./sync')
const { HeaderFetcher } = require('./fetcher')
const BN = require('ethereumjs-util').BN
const { short } = require('../util')

/**
 * Implements an ethereum light sync synchronizer
 * @memberof module:sync
 */
export = module.exports = class LightSynchronizer extends Synchronizer {
  /**
   * Returns synchronizer type
   * @return {string} type
   */
  get type () {
    return 'light'
  }

  /**
   * Returns true if peer can be used for syncing
   * @return {boolean}
   */
  syncable (peer: any) {
    return peer.les && peer.les.status.serveHeaders
  }

  /**
   * Finds the best peer to sync with. We will synchronize to this peer's
   * blockchain. Returns null if no valid peer is found
   * @return {Peer}
   */
  best () {
    let best
    const peers = this.pool.peers.filter(this.syncable.bind(this))
    if (peers.length < this.minPeers && !this.forceSync) return
    for (let peer of peers) {
      const td = peer.les.status.headTd
      if ((!best && td.gte(this.chain.headers.td)) ||
          (best && best.les.status.headTd.lt(td))) {
        best = peer
      }
    }
    return best
  }

  /**
   * Sync all headers and state from peer starting from current height.
   * @param  {Peer} peer remote peer to sync with
   * @return {Promise} Resolves when sync completed
   */
  async syncWithPeer (peer: any) {
    if (!peer) return false
    const height = new BN(peer.les.status.headNum)
    const first = this.chain.headers.height.addn(1)
    const count = height.sub(first).addn(1)
    if (count.lten(0)) return false

    this.logger.debug(`Syncing with peer: ${peer.toString(true)} height=${height.toString(10)}`)

    this.headerFetcher = new HeaderFetcher({
      pool: this.pool,
      chain: this.chain,
      common: this.common,
      flow: this.flow,
      logger: this.logger,
      interval: this.interval,
      first,
      count
    })
    this.headerFetcher
      .on('error', (error: Error) => {
        this.emit('error', error)
      })
      .on('fetched', (headers: any[]) => {
        const first = new BN(headers[0].number)
        const hash = short(headers[0].hash())
        this.logger.info(`Imported headers count=${headers.length} number=${first.toString(10)} hash=${hash} peers=${this.pool.size}`)
      })
    await this.headerFetcher.fetch()
    delete this.headerFetcher
    return true
  }

  /**
   * Fetch all headers from current height up to highest found amongst peers
   * @return {Promise} Resolves with true if sync successful
   */
  async sync () {
    const peer = this.best()
    return this.syncWithPeer(peer)
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
    const hash = this.chain.blocks.latest.hash()
    this.logger.info(`Latest local header: number=${number} td=${td} hash=${short(hash)}`)
  }

  /**
   * Stop synchronization. Returns a promise that resolves once its stopped.
   * @return {Promise}
   */
  async stop () {
    if (!this.running) {
      return false
    }
    if (this.headerFetcher) {
      this.headerFetcher.destroy()
      delete this.headerFetcher
    }
    await super.stop()
  }
}

