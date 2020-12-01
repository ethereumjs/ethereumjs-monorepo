import { middleware, validators } from '../validation'
import { addHexPrefix, keccak, toBuffer } from 'ethereumjs-util'
import { getClientVersion } from '../../util'

/**
 * web3_* RPC module
 * @memberof module:rpc/modules
 */
export class Web3 {
  private _chain: any

  /**
   * Create web3_* RPC module
   * @param {Node} Node to which the module binds
   */
  constructor(node: any) {
    const service = node.services.find((s: any) => s.name === 'eth')
    this._chain = service.chain

    this.clientVersion = middleware(this.clientVersion.bind(this), 0, [])

    this.sha3 = middleware(this.sha3.bind(this), 1, [[validators.hex]])
  }

  /**
   * Returns the current client version
   * @param  {Array<*>} [params] An empty array
   * @param  {Function} [cb] A function with an error object as the first argument and the
   * client version as the second argument
   */
  clientVersion(_params = [], cb: (err: null, version: string) => void) {
    const ethJsVersion = getClientVersion()
    cb(null, ethJsVersion)
  }

  /**
   * Returns Keccak-256 (not the standardized SHA3-256) of the given data
   * @param  {Array<string>} [params] The data to convert into a SHA3 hash
   * @param  {Function} [cb] A function with an error object as the first argument and the
   * Keccak-256 hash of the given data as the second argument
   */
  sha3(params: string[], cb: (err: Error | null, hash?: string) => void) {
    try {
      const rawDigest = keccak(toBuffer(params[0]))
      const hexEncodedDigest = addHexPrefix(rawDigest.toString('hex'))
      cb(null, hexEncodedDigest)
    } catch (err) {
      cb(err)
    }
  }
}
