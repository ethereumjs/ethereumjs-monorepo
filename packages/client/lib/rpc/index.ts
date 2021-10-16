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
   * Returns bound methods for all modules, concat with underscore `_`
   */
  getMethods() {
    const methods: { [key: string]: Function } = {}

    for (const modName of modules.list) {
      if (modName === 'Engine' && this._config.rpcEngine === false) {
        // Skip `engine_` namespace if rpcEngine is not enabled
        continue
      }
      if (this._config.rpcDebug) {
        this._config.logger.debug('='.repeat(29))
        this._config.logger.debug(`RPC: Initialize ${modName} module`)
        this._config.logger.debug('='.repeat(29))
      }

      const mod = new (modules as any)[modName](this._client)
      const rpcMethods = RPCManager.getMethodNames((modules as any)[modName])
      for (const methodName of rpcMethods) {
        if (methodName === 'getLogs' && !this._config.rpcStubGetLogs) {
          continue
        }
        const concatedMethodName = `${modName.toLowerCase()}_${methodName}`
        if (this._config.rpcDebug) {
          this._config.logger.debug(`Setup method ${concatedMethodName}`)
        }
        methods[concatedMethodName] = mod[methodName].bind(mod)
      }
      if (this._config.rpcDebug) {
        this._config.logger.debug('')
      }
    }
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
