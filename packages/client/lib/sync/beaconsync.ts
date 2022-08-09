import type { Block } from '@ethereumjs/block'
import { isFalsy, isTruthy } from '@ethereumjs/util'

import type { VMExecution } from '../execution'
import type { Peer } from '../net/peer/peer'
import { Event } from '../types'
import { short } from '../util'
import { ReverseBlockFetcher } from './fetcher'
import { errSyncReorged, Skeleton } from './skeleton'
import { Synchronizer, SynchronizerOptions } from './sync'

interface BeaconSynchronizerOptions extends SynchronizerOptions {
  /** Skeleton chain */
  skeleton: Skeleton

  /** VM Execution */
  execution: VMExecution
}

/**
 * Beacon sync is the post-merge version of the chain synchronization, where the
 * chain is not downloaded from genesis onward, rather from trusted head backwards.
 * @memberof module:sync
 */
export class BeaconSynchronizer extends Synchronizer {
  skeleton: Skeleton
  private execution: VMExecution

  public running = false

  constructor(options: BeaconSynchronizerOptions) {
    super(options)
    this.skeleton = options.skeleton
    this.execution = options.execution

    this.processSkeletonBlocks = this.processSkeletonBlocks.bind(this)
    this.runExecution = this.runExecution.bind(this)
  }

  /**
   * Returns synchronizer type
   */
  get type() {
    return 'beacon'
  }

  get fetcher(): ReverseBlockFetcher | null {
    if(this._fetcher!==null && !(this._fetcher instanceof ReverseBlockFetcher)){
      throw Error(`Invalid Fetcher, expected ReverseBlockFetcher`);
    }
    return this._fetcher;
  }

  set fetcher(fetcher: ReverseBlockFetcher | null){
    this._fetcher = fetcher;
  }

  /**
   * Open synchronizer. Must be called before sync() is called
   */
  async open(): Promise<void> {
    await super.open()
    await this.chain.open()
    await this.pool.open()
    await this.skeleton.open()

    this.config.events.on(Event.SYNC_FETCHED_BLOCKS, this.processSkeletonBlocks)
    this.config.events.on(Event.CHAIN_UPDATED, this.runExecution)

    const subchain = this.skeleton.bounds()
    if (isTruthy(subchain)) {
      const { head, tail, next } = subchain
      this.config.logger.info(`Resuming beacon sync head=${head} tail=${tail} next=${short(next)}`)
    }
  }

  /**
   * Returns true if peer can be used for syncing
   */
  syncable(peer: Peer): boolean {
    return peer.eth !== undefined
  }

