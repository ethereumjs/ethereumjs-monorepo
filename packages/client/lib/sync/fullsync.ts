import { BN } from 'ethereumjs-util'
import { Peer } from '../net/peer/peer'
import { short } from '../util'
import { Synchronizer, SynchronizerOptions } from './sync'
import { BlockFetcher } from './fetcher'
import { Block } from '@ethereumjs/block'
import { VMExecution } from './execution/vmexecution'
import { TxPool } from './txpool'
import { Event } from '../types'

/**
 * Implements an ethereum full sync synchronizer
 * @memberof module:sync
 */
export class FullSynchronizer extends Synchronizer {
  public execution: VMExecution

  public txPool: TxPool

  constructor(options: SynchronizerOptions) {
    super(options)

    this.execution = new VMExecution({
      config: options.config,
      stateDB: options.stateDB,
      chain: options.chain,
    })

    this.txPool = new TxPool({
      config: this.config,
    })

    this.config.events.on(Event.SYNC_EXECUTION_VM_ERROR, async () => {
      await this.stop()
    })

    this.config.events.on(Event.CHAIN_UPDATED, async () => {
      if (this.running) {
        await this.execution.run()
        this.checkTxPoolState()
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
   * Open synchronizer. Must be called before sync() is called
   */
  async open(): Promise<void> {
    await super.open()
    await this.chain.open()
    await this.execution.open()
    this.txPool.open()
    await this.pool.open()
    this.execution.syncing = true
    const number = this.chain.blocks.height.toNumber()
    const td = this.chain.blocks.td.toString(10)
    const hash = this.chain.blocks.latest!.hash()
    this.startingBlock = number
    this.config.chainCommon.setHardforkByBlockNumber(number)
    this.config.logger.info(
      `Latest local block: number=${number} td=${td} hash=${short(
        hash
      )} hardfork=${this.config.chainCommon.hardfork()}`
    )
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
    const result = await peer.eth?.getBlockHeaders({
      block: peer.eth!.status.bestHash,
      max: 1,
    })
    return result ? result[1][0] : undefined
  }

  /**
   * Checks if tx pool should be started
   */
  checkTxPoolState() {
    if (!this.syncTargetHeight || this.txPool.running) {
      return
    }
    // If height gte target, we are close enough to the
    // head of the chain that the tx pool can be started
    const target = this.syncTargetHeight.subn(this.txPool.BLOCKS_BEFORE_TARGET_HEIGHT_ACTIVATION)
    if (this.chain.headers.height.gte(target)) {
      this.txPool.start()
    }
  }

  /**
   * Sync all blocks and state from peer starting from current height.
   * @param  peer remote peer to sync with
   * @return Resolves when sync completed
   */
  async syncWithPeer(peer?: Peer): Promise<boolean> {
    // eslint-disable-next-line no-async-promise-executor
    return await new Promise(async (resolve, reject) => {
      if (!peer) return resolve(false)

      const latest = await this.latest(peer)
      if (!latest) return resolve(false)

      const height = latest.number
      if (!this.syncTargetHeight) {
        this.syncTargetHeight = height
        this.config.logger.info(
          `New sync target height number=${height.toString(10)} hash=${short(latest.hash())}`
        )
      }

      const first = this.chain.blocks.height.addn(1)
      const count = height.sub(first).addn(1)
      if (count.lten(0)) return resolve(false)

      this.config.logger.debug(
        `Syncing with peer: ${peer.toString(true)} height=${height.toString(10)}`
      )

      this.fetcher = new BlockFetcher({
        config: this.config,
        pool: this.pool,
        chain: this.chain,
        interval: this.interval,
        first,
        count,
        destroyWhenDone: false,
      })

      this.config.events.on(Event.SYNC_FETCHER_FETCHED, (blocks) => {
        blocks = blocks as Block[]
        const first = new BN(blocks[0].header.number)
        const hash = short(blocks[0].hash())
        const baseFeeAdd = this.config.chainCommon.gteHardfork('london')
          ? `basefee=${blocks[0].header.baseFeePerGas} `
          : ''
        this.config.logger.info(
          `Imported blocks count=${blocks.length} number=${first.toString(
            10
          )} hash=${hash} ${baseFeeAdd}hardfork=${this.config.chainCommon.hardfork()} peers=${
            this.pool.size
          }`
        )
        this.txPool.newBlocks(blocks)
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
    this.execution.syncing = false
    await this.execution.stop()
    this.txPool.stop()

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

  /**
   * Close synchronizer.
   * @return {Promise}
   */
  async close() {
    if (this.opened) {
      this.txPool.close()
    }
    await super.close()
  }
}
