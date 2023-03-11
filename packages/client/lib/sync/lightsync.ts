import { Hardfork } from '@ethereumjs/common'

import { Event } from '../types'
import { short } from '../util'

import { HeaderFetcher } from './fetcher'
import { Synchronizer } from './sync'

import type { Peer } from '../net/peer/peer'
import type { SynchronizerOptions } from './sync'
import type { BlockHeader } from '@ethereumjs/block'

/**
 * Implements an ethereum light sync synchronizer
 * @memberof module:sync
 */
export class LightSynchronizer extends Synchronizer {
  constructor(options: SynchronizerOptions) {
    super(options)

    this.processHeaders = this.processHeaders.bind(this)
    this.config.events.on(Event.SYNC_FETCHED_HEADERS, this.processHeaders)
  }

  /**
   * Returns synchronizer type
   */
  get type() {
    return 'light'
  }

  get fetcher(): HeaderFetcher | null {
    if (this._fetcher !== null && !(this._fetcher instanceof HeaderFetcher)) {
      throw Error(`Invalid Fetcher, expected HeaderFetcher`)
    }
    return this._fetcher
  }

  set fetcher(fetcher: HeaderFetcher | null) {
    this._fetcher = fetcher
  }

  /**
   * Open synchronizer. Must be called before sync() is called
   */
  async open(): Promise<void> {
    await super.open()
    await this.chain.open()
    await this.pool.open()
    const { height: number, td } = this.chain.headers
    const hash = this.chain.blocks.latest!.hash()
    this.startingBlock = number
    this.config.logger.info(`Latest local header: number=${number} td=${td} hash=${short(hash)}`)
  }

  /**
   * Returns true if peer can be used for syncing
   */
  syncable(peer: Peer): boolean {
    return peer.les?.status.serveHeaders ?? false
  }

  /**
   * Finds the best peer to sync with.
   * We will synchronize to this peer's blockchain.
   * @returns undefined if no valid peer is found
   */
  async best(): Promise<Peer | undefined> {
    let best
    const peers = this.pool.peers.filter(this.syncable.bind(this))
    if (peers.length < this.config.minPeers && !this.forceSync) return
    for (const peer of peers) {
      if (peer.les) {
        const td = peer.les.status.headTd
        if (
          (!best && td >= this.chain.headers.td) ||
          (best && best.les && best.les.status.headTd < td)
        ) {
          best = peer
        }
      }
    }
    return best
  }

  /**
   * Get latest header of peer
   */
  async latest(peer: Peer) {
    const result = await peer.les?.getBlockHeaders({
      block: peer.les!.status.headHash,
      max: 1,
    })
    return result?.headers[0]
  }

  /**
   * Called from `sync()` to sync headers and state from peer starting from current height.
   * @param peer remote peer to sync with
   * @returns a boolean if the setup was successful
   */
  async syncWithPeer(peer?: Peer): Promise<boolean> {
    const latest = peer ? await this.latest(peer) : undefined
    if (!latest) return false

    const height = peer!.les!.status.headNum
    if (
      this.config.syncTargetHeight === undefined ||
      this.config.syncTargetHeight === BigInt(0) ||
      this.config.syncTargetHeight < height
    ) {
      this.config.syncTargetHeight = height
      this.config.logger.info(`New sync target height=${height} hash=${short(latest.hash())}`)
    }

    // Start fetcher from a safe distance behind because if the previous fetcher exited
    // due to a reorg, it would make sense to step back and refetch.
    const first =
      this.chain.headers.height >= BigInt(this.config.safeReorgDistance)
        ? this.chain.headers.height - BigInt(this.config.safeReorgDistance) + BigInt(1)
        : BigInt(1)
    const count = height - first + BigInt(1)
    if (count < BigInt(0)) return false
    if (!this.fetcher || this.fetcher.syncErrored) {
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
    } else {
      const fetcherHeight = this.fetcher.first + this.fetcher.count - BigInt(1)
      if (height > fetcherHeight) {
        this.fetcher.count += height - fetcherHeight
        this.config.logger.info(`Updated fetcher target to height=${height} peer=${peer} `)
      }
    }
    return true
  }

  /**
   * Process headers fetched from the fetcher.
   */
  async processHeaders(headers: BlockHeader[]) {
    if (headers.length === 0) {
      this.config.logger.warn('No headers fetched are applicable for import')
      return
    }
    const first = headers[0].number
    const hash = short(headers[0].hash())
    const baseFeeAdd =
      this.config.chainCommon.gteHardfork(Hardfork.London) === true
        ? `baseFee=${headers[0].baseFeePerGas} `
        : ''
    this.config.logger.info(
      `Imported headers count=${headers.length} number=${first} hash=${hash} ${baseFeeAdd}peers=${this.pool.size}`
    )
  }

  /**
   * Stop synchronizer.
   */
  async stop(): Promise<boolean> {
    this.config.events.removeListener(Event.SYNC_FETCHED_HEADERS, this.processHeaders)
    return super.stop()
  }
}