  /**
   * Finds the best peer to sync with. We will synchronize to this peer's
   * blockchain. Returns null if no valid peer is found
   */
  async best(): Promise<Peer | undefined> {
    let best: [Peer, BigInt] | undefined
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
   * If passed a block, will initialize sync starting from the block.
   */
  async start(block?: Block): Promise<void> {
    if (this.running) return
    this.running = true

    if (block) {
      await this.skeleton.initSync(block)
    }

    const timeout = setTimeout(() => {
      this.forceSync = true
    }, this.interval * 30)
    const isLinked = await this.skeleton.isLinked()
    if (!isLinked) {
      while (this.running) {
        try {
          await this.sync()
        } catch (error: any) {
          this.config.events.emit(Event.SYNC_ERROR, error)
        }
        await new Promise((resolve) => setTimeout(resolve, this.interval))
      }
    } else {
      // It could be that the canonical chain fill got stopped midway, ideally CL
      // would keep extending the skeleton that might trigger fillCanonicalChain
      // but if we are already linked and CL is down, we don't need to wait
      // for CL and just fill up the chain in meantime
      void this.skeleton.fillCanonicalChain()
    }

    this.running = false
    clearTimeout(timeout)
  }

  /**
   * Returns true if the block successfully extends the chain.
   */
  async extendChain(block: Block): Promise<boolean> {
    if (!this.opened) return false
    try {
      if (!this.running) {
        void this.start(block)
      } else {
        await this.skeleton.setHead(block)
      }
      return true
    } catch (error) {
      if (this.running) {
        void this.stop()
      }
      return false
    }
  }

  /**
   * Sets the new head of the skeleton chain.
   */
  async setHead(block: Block): Promise<boolean> {
    if (!this.opened) return false
    // New head announced, start syncing to it if we are not already.
    // If this causes a reorg, we will tear down the fetcher and start
    // from the new head.
    try {
      if (!this.running) {
        void this.start(block)
      } else {
        await this.skeleton.setHead(block, true)
      }
      this.config.logger.debug(
        `Beacon sync new head number=${block.header.number} hash=${short(block.header.hash())}`
      )
      return true
    } catch (error) {
      if (error == errSyncReorged) {
        this.config.logger.debug(
          `Beacon sync reorged, new head number=${block.header.number} hash=${short(
            block.header.hash()
          )}`
        )
        // Tear down fetcher and start from new head
        await this.stop()
        void this.start(block)
        return true
      } else {
        throw error
      }
    }
  }

  /**
   * Sync blocks from the skeleton chain tail.
   * @param peer remote peer to sync with
   * @return Resolves when sync completed
   */
  async syncWithPeer(peer?: Peer): Promise<boolean> {
    if (!isTruthy(this.skeleton.bounds()) || (await this.skeleton.isLinked())) {
      this.clearFetcher()
      return false
    }

    const latest = peer ? await this.latest(peer) : undefined
    if (!latest) return false

    const height = latest.number
    if (isFalsy(this.config.syncTargetHeight) || this.config.syncTargetHeight < latest.number) {
      this.config.syncTargetHeight = height
      this.config.logger.info(`New sync target height=${height} hash=${short(latest.hash())}`)
    }

    const { tail } = this.skeleton.bounds()
    const first = tail - BigInt(1)

    let count
    if (first <= this.chain.blocks.height) {
      // skeleton should have linked by now, if not it means skeleton is syncing the reorg
      // to the current canonical, so we can lower the skeleton target by another 1000 blocks
      count = BigInt(this.config.skeletonSubchainMergeMinimum)
    } else {
      // We sync one less because tail's next should be pointing to the block in chain
      count = tail - this.chain.blocks.height - BigInt(1)
    }

    if (count > BigInt(0) && (!isTruthy(this.fetcher) || isTruthy(this.fetcher.errored))) {
      this.config.logger.debug(
        `syncWithPeer - new ReverseBlockFetcher peer=${peer?.id} subChainTail=${tail} first=${first} count=${count} chainHeight=${this.chain.blocks.height} `
      )
      this.fetcher = new ReverseBlockFetcher({
        config: this.config,
        pool: this.pool,
        chain: this.chain,
        skeleton: this.skeleton,
        interval: this.interval,
        first,
        count,
        destroyWhenDone: true,
      })
    }
    return true
  }

  async processSkeletonBlocks(blocks: Block[]) {
    if (blocks.length === 0) {
      if (this.fetcher !== null) {
        this.config.logger.warn('No blocks fetched are applicable for import')
      }
      return
    }

    blocks = blocks as Block[]
    const first = blocks[0].header.number
    const last = blocks[blocks.length - 1].header.number
    const hash = short(blocks[0].hash())

    this.config.logger.info(
      `Imported skeleton blocks count=${blocks.length} first=${first} last=${last} hash=${hash} peers=${this.pool.size}`
    )
  }

  /**
   * Runs vm execution on {@link Event.CHAIN_UPDATED}
   */
  async runExecution(): Promise<void> {
    // Execute single block when within 50 blocks of head if skeleton not filling,
    // otherwise run execution in batch of 50 blocks when filling canonical chain.
    const shouldRunOnlyBatched = !(
      isTruthy(this.skeleton.bounds()) &&
      this.chain.blocks.height > this.skeleton.bounds().head - BigInt(50)
    )
    if (!shouldRunOnlyBatched || this.chain.blocks.height % BigInt(50) === BigInt(0)) {
      void this.execution.run(false, shouldRunOnlyBatched)
    }
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
    this.config.events.removeListener(Event.SYNC_FETCHED_BLOCKS, this.processSkeletonBlocks)
    this.config.events.removeListener(Event.CHAIN_UPDATED, this.runExecution)
    await super.close()
  }
}
