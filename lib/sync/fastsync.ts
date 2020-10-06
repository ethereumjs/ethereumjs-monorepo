import { Peer } from "../net/peer/peer"
import { BoundProtocol } from "../net/protocol"

const Synchronizer = require('./sync')
const { BlockFetcher } = require('./fetcher')
const BN = require('ethereumjs-util').BN
const { short } = require('../util')

/**
 * Implements an ethereum fast sync synchronizer
 * @memberof module:sync
 */
export = module.exports = class FastSynchronizer extends Synchronizer {
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
  syncable (peer: Peer) {
    return peer.eth
  }

  /**
   * Finds the best peer to sync with. We will synchronize to this peer's
   * blockchain. Returns null if no valid peer is found
   */
  best (): Peer | undefined {
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
  async latest (peer: Peer) {
    // @ts-ignore
    const headers = await (peer.eth as BoundProtocol).getBlockHeaders({
      block: (peer.eth as BoundProtocol).status.bestHash, max: 1
    })
    return headers[0]
  }

  /**
   * Sync all blocks and state from peer starting from current height.
   * @param  peer remote peer to sync with
   * @return Resolves when sync completed
   */
  async syncWithPeer (peer?: Peer): Promise<boolean> {
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
      .on('error', (error: Error) => {
        this.emit('error', error)
      })
      .on('fetched', (blocks: any[]) => {
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
   * @return Resolves with true if sync successful
   */
  async sync (): Promise<boolean> {
    const peer = this.best()
    return this.syncWithPeer(peer)
  }

  /**
   * Chain was updated
   * @param  {Object[]} announcements new block hash announcements
   * @param  {Peer}     peer peer
   * @return {Promise}
   */
  async announced (announcements: any[], peer: Peer) {
    if (announcements.length) {
      const [hash, height] = announcements[announcements.length - 1]
      this.logger.debug(`New height: number=${height.toString(10)} hash=${short(hash)}`)
      // TO DO: download new blocks
    }
  }

  /**
   * Open synchronizer. Must be called before sync() is called
   */
  async open (): Promise<void> {
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
  async stop (): Promise<boolean> {
    if (!this.running) {
      return false
    }
    if (this.blockFetcher) {
      this.blockFetcher.destroy()
      delete this.blockFetcher
    }
    await super.stop()
    return true
  }
}

