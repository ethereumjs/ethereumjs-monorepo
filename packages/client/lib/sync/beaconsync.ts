import { short } from '../util'
import { Event } from '../types'
import { Synchronizer, SynchronizerOptions } from './sync'
import { ReverseBlockFetcher } from './fetcher'
import type { Block } from '@ethereumjs/block'
import type { Peer } from '../net/peer/peer'
import { errSyncReorged, Skeleton } from './skeleton'
import type { VMExecution } from '../execution'
import type { BN } from 'ethereumjs-util'

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

    this.config.events.on(Event.SYNC_FETCHED_BLOCKS, this.processSkeletonBlocks)
    this.config.events.on(Event.CHAIN_UPDATED, this.runExecution)
  }

  /**
   * Returns synchronizer type
   */
  get type() {
    return 'beacon'
  }

  /**
   * Open synchronizer. Must be called before sync() is called
   */
  async open(): Promise<void> {
    await super.open()
    await this.chain.open()
    await this.pool.open()
    await this.skeleton.open()

    const subchain = this.skeleton.bounds()
    if (subchain) {
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
    let best: [Peer, BN] | undefined
    const peers = this.pool.peers.filter(this.syncable.bind(this))
    if (peers.length < this.config.minPeers && !this.forceSync) return
    for (const peer of peers) {
      const latest = await this.latest(peer)
      if (latest) {
        const { number } = latest
        if ((!best && number.gte(this.chain.blocks.height)) || (best && best[1].lt(number))) {
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
    while (this.running && !this.skeleton.isLinked()) {
      try {
        await this.sync()
      } catch (error: any) {
        this.config.events.emit(Event.SYNC_ERROR, error)
      }
      await new Promise((resolve) => setTimeout(resolve, this.interval))
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
    if (this.skeleton.isLinked()) {
      this.clearFetcher()
      return true
    }

    const latest = peer ? await this.latest(peer) : undefined
    if (!latest) return false

    const height = latest.number
    if (!this.config.syncTargetHeight || this.config.syncTargetHeight.lt(latest.number)) {
      this.config.syncTargetHeight = height
      this.config.logger.info(`New sync target height=${height} hash=${short(latest.hash())}`)
    }

    const { tail } = this.skeleton.bounds()
    const first = tail.subn(1)
    // Sync from tail to next subchain or chain height
    const count = first.sub(
      (this.skeleton as any).status.progress.subchains[1]?.head.subn(1) ?? this.chain.blocks.height
    )
    if (count.gtn(0) && (!this.fetcher || this.fetcher.errored)) {
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
   * @params force for to run execution even if there is a single block
   */
  async runExecution(): Promise<void> {
    // Execute even single block when executed head is near supposed chain head,
    // otherwise run execution in batch of 50 blocks when filling canonical chain.
    const vmHead = (await this.chain.blockchain.getIteratorHead()).header.number
    const { head: skeletonHead, tail: skeletonTail } = this.skeleton.bounds() || {
      head: this.config.syncTargetHeight ?? vmHead,
      tail: this.config.syncTargetHeight ?? vmHead,
    }
    const isExecutionNearHead =
      vmHead.lt(skeletonHead) &&
      vmHead.gte(skeletonTail) &&
      vmHead.addn(50).gt(this.config.syncTargetHeight ?? vmHead)

    if (isExecutionNearHead || this.chain.blocks.height.modrn(50) === 0) {
      void this.execution.run()
    }
  }

  /**
   * Stop synchronization. Returns a promise that resolves once its stopped.
   */
  async stop(): Promise<boolean> {
    this.config.events.removeListener(Event.SYNC_FETCHED_BLOCKS, this.processSkeletonBlocks)
    this.config.events.removeListener(Event.CHAIN_UPDATED, this.runExecution)
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
