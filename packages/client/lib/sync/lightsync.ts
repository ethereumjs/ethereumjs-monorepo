import { BN } from 'ethereumjs-util'
import { BlockHeader } from '@ethereumjs/block'
import { Peer } from '../net/peer/peer'
import { Synchronizer, SynchronizerOptions } from './sync'
import { HeaderFetcher } from './fetcher/headerfetcher'
import { short } from '../util'
import { Event } from '../types'

/**
 * Implements an ethereum light sync synchronizer
 * @memberof module:sync
 */
export class LightSynchronizer extends Synchronizer {
  constructor(options: SynchronizerOptions) {
    super(options)
  }

  /**
   * Returns synchronizer type
   * @return {string} type
   */
  get type(): string {
    return 'light'
  }

  /**
   * Open synchronizer. Must be called before sync() is called
   */
  async open(): Promise<void> {
    await super.open()
    await this.chain.open()
    await this.pool.open()
    const number = this.chain.headers.height.toNumber()
    const td = this.chain.headers.td.toString(10)
    const hash = this.chain.blocks.latest!.hash()
    this.startingBlock = number
    this.config.logger.info(`Latest local header: number=${number} td=${td} hash=${short(hash)}`)
  }

  /**
   * Returns true if peer can be used for syncing
   * @return {boolean}
   */
  syncable(peer: Peer): boolean {
    return peer.les?.status.serveHeaders
  }

  /**
   * Finds the best peer to sync with. We will synchronize to this peer's
   * blockchain. Returns null if no valid peer is found
   */
  best(): Peer | undefined {
    let best
    const peers = this.pool.peers.filter(this.syncable.bind(this))
    if (peers.length < this.config.minPeers && !this.forceSync) return
    for (const peer of peers) {
      if (peer.les) {
        const td = peer.les.status.headTd
        if (
          (!best && td.gte(this.chain.headers.td)) ||
          (best && best.les && best.les.status.headTd.lt(td))
        ) {
          best = peer
        }
      }
    }
    return best
  }

  /**
   * Get latest header of peer
   * @return {Promise} Resolves with header
   */
  async latest(peer: Peer) {
    const result = await peer.les?.getBlockHeaders({
      block: peer.les!.status.headHash,
      max: 1,
    })
    return result?.headers[0]
  }

  /**
   * Sync all headers and state from peer starting from current height.
   * @param  peer remote peer to sync with
   * @return Resolves when sync completed
   */
  async syncWithPeer(peer?: Peer): Promise<boolean> {
    // eslint-disable-next-line no-async-promise-executor
    return await new Promise(async (resolve, reject) => {
      if (!peer) return resolve(false)

      const latest = await this.latest(peer)
      if (!latest) return resolve(false)

      const height = new BN(peer.les!.status.headNum)
      if (!this.syncTargetHeight) {
        this.syncTargetHeight = height
        this.config.logger.info(
          `New sync target height number=${height.toString(10)} hash=${short(latest.hash())}`
        )
      }

      const first = this.chain.headers.height.addn(1)
      const count = height.sub(first).addn(1)
      if (count.lten(0)) return resolve(false)

      this.config.logger.debug(
        `Syncing with peer: ${peer.toString(true)} height=${height.toString(10)}`
      )

      this.fetcher = new HeaderFetcher({
        config: this.config,
        pool: this.pool,
        chain: this.chain,
        flow: this.flow,
        interval: this.interval,
        first,
        count,
        destroyWhenDone: false,
      })

      this.config.events.on(Event.SYNC_FETCHER_FETCHED, (headers) => {
        headers = headers as BlockHeader[]
        const first = new BN(headers[0].number)
        const hash = short(headers[0].hash())
        const baseFeeAdd = this.config.chainCommon.gteHardfork('london')
          ? `basefee=${headers[0].baseFeePerGas} `
          : ''
        this.config.logger.info(
          `Imported headers count=${headers.length} number=${first.toString(
            10
          )} hash=${hash} ${baseFeeAdd}peers=${this.pool.size}`
        )
      })

      this.config.events.on(Event.SYNC_SYNCHRONIZED, () => {
        resolve(true)
      })

      try {
        await this.fetcher.fetch()
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Stop synchronization. Returns a promise that resolves once its stopped.
   * @return {Promise}
   */
  async stop(): Promise<boolean> {
    if (!this.running) {
      return false
    }
    if (this.fetcher) {
      this.fetcher.destroy()
      // TODO: Should this be deleted?
      // @ts-ignore: error: The operand of a 'delete' operator must be optional
      delete this.fetcher
    }
    await super.stop()
    return true
  }
}
