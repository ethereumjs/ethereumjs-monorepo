import { Chain } from '../blockchain'
import { FlowControl } from '../net/protocol/flowcontrol'
import { getV8Engine } from '../util'

import { Service } from './service'

import type { Synchronizer } from '../sync'
import type { V8Engine } from '../util'
import type { ServiceOptions } from './service'
import type { AbstractLevel } from 'abstract-level'

export interface EthereumServiceOptions extends ServiceOptions {
  /* Blockchain */
  chain: Chain

  /* Blockchain database */
  chainDB?: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>

  /* State database */
  stateDB?: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>

  /* Meta database (receipts, logs, indexes) */
  metaDB?: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>

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
  public synchronizer?: Synchronizer

  // A handle to v8Engine lib for mem stats, assigned on open if running in node
  private v8Engine: V8Engine | null = null

  /**
   * Interval for client stats output (e.g. memory) (in ms)
   */
  private STATS_INTERVAL = 30000

  /**
   * Shutdown the client when memory threshold is reached (in percent)
   *
   */
  private MEMORY_SHUTDOWN_THRESHOLD = 92

  private _statsInterval: NodeJS.Timeout | undefined /* global NodeJS */

  /**
   * Create new ETH service
   */
  constructor(options: EthereumServiceOptions) {
    super(options)

    this.flow = new FlowControl()
    // @ts-ignore TODO replace with async create constructor
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
    await this.synchronizer?.open()
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
    void this.synchronizer?.start()

    if (this.v8Engine === null) {
      this.v8Engine = await getV8Engine()
    }

    this._statsInterval = setInterval(
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await this.stats.bind(this),
      this.STATS_INTERVAL
    )

    return true
  }

  stats() {
    if (this.v8Engine !== null) {
      const { used_heap_size, heap_size_limit } = this.v8Engine.getHeapStatistics()

      const heapUsed = Math.round(used_heap_size / 1000 / 1000) // MB
      const percentage = Math.round((100 * used_heap_size) / heap_size_limit)
      this.config.logger.info(`Memory stats usage=${heapUsed} MB percentage=${percentage}%`)

      if (percentage >= this.MEMORY_SHUTDOWN_THRESHOLD && !this.config.shutdown) {
        this.config.logger.error('EMERGENCY SHUTDOWN DUE TO HIGH MEMORY LOAD...')
        process.kill(process.pid, 'SIGINT')
      }
    }
  }

  /**
   * Stop service. Interrupts blockchain synchronization if in progress.
   */
  async stop(): Promise<boolean> {
    if (!this.running) {
      return false
    }
    clearInterval(this._statsInterval)
    await this.synchronizer?.stop()
    await super.stop()
    return true
  }

  /**
   * Close service.
   */
  async close() {
    if (this.opened) {
      await this.synchronizer?.close()
    }
    await super.close()
  }
}
