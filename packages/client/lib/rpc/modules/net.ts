import { EthereumService } from '../../service/ethereumservice'
import { middleware } from '../validation'
import { addHexPrefix } from 'ethereumjs-util'
import { EthereumClient } from '../..'

/**
 * net_* RPC module
 * @memberof module:rpc/modules
 */
export class Net {
  private _chain: any
  private _node: any
  private _peerPool: any

  /**
   * Create net_* RPC module
   * @param {Node} Node to which the module binds
   */
  constructor(node: EthereumClient) {
    const service: EthereumService = node.services.find((s: any) => s.name === 'eth')!
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
   * @param  {Function} [cb] A function with an error object as the first argument and the network
   * id as the second argument
   */
  version(_params = [], cb: (err: Error | null, id: string) => void) {
    cb(null, `${this._node.common.chainId()}`)
  }

  /**
   * Returns true if client is actively listening for network connections
   * @param  {Array<*>} [params] An empty array
   * @param  {Function} [cb] A function with an error object as the first argument and a boolean
   * that's true when the client is listening and false when it's not as the second argument
   */
  listening(_params = [], cb: (err: Error | null, isListening: boolean) => void) {
    cb(null, this._node.opened)
  }

  /**
   * Returns number of peers currently connected to the client
   * @param  {Array<*>} [params] An empty array
   * @param  {Function} [cb] A function with an error object as the first argument and the
   * number of peers connected to the client as the second argument
   */
  peerCount(_params = [], cb: (err: Error | null, numberOfPeers: string) => void) {
    cb(null, addHexPrefix(this._peerPool.peers.length.toString(16)))
  }
}
