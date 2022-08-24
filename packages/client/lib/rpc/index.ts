import { INTERNAL_ERROR } from './error-code'
import * as modules from './modules'

import type { EthereumClient } from '../client'
import type { Config } from '../config'

export const saveReceiptsMethods = ['getLogs', 'getTransactionReceipt', 'getTransactionByHash']

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
   * Returns bound methods for modules concat with underscore `_`
   * @param engine Pass true to return only `engine_` API endpoints (default: false)
   */
  getMethods(engine = false) {
    const methods: { [key: string]: Function } = {}
    const mods = modules.list.filter((name: string) =>
      engine ? name === 'Engine' : name !== 'Engine'
    )

    for (const modName of mods) {
      const mod = new (modules as any)[modName](this._client)
      const rpcMethods = RPCManager.getMethodNames((modules as any)[modName])
      for (const methodName of rpcMethods) {
        if (!this._config.saveReceipts && saveReceiptsMethods.includes(methodName)) {
          continue
        }
        const concatedMethodName = `${modName.toLowerCase()}_${methodName}`
        methods[concatedMethodName] = mod[methodName].bind((...params: any[]) => {
          try {
            mod(...params)
          } catch (error: any) {
            throw {
              code: INTERNAL_ERROR,
              message: error.message ?? error,
            }
          }
        })
      }
    }
    this._config.logger.debug(`RPC Initialized ${Object.keys(methods).join(', ')}`)
    return methods
  }

  /**
   * Returns all methods in a module
   */
  static getMethodNames(mod: Object): string[] {
    const methodNames = Object.getOwnPropertyNames((mod as any).prototype).filter(
      (methodName: string) => methodName !== 'constructor'
    )
    return methodNames
  }
}
