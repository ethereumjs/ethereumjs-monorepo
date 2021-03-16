import { BN } from 'ethereumjs-util'
import { Peer } from '../net/peer/peer'
import { short } from '../util'
import { Synchronizer, SynchronizerOptions } from './sync'
import { BlockFetcher } from './fetcher'
import { Block } from '@ethereumjs/block'
import { VMExecution } from './execution/vmexecution'

/**
 * Implements an ethereum full sync synchronizer
 * @memberof module:sync
 */
export class FullSynchronizer extends Synchronizer {
  private blockFetcher: BlockFetcher | null

  public hardfork: string = ''
  public execution: VMExecution

  constructor(options: SynchronizerOptions) {
    super(options)
    this.blockFetcher = null

    this.execution = new VMExecution({
      config: options.config,
      stateDB: options.stateDB,
      chain: options.chain,
    })

    const self = this
    this.execution.on('error', async (error: Error) => {
      self.emit('error', error)
      await self.stop()
    })

    this.chain.on('updated', async function () {
      // for some reason, if we use .on('updated', this.runBlocks)
      // it runs in the context of the Chain and not in the FullSync context..?
      if (self.running) {
        await self.execution.run()
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.chain.update()
  }

  /**
   * Returns synchronizer type
   * @return {string} type
   */
  get type(): string {
    return 'full'
  }

  /**
   * Returns true if peer can be used for syncing
   * @return {boolean}
   */
  syncable(peer: Peer): boolean {
    return peer.eth !== undefined
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
      if (peer.eth?.status) {
        const td = peer.eth.status.td
        if (
          (!best && td.gte(this.chain.blocks.td)) ||
          (best && best.eth && best.eth.status.td.lt(td))
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
    const headers = await peer.eth?.getBlockHeaders({
      block: peer.eth!.status.bestHash,
      max: 1,
    })
    return headers?.[0]
  }

  /**
   * Sync all blocks and state from peer starting from current height.
   * @param  peer remote peer to sync with
   * @return Resolves when sync completed
   */
  async syncWithPeer(peer?: Peer): Promise<boolean> {
    if (!peer) return false
    const latest = await this.latest(peer)
    if (!latest) return false
    const height = new BN(latest.number)
    const first = this.chain.blocks.height.addn(1)
    const count = height.sub(first).addn(1)
    if (count.lten(0)) return false

    const nextForkBlock = this.config.chainCommon.nextHardforkBlockBN()
    if (nextForkBlock) {
      if (first.gte(nextForkBlock)) {
        this.config.chainCommon.setHardforkByBlockNumber(first)
        this.hardfork = this.config.chainCommon.hardfork()
      }
    }

    this.config.logger.debug(
      `Syncing with peer: ${peer.toString(true)} height=${height.toString(10)}`
    )

    this.blockFetcher = new BlockFetcher({
      config: this.config,
      pool: this.pool,
      chain: this.chain,
      interval: this.interval,
      first,
      count,
    })
    this.blockFetcher
      .on('error', (error: Error) => {
        this.emit('error', error)
      })
      .on('fetched', (blocks: Block[]) => {
        const first = new BN(blocks[0].header.number)
        const hash = short(blocks[0].hash())
        this.config.logger.info(
          `Imported blocks count=${blocks.length} number=${first.toString(
            10
          )} hash=${hash} hardfork=${this.hardfork} peers=${this.pool.size}`
        )
      })
    await this.blockFetcher.fetch()
    // TODO: Should this be deleted?
    // @ts-ignore: error: The operand of a 'delete' operator must be optional
    delete this.blockFetcher
    return true
  }

  /**
   * Fetch all blocks from current height up to highest found amongst peers
   * @return Resolves with true if sync successful
   */
  async sync(): Promise<boolean> {
    const peer = this.best()
    return this.syncWithPeer(peer)
  }

  /**
   * Chain was updated
   * @param  {Object[]} announcements new block hash announcements
   * @param  {Peer}     peer peer
   * @return {Promise}
   */
  async announced(announcements: any[], _peer: Peer) {
    if (announcements.length) {
      const [hash, height] = announcements[announcements.length - 1]
      this.config.logger.debug(`New height: number=${height.toString(10)} hash=${short(hash)}`)
      // TO DO: download new blocks
    }
  }

  /**
   * Open synchronizer. Must be called before sync() is called
   */
  async open(): Promise<void> {
    await this.chain.open()
    await this.execution.open()
    await this.pool.open()
    this.execution.syncing = true
    const number = this.chain.blocks.height.toNumber()
    const td = this.chain.blocks.td.toString(10)
    const hash = this.chain.blocks.latest!.hash()
    this.config.chainCommon.setHardforkByBlockNumber(number)
    this.hardfork = this.config.chainCommon.hardfork()
    this.config.logger.info(
      `Latest local block: number=${number} td=${td} hash=${short(hash)} hardfork=${this.hardfork}`
    )
  }

  /**
   * Stop synchronization. Returns a promise that resolves once its stopped.
   * @return {Promise}
   */
  async stop(): Promise<boolean> {
    this.execution.syncing = false
    await this.execution.stop()

    if (!this.running) {
      return false
    }

    if (this.blockFetcher) {
      this.blockFetcher.destroy()
      // TODO: Should this be deleted?
      // @ts-ignore: error: The operand of a 'delete' operator must be optional
      delete this.blockFetcher
    }
    await super.stop()

    return true
  }
}
