import { Config } from '../config'
import EthereumClient from '../client'
import * as modules from './modules'

/**
 * @module rpc
 */

/**
 * RPC server manager
 * @memberof module:rpc
 */
export class RPCManager {
  private _config: Config
  private _client: EthereumClient

  constructor(client: EthereumClient, config: Config) {
    this._config = config
    this._client = client
  }

  /**
   * gets methods for all modules which concat with underscore "_"
   * e.g. convert getBlockByNumber() in eth module to { eth_getBlockByNumber }
   * @return {Object} methods
   */
  getMethods(): any {
    const methods: any = {}

    modules.list.forEach((modName: string) => {
      this._config.logger.debug(`Initialize ${modName} module`)
      const mod = new (modules as any)[modName](this._client)

      RPCManager.getMethodNames((modules as any)[modName])
        .filter((methodName: string) => methodName !== 'constructor')
        .forEach((methodName: string) => {
          const concatedMethodName = `${modName.toLowerCase()}_${methodName}`

          this._config.logger.debug(`Setup module method '${concatedMethodName}' to RPC`)
          methods[concatedMethodName] = mod[methodName].bind(mod)
        })
    })

    return methods
  }

  /**
   * get all methods. e.g., getBlockByNumber in eth module
   * @param Object mod
   * @returns string[]
   */
  static getMethodNames(mod: any): string[] {
    const methodNames = Object.getOwnPropertyNames(mod.prototype).filter(
      (methodName: string) => methodName !== 'constructor'
    )
    return methodNames
  }
}
