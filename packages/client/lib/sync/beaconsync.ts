import { BN } from 'ethereumjs-util'
import { short } from '../util'
import { Event } from '../types'
import { Synchronizer, SynchronizerOptions } from './sync'
import { ReverseBlockFetcher } from './fetcher'
import type { Block, BlockHeader } from '@ethereumjs/block'
import type { Peer } from '../net/peer/peer'
import type { Skeleton } from './skeleton'
import type { VMExecution } from '../execution'

interface BeaconSynchronizerOptions extends SynchronizerOptions {
  /** Skeleton chain */
  skeleton: Skeleton
}

/**
 * Beacon sync is the post-merge version of the chain synchronization, where the
 * chain is not downloaded from genesis onward, rather from trusted head backwards.
 * @memberof module:sync
 */
export class BeaconSynchronizer extends Synchronizer {
  private skeleton: Skeleton

  public running = false

  constructor(options: BeaconSynchronizerOptions) {
    super(options)
    this.skeleton = options.skeleton
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
  best(): Peer | undefined {
    const peers = this.pool.peers.filter(this.syncable.bind(this))
    return peers.length > 0 ? peers[0] : undefined
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
    while (this.running) {
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
    await this.skeleton.processNewHead(block)
    return true
  }

  /**
   * Sets the new head of the skeleton chain.
   */
  async setHead(block: Block): Promise<boolean> {
    const reorged = await this.skeleton.processNewHead(block, true)
    // New head announced, start syncing to it if we are not already.
    // If this causes a reorg, we will tear down the fetcher and start
    // from the new head.
    if (!this.running) {
      void this.start()
    } else {
      if (reorged) {
        this.config.logger.debug(
          `Beacon sync reorged, new head number=${block.header.number} hash=${short(
            block.header.hash()
          )}`
        )
        // Tear down fetcher and start from new head
        this.clearFetcher()
        void this.start()
      } else {
        this.config.logger.debug(
          `Beacon sync new head number=${block.header.number} hash=${short(block.header.hash())}`
        )
      }
    }
    return true
  }

  /**
   * Sync blocks from the skeleton chain tail.
   * @param peer remote peer to sync with
   * @return Resolves when sync completed
   */
  async syncWithPeer(peer?: Peer): Promise<boolean> {
    // eslint-disable-next-line no-async-promise-executor
    return await new Promise(async (resolve, reject) => {
      if (!peer) return resolve(false)

      const bounds = this.skeleton.bounds()
      if (!bounds) return resolve(false) // have no head yet
      const { tail } = bounds
      if (tail.subn(1).isZero()) return resolve(true) // already linked
      const first = tail.clone()
      // Sync from tail to next subchain
      const count = tail
        .subn(1)
        .sub((this.skeleton as any).status.progress.subchains[1]?.head ?? new BN(0))
      const resolveSync = () => {
        resolve(true)
      }
      this.config.events.on(Event.SYNC_SYNCHRONIZED, resolveSync)
      this.config.logger.debug(`Syncing with peer: ${peer.toString(true)} start=${first}`)

      this.clearFetcher()
      this.fetcher = new ReverseBlockFetcher({
        config: this.config,
        pool: this.pool,
        chain: this.chain,
        skeleton: this.skeleton,
        interval: this.interval,
        first,
        count,
        reverse: true,
        destroyWhenDone: false,
      })
      try {
        if (this.fetcher) {
          await this.fetcher.fetch()
        }
        resolve(true)
      } catch (error: any) {
        // Since the fetcher has errored, likely because of bad data fed by the peer,
        // the peer should be banned for at least a couple of seconds (default: 60s)
        // to refresh its status to find the next best peer to start a new fetcher.
        this.pool.ban(peer)
        this.config.logger.debug(
          `Fetcher error, temporarily banning ${peer.toString(true)}: ${error}`
        )
        reject(error)
      } finally {
        this.config.events.removeListener(Event.SYNC_SYNCHRONIZED, resolveSync)
        this.clearFetcher()
      }
    })
  }

  async processBlocks(execution: VMExecution, blocks: Block[] | BlockHeader[]) {
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
      `Imported blocks count=${blocks.length} first=${first} last=${last} hash=${hash} peers=${this.pool.size}`
    )

    if (!this.running) return

    // If we have linked the chain, run execution
    const { tail } = this.skeleton.bounds()
    if (tail.eqn(0)) {
      await execution.run()
    }
  }

  /**
   * Clears and destroys the fetcher
   */
  private clearFetcher() {
    if (this.fetcher) {
      this.fetcher.clear()
      this.fetcher.destroy()
      this.fetcher = null
    }
    this.running = false
  }

  /**
   * Stop synchronization. Returns a promise that resolves once its stopped.
   */
  async stop(): Promise<boolean> {
    if (!this.running) return false

    if (this.fetcher) {
      this.fetcher.destroy()
      this.fetcher = null
    }
    await super.stop()

    return true
  }

  /**
   * Close synchronizer.
   */
  async close() {
    if (!this.opened) return
    await super.close()
  }
}
