import type { Chain } from '../blockchain'
import type { Config } from '../config'
import type { AbstractLevel } from 'abstract-level'

export interface ExecutionOptions {
  /* Config */
  config: Config

  /* State database */
  stateDB?: AbstractLevel<string | Buffer | Uint8Array, string | Buffer, string | Buffer>

  /* Meta database (receipts, logs, indexes) */
  metaDB?: AbstractLevel<string | Buffer | Uint8Array, string | Buffer, string | Buffer>

  /** Chain */
  chain: Chain
}

export abstract class Execution {
  public config: Config

  protected stateDB?: AbstractLevel<string | Buffer | Uint8Array, string | Buffer, string | Buffer>
  protected metaDB?: AbstractLevel<string | Buffer | Uint8Array, string | Buffer, string | Buffer>
  protected chain: Chain

  public running: boolean = false
  public started: boolean = false

  /**
   * Create new execution module
   * @memberof module:sync/execution
   */
  constructor(options: ExecutionOptions) {
    this.config = options.config
    this.chain = options.chain
    this.stateDB = options.stateDB
    this.metaDB = options.metaDB
  }

  /**
   * Runs an execution
   *
   * @returns number quantifying execution run
   */
  abstract run(): Promise<number>

  /**
   * Starts execution
   */
  async open(): Promise<void> {
    this.started = true
    this.config.logger.info('Starting execution.')
  }

  /**
   * Stop execution. Returns a promise that resolves once stopped.
   */
  async stop(): Promise<boolean> {
    this.started = false
    this.config.logger.info('Stopped execution.')
    return true
  }
}
