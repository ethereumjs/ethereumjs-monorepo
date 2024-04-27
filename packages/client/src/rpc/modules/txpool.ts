import { callWithStackTrace, jsonRpcTx } from '../helpers.js'
import { middleware } from '../validation.js'

import type { EthereumClient } from '../../index.js'
import type { FullEthereumService } from '../../service/index.js'
import type { TxPool as Pool } from '../../service/txpool.js'
import type { VM } from '@ethereumjs/vm'

/**
 * web3_* RPC module
 * @memberof module:rpc/modules
 */
export class TxPool {
  private _txpool: Pool
  private _vm: VM
  private _rpcDebug: boolean

  /**
   * Create web3_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient, rpcDebug: boolean) {
    const service = client.services.find((s) => s.name === 'eth') as FullEthereumService
    this._txpool = service.txPool
    this._vm = service.execution.vm
    this._rpcDebug = rpcDebug

    this.content = middleware(callWithStackTrace(this.content.bind(this), this._rpcDebug), 0, [])
  }

  /**
   * Returns the contents of the transaction pool
   * @param params An empty array
   */
  content(_params = []) {
    const pending = new Map()
    for (const pool of this._txpool.pool) {
      const pendingForAcct = new Map<bigint, any>()
      for (const tx of pool[1]) {
        pendingForAcct.set(tx.tx.nonce, jsonRpcTx(tx.tx))
      }
      if (pendingForAcct.size > 0) pending.set('0x' + pool[0], Object.fromEntries(pendingForAcct))
    }
    return {
      pending: Object.fromEntries(pending),
    }
  }
}
