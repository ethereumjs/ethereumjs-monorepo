import Common from '@ethereumjs/common'
import { Logger } from 'winston'
import { defaultLogger } from './logging'

export interface Options {
  /**
   * Specify the chain and hardfork by passing a Common instance.
   *
   * If not provided this defaults to chain `mainnet` and hardfork `chainstart`
   */
  common?: Common
  /**
   * The logger instance with the log level set (winston)
   */
  logger?: Logger
  /**
   * Synchronization mode ('fast' or 'light')
   */
  syncmode?: string
  /**
   * Number of peers needed before syncing
   */
  minPeers?: number
  /**
   * Maximum peers allowed
   */
  maxPeers?: number
}

export class Config {
  public common: Common
  public logger: Logger
  public syncmode: string
  public minPeers: number
  public maxPeers: number

  constructor(options: Options = {}) {
    // Initialize Common with an explicit 'chainstart' HF set until
    // hardfork awareness is implemented within the library
    // Also a fix for https://github.com/ethereumjs/ethereumjs-vm/issues/757

    // TODO: map chainParams (and lib/util.parseParams) to new Common format
    this.common = options.common
      ? options.common
      : new Common({ chain: 'mainnet', hardfork: 'chainstart' })
    this.logger = options.logger ? options.logger : defaultLogger
    this.syncmode = options.syncmode ? options.syncmode : 'fast'
    this.minPeers = options.minPeers ? options.minPeers : 3
    this.maxPeers = options.maxPeers ? options.maxPeers : 25
  }
}
