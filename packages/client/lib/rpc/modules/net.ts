import { Chain } from '../../blockchain'
import { EthereumService } from '../../service/ethereumservice'
import { middleware } from '../validation'
import { addHexPrefix } from 'ethereumjs-util'
import { EthereumClient } from '../..'
import { PeerPool } from '../../net/peerpool'

/**
 * net_* RPC module
 * @memberof module:rpc/modules
 */
export class Net {
  private _chain: Chain
  private _node: EthereumClient
  private _peerPool: PeerPool

  /**
   * Create net_* RPC module
   * @param {Node} Node to which the module binds
   */
  constructor(node: EthereumClient) {
    const service: EthereumService = node.services.find((s) => s.name === 'eth')!
    this._chain = service.chain
    this._node = node
    this._peerPool = service.pool

    this.version = middleware(this.version.bind(this), 0, [])
    this.listening = middleware(this.listening.bind(this), 0, [])
    this.peerCount = middleware(this.peerCount.bind(this), 0, [])
  }

  /**
   * Returns the current network id
   * @param  {Array<*>} [params] An empty array
   */
  version(_params = []) {
    return `${this._chain.config.chainCommon.chainId()}`
  }

  /**
   * Returns true if client is actively listening for network connections
   * @param  {Array<*>} [params] An empty array
   */
  listening(_params = []) {
    return this._node.opened
  }

  /**
   * Returns number of peers currently connected to the client
   * @param  {Array<*>} [params] An empty array
   */
  peerCount(_params = []) {
    return addHexPrefix(this._peerPool.peers.length.toString(16))
  }
}
