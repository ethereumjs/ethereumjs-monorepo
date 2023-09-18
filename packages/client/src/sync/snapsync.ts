import { BIGINT_0, bytesToHex } from '@ethereumjs/util'

import { Event } from '../types'
import { short } from '../util'

import { AccountFetcher } from './fetcher'
import { Synchronizer } from './sync'

import type { VMExecution } from '../execution'
import type { Peer } from '../net/peer/peer'
import type { Skeleton } from '../service/skeleton'
import type { SynchronizerOptions } from './sync'
import type { DefaultStateManager } from '@ethereumjs/statemanager'

interface SnapSynchronizerOptions extends SynchronizerOptions {
  /** Skeleton chain */
  skeleton?: Skeleton

  /** VM Execution */
  execution: VMExecution
}

export class SnapSynchronizer extends Synchronizer {
  public running = false
  skeleton?: Skeleton
  private execution: VMExecution

  constructor(options: SnapSynchronizerOptions) {
    super(options)

    this.skeleton = options.skeleton
    this.execution = options.execution
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

    const { snapTargetHeight, snapTargetRoot } = this.config

    this.config.logger.info(
      `Opened SnapSynchronizer snapTargetHeight=${snapTargetHeight ?? 'NA'} snapTargetRoot=${short(
        snapTargetRoot ?? 'NA'
      )}`
    )
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
    // TODO: refine the way to query latest to fetch for the peer
    const blockHash = peer.eth!.status.bestHash
    // const blockHash = this.skeleton?.headHash() ?? peer.eth!.status.bestHash
    const result = await peer.eth?.getBlockHeaders({
      block: blockHash,
      max: 1,
    })
    return result ? result[1][0] : undefined
  }

  /**
   * Start synchronizer.
   */
  async start(): Promise<void> {
    console.log('------------------snapsync start ----------------', { running: this.running })
    if (this.running) return
    this.running = true

    const timeout = setTimeout(() => {
      this.forceSync = true
    }, this.interval * 30)
    try {
      console.log('snapsync starting syc ****************************************')
      await this.sync()
      console.log('snapsync ended ????????????????????????????????????????????')
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
    this.config.logger.info(`SnapSynchronizer - syncWithPeer ${peer?.id}`)
    // if skeleton is passed we have to wait for skeleton to be updated
    // if (
    //   this.skeleton !== undefined &&
    //   (!this.skeleton.isStarted() || this.skeleton.bounds() === undefined)
    // ) {
    //   this.config.logger.info(`SnapSynchronizer - early return ${peer?.id}`)
    //   return false
    // }

    const latest = peer ? await this.latest(peer) : undefined
    if (!latest) {
      return false
    }

    const stateRoot = latest.stateRoot
    const height = latest.number
    // eslint-disable-next-line eqeqeq
    if (this.config.syncTargetHeight == null || this.config.syncTargetHeight < latest.number) {
      this.config.syncTargetHeight = height
      this.config.logger.info(`New sync target height=${height} hash=${bytesToHex(latest.hash())}`)
    }

    if (this.config.syncTargetHeight <= latest.number + this.config.snapAvailabilityDepth) {
      if ((this.config.snapTargetHeight ?? BIGINT_0) < latest.number) {
        this.config.snapTargetHeight = latest.number
        this.config.snapTargetRoot = latest.stateRoot
        this.config.snapTargetHash = latest.hash()
      }

      if (this.fetcher === null || this.fetcher.syncErrored !== undefined) {
        this.config.logger.info(
          `syncWithPeer new AccountFetcher peer=${peer?.id} snapTargetHeight=${
            this.config.snapTargetHeight
          } snapTargetRoot=${short(this.config.snapTargetRoot!)}  ${
            this.fetcher === null
              ? ''
              : 'previous fetcher errored=' + this.fetcher.syncErrored?.message
          }`
        )
        this.fetcher = new AccountFetcher({
          config: this.config,
          pool: this.pool,
          stateManager: this.execution.vm.stateManager as DefaultStateManager,
          root: stateRoot,
          // This needs to be determined from the current state of the MPT dump
          first: BigInt(0),
        })
      } else {
        this.config.logger.info(`syncWithPeer updating stateRoot=${short(stateRoot)}`)
        this.fetcher.updateStateRoot(stateRoot)
      }
    }
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
