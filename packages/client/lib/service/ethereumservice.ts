import { FlowControl } from '../net/protocol/flowcontrol'
import { Chain } from '../blockchain'
import { Service, ServiceOptions } from './service'
import { Synchronizer } from '../sync'
import { AbstractLevel } from 'abstract-level'

export interface EthereumServiceOptions extends ServiceOptions {
  /* Blockchain */
  chain: Chain

  /* Blockchain database */
  chainDB?: AbstractLevel<string | Buffer | Uint8Array, string | Buffer, string | Buffer>

  /* State database */
  stateDB?: AbstractLevel<string | Buffer | Uint8Array, string | Buffer, string | Buffer>

  /* Meta database (receipts, logs, indexes) */
  metaDB?: AbstractLevel<string | Buffer | Uint8Array, string | Buffer, string | Buffer>

  /* Sync retry interval in ms (default: 8000) */
  interval?: number

  /* Protocol timeout in ms (default: 6000) */
  timeout?: number
}

/**
 * Ethereum service
 * @memberof module:service
 */
export class EthereumService extends Service {
  public flow: FlowControl
  public chain: Chain
  public interval: number
  public timeout: number
  public synchronizer!: Synchronizer

  /**
   * Create new ETH service
   */
  constructor(options: EthereumServiceOptions) {
    super(options)

    this.flow = new FlowControl()
    this.chain = options.chain ?? new Chain(options)
    this.interval = options.interval ?? 8000
    this.timeout = options.timeout ?? 6000
  }

  /**
   * Service name
   */
  get name() {
    return 'eth'
  }

  /**
   * Open eth service. Must be called before service is started.
   */
  async open() {
    if (this.opened) {
      return false
    }
    await super.open()
    await this.chain.open()
    await this.synchronizer.open()
    return true
  }

  /**
   * Starts service and ensures blockchain is synchronized.
   */
  async start(): Promise<boolean> {
    if (this.running) {
      return false
    }
    await super.start()
    void this.synchronizer.start()
    return true
  }

  /**
   * Stop service. Interrupts blockchain synchronization if in progress.
   */
  async stop(): Promise<boolean> {
    if (!this.running) {
      return false
    }
    await this.synchronizer.stop()
    await super.stop()
    return true
  }

  /**
   * Close service.
   */
  async close() {
    if (this.opened) {
      await this.synchronizer.close()
    }
    await super.close()
  }
}
