import Common from '@ethereumjs/common'

export interface Options {
  /**
   * Specify the chain and hardfork by passing a Common instance.
   *
   * If not provided this defaults to chain `mainnet` and hardfork `chainstart`
   */
  common?: Common
}

export class Config {
  public common!: Common

  static instance: Config

  constructor(options: Options = {}) {
    if (Config.instance) {
      return Config.instance
    }

    // Initialize Common with an explicit 'chainstart' HF set until
    // hardfork awareness is implemented within the library
    // Also a fix for https://github.com/ethereumjs/ethereumjs-vm/issues/757

    // TODO: map chainParams (and lib/util.parseParams) to new Common format
    this.common = options.common || new Common({ chain: 'mainnet', hardfork: 'chainstart' })

    Config.instance = this
  }
}
