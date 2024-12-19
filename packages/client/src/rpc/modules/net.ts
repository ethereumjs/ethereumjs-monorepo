import { addHexPrefix } from '@ethereumjs/util'

import { callWithStackTrace } from '../helpers.js'

import type { Chain } from '../../blockchain/index.js'
import type { EthereumClient } from '../../index.js'
import type { PeerPool } from '../../net/peerpool.js'
import type { FullEthereumService } from '../../service/fullethereumservice.js'

/**
 * net_* RPC module
 * @memberof module:rpc/modules
 */
export class Net {
  private _chain: Chain
  private _client: EthereumClient
  private _peerPool: PeerPool
  private _rpcDebug: boolean

  /**
   * Create net_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient, rpcDebug: boolean) {
    const service = client.service as FullEthereumService
    this._chain = service.chain
    this._client = client
    this._peerPool = service.pool
    this._rpcDebug = rpcDebug

    this.version = callWithStackTrace(this.version.bind(this), this._rpcDebug)
    this.listening = callWithStackTrace(this.listening.bind(this), this._rpcDebug)
    this.peerCount = callWithStackTrace(this.peerCount.bind(this), this._rpcDebug)
  }

  /**
   * Returns the current network id
   */
  version() {
    return this._chain.config.chainCommon.chainId().toString()
  }

  /**
   * Returns true if client is actively listening for network connections
   */
  listening() {
    return this._client.opened
  }

  /**
   * Returns number of peers currently connected to the client
   */
  peerCount() {
    return addHexPrefix(this._peerPool.peers.length.toString(16))
  }
}
