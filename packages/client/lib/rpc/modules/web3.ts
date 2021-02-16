import { middleware, validators } from '../validation'
import { addHexPrefix, keccak, toBuffer } from 'ethereumjs-util'
import { getClientVersion } from '../../util'
import { EthereumClient } from '../..'
import { Chain } from '../../blockchain'

/**
 * web3_* RPC module
 * @memberof module:rpc/modules
 */
export class Web3 {
  private _chain?: Chain

  /**
   * Create web3_* RPC module
   * @param {Node} Node to which the module binds
   */
  constructor(node: EthereumClient) {
    const service = node.services.find((s) => s.name === 'eth')
    this._chain = service?.chain

    this.clientVersion = middleware(this.clientVersion.bind(this), 0, [])

    this.sha3 = middleware(this.sha3.bind(this), 1, [[validators.hex]])
  }

  /**
   * Returns the current client version
   * @param  {Array<*>} [params] An empty array
   */
  clientVersion(_params = []) {
    return getClientVersion()
  }

  /**
   * Returns Keccak-256 (not the standardized SHA3-256) of the given data
   * @param  {Array<string>} [params] The data to convert into a SHA3 hash
   */
  sha3(params: string[]) {
    const rawDigest = keccak(toBuffer(params[0]))
    const hexEncodedDigest = addHexPrefix(rawDigest.toString('hex'))
    return hexEncodedDigest
  }
}
