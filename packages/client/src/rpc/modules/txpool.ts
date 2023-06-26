import { jsonRpcTx } from '../helpers'
import { middleware } from '../validation'

import type { EthereumClient } from '../..'
import type { FullEthereumService } from '../../service'
import type { TxPool as Pool } from '../../service/txpool'
import type { VM } from '@ethereumjs/vm'

/**
 * web3_* RPC module
 * @memberof module:rpc/modules
 */
export class TxPool {
  private _txpool: Pool
  private _vm: VM
  /**
   * Create web3_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient) {
    const service = client.services.find((s) => s.name === 'eth') as FullEthereumService
    this._txpool = service.txPool
    this._vm = service.execution.vm
    this.content = middleware(this.content.bind(this), 0, [])
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
