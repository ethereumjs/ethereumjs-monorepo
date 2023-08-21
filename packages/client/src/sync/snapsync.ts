import { DefaultStateManager } from '@ethereumjs/statemanager'
import { bytesToHex } from '@ethereumjs/util'

import { Event } from '../types'

import { AccountFetcher } from './fetcher'
import { Synchronizer } from './sync'

import type { Peer } from '../net/peer/peer'
import type { SynchronizerOptions } from './sync'

interface SnapSynchronizerOptions extends SynchronizerOptions {}

export class SnapSynchronizer extends Synchronizer {
  public running = false

  stateManager: DefaultStateManager

  constructor(options: SnapSynchronizerOptions) {
    super(options)

    this.stateManager = new DefaultStateManager()
  }

  /**
   * Returns synchronizer type
   */
  get type() {
    return 'snap'
  }

  get fetcher(): AccountFetcher | null {
    if (this._fetcher !== null && !(this._fetcher instanceof AccountFetcher)) {
      throw Error(`Invalid Fetcher, expected AccountFetcher`)
    }
    return this._fetcher
  }

  set fetcher(fetcher: AccountFetcher | null) {
    this._fetcher = fetcher
  }

  /**
   * Open synchronizer. Must be called before sync() is called
   */
  async open(): Promise<void> {
    await super.open()
    await this.chain.open()
    await this.pool.open()
  }

  /**
   * Returns true if peer can be used for syncing
   */
  syncable(peer: Peer): boolean {
    // Need eth as well to get the latest of the peer
    // TODO: review
    return peer.snap !== undefined && peer.eth !== undefined
  }

  /**
   * Finds the best peer to sync with. We will synchronize to this peer's
   * blockchain. Returns null if no valid peer is found
   */
  async best(): Promise<Peer | undefined> {
    let best: [Peer, bigint] | undefined
    const peers = this.pool.peers.filter(this.syncable.bind(this))
    if (peers.length < this.config.minPeers && !this.forceSync) return
    for (const peer of peers) {
      const latest = await this.latest(peer)
      if (latest) {
        const { number } = latest
        if ((!best && number >= this.chain.blocks.height) || (best && best[1] < number)) {
          best = [peer, number]
        }
      }
    }
    return best ? best[0] : undefined
  }

  /**
   * Get latest header of peer
   */
  async latest(peer: Peer) {
    const result = await peer.eth?.getBlockHeaders({
      block: peer.eth!.status.bestHash,
      max: 1,
    })
    return result ? result[1][0] : undefined
  }

  /**
   * Start synchronizer.
   */
  async start(): Promise<void> {
    if (this.running) return
    this.running = true

    const timeout = setTimeout(() => {
      this.forceSync = true
    }, this.interval * 30)
    try {
      await this.sync()
    } catch (error: any) {
      this.config.logger.error(`Snap sync error: ${error.message}`)
      this.config.events.emit(Event.SYNC_ERROR, error)
    }
    await new Promise((resolve) => setTimeout(resolve, this.interval))
    this.running = false
    clearTimeout(timeout)
  }

  /**
   * Called from `sync()` to sync blocks and state from peer starting from current height.
   * @param peer remote peer to sync with
   * @returns a boolean if the setup was successful
   */
  async syncWithPeer(peer?: Peer): Promise<boolean> {
    const latest = peer ? await this.latest(peer) : undefined
    if (!latest) return false

    const stateRoot = latest.stateRoot
    const height = latest.number
    // eslint-disable-next-line eqeqeq
    if (this.config.syncTargetHeight == null || this.config.syncTargetHeight < latest.number) {
      this.config.syncTargetHeight = height
      this.config.logger.info(`New sync target height=${height} hash=${bytesToHex(latest.hash())}`)
    }

    this.fetcher = new AccountFetcher({
      config: this.config,
      pool: this.pool,
      root: stateRoot,
      // This needs to be determined from the current state of the MPT dump
      first: BigInt(0),
    })

    return true
  }

  /**
   * Stop synchronization. Returns a promise that resolves once its stopped.
   */
  async stop(): Promise<boolean> {
    return super.stop()
  }

  /**
   * Close synchronizer.
   */
  async close() {
    if (!this.opened) return
    await super.close()
  }
}
