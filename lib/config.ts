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
  public common!: Common
  public logger!: Logger
  public syncmode!: string
  public minPeers!: number
  public maxPeers!: number

  static instance: Config

  constructor(options: Options = {}) {
    if (!Config.instance) {
      Config.instance = this

      // Set default values on first initialization

      // Initialize Common with an explicit 'chainstart' HF set until
      // hardfork awareness is implemented within the library
      // Also a fix for https://github.com/ethereumjs/ethereumjs-vm/issues/757

      // TODO: map chainParams (and lib/util.parseParams) to new Common format
      Config.instance.common = new Common({ chain: 'mainnet', hardfork: 'chainstart' })
      Config.instance.logger = defaultLogger
      Config.instance.syncmode = 'fast'
      Config.instance.minPeers = 3
      Config.instance.maxPeers = 25
    }

    if (options.common) {
      Config.instance.common = options.common
    }
    if (options.logger) {
      Config.instance.logger = options.logger
    }
    if (options.syncmode) {
      Config.instance.syncmode = options.syncmode
    }
    if (options.minPeers) {
      Config.instance.minPeers = options.minPeers
    }
    if (options.maxPeers) {
      Config.instance.maxPeers = options.maxPeers
    }

    return Config.instance
  }
}
