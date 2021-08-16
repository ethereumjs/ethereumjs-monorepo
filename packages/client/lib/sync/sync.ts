import { BN } from 'ethereumjs-util'
import { PeerPool } from '../net/peerpool'
import { Peer } from '../net/peer/peer'
import { FlowControl } from '../net/protocol'
import { Config } from '../config'
import { Chain } from '../blockchain'
import { Event } from '../types'
// eslint-disable-next-line implicit-dependencies/no-implicit
import type { LevelUp } from 'levelup'
import { BlockFetcher, HeaderFetcher } from './fetcher'

export interface SynchronizerOptions {
  /* Config */
  config: Config

  /* Peer pool */
  pool: PeerPool

  /* Blockchain */
  chain: Chain

  /* State database */
  stateDB?: LevelUp

  /* Flow control manager */
  flow?: FlowControl

  /* Refresh interval in ms (default: 1000) */
  interval?: number
}

/**
 * Base class for blockchain synchronizers
 * @memberof module:sync
 */
export abstract class Synchronizer {
  public config: Config

  protected pool: PeerPool
  protected chain: Chain
  protected flow: FlowControl
  protected interval: number
  public running: boolean
  protected forceSync: boolean
  public startingBlock: number

  /**
   * Create new node
   * @param {SynchronizerOptions}
   */
  constructor(options: SynchronizerOptions) {
    this.config = options.config

    this.pool = options.pool
    this.chain = options.chain
    this.flow = options.flow ?? new FlowControl()
    this.interval = options.interval ?? 1000
    this.running = false
    this.forceSync = false
    this.startingBlock = 0

    this.config.events.on(Event.POOL_PEER_ADDED, (peer) => {
      if (this.syncable(peer)) {
        this.config.logger.debug(`Found ${this.type} peer: ${peer}`)
      }
    })
  }

  abstract sync(): Promise<boolean>

  /**
   * Returns synchronizer type
   */
  get type(): string {
    return 'sync'
  }

  /**
   * Open synchronizer. Must be called before sync() is called
   * @return {Promise}
   */
  async open() {}

  /**
   * Returns true if peer can be used for syncing
   * @return {boolean}
   */
  // TODO: evaluate syncability of peer
  syncable(_peer: Peer): boolean {
    return true
  }

  /**
   * Start synchronization
   */
  async start(): Promise<void | boolean> {
    if (this.running) {
      return false
    }
    this.running = true
    const timeout = setTimeout(() => {
      this.forceSync = true
    }, this.interval * 30)
    while (this.running) {
      try {
        if (await this.sync()) {
          this.config.events.emit(Event.SYNC_SYNCHRONIZED, this.chain.blocks.height)
        }
      } catch (error) {
        this.config.events.emit(Event.SYNC_ERROR, error)
      }
      await new Promise((resolve) => setTimeout(resolve, this.interval))
    }
    this.running = false
    clearTimeout(timeout)
  }

  addNewBlockHandlers(peer: Peer, fetcher: BlockFetcher | HeaderFetcher) {
    peer.on('message', (message: any) => {
      if (message.name === 'NewBlockHashes') {
        let min: BN = new BN(-1)
        const data: any[] = message.data
        const blockNumberList: string[] = []
        data.forEach((value: any) => {
          const blockNumber: BN = value[1]
          blockNumberList.push(blockNumber.toString())
          if (min.eqn(-1) || blockNumber.lt(min)) {
            min = blockNumber
          }
        })
        if (min.eqn(-1)) {
          return
        }
        const numBlocks = blockNumberList.length

        // check if we can request the blocks in bulk
        let bulkRequest = true
        const minCopy = min.clone()
        for (let num = 1; num < numBlocks; num++) {
          min.iaddn(1)
          if (!blockNumberList.includes(min.toString())) {
            bulkRequest = false
            break
          }
        }

        if (bulkRequest) {
          // FIXME
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          fetcher.enqueueTask(
            {
              first: minCopy,
              count: numBlocks,
            },
            true
          )
        } else {
          data.forEach((value: any) => {
            const blockNumber: BN = value[1]
            // FIXME
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            fetcher.enqueueTask(
              {
                first: blockNumber,
                count: 1,
              },
              true
            )
          })
        }
      }
    })
  }

  /**
   * Stop synchronization. Returns a promise that resolves once stopped.
   */
  async stop(): Promise<boolean> {
    if (!this.running) {
      return false
    }
    await new Promise((resolve) => setTimeout(resolve, this.interval))
    this.running = false
    this.config.logger.info('Stopped synchronization.')
    return true
  }
}
