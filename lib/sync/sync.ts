import { Peer } from '../net/peer/peer'
import { EventEmitter } from 'events'
import { PeerPool } from '../net/peerpool'
import { Chain } from '../blockchain'
import { FlowControl } from '../net/protocol'
import { Config } from '../config'

const defaultOptions = {
  interval: 1000,
  minPeers: 3,
}

/**
 * Base class for blockchain synchronizers
 * @memberof module:sync
 */
export class Synchronizer extends EventEmitter {
  public config: Config

  protected pool: PeerPool
  protected chain: Chain
  protected flow: FlowControl
  protected minPeers: number
  protected interval: number
  protected running: boolean
  protected forceSync: boolean

  /**
   * Create new node
   * @param {Object}      options constructor parameters
   * @param {PeerPool}    options.pool peer pool
   * @param {Chain}       options.chain blockchain
   * @param {FlowControl} options.flow flow control manager
   * @param {number}      [options.minPeers=3] number of peers needed before syncing
   * @param {number}      [options.interval] refresh interval
   */
  constructor(options?: any) {
    super()

    this.config = new Config()

    options = { ...defaultOptions, ...options }

    this.pool = options.pool
    this.chain = options.chain
    this.flow = options.flow
    this.minPeers = options.minPeers
    this.interval = options.interval
    this.running = false
    this.forceSync = false
    this.pool.on('added', (peer: Peer) => {
      if (this.syncable(peer)) {
        this.config.logger.debug(`Found ${this.type} peer: ${peer}`)
      }
    })
  }

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
  syncable(_peer: any): boolean {
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
        // TODO: `sync` only defined on FastSynchronizer (which extends this class)
        // @ts-ignore: Property 'sync' does not exist on type 'Synchronizer'
        if (await this.sync()) this.emit('synchronized')
      } catch (error) {
        if (this.running) this.emit('error', error)
      }
      await new Promise((resolve) => setTimeout(resolve, this.interval))
    }
    this.running = false
    clearTimeout(timeout)
  }

  /**
   * Stop synchronization. Returns a promise that resolves once its stopped.
   */
  async stop(): Promise<boolean> {
    if (!this.running) {
      return false
    }
    await new Promise((resolve) => setTimeout(resolve, this.interval))
    this.running = false
    return true
  }
}
