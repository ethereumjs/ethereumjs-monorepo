'use strict'

const { middleware, validators } = require('../validation')
const { addHexPrefix, keccak256 } = require('ethereumjs-util')
const { platform } = require('os')

/**
 * web3_* RPC module
 * @memberof module:rpc/modules
 */
class Web3 {
  /**
   * Create web3_* RPC module
   * @param {Node} Node to which the module binds
   */
  constructor (node) {
    const service = node.services.find(s => s.name === 'eth')
    this._chain = service.chain

    this.clientVersion = middleware(this.clientVersion.bind(this), 0, [])

    this.sha3 = middleware(this.sha3.bind(this), 1, [[validators.hex]])
  }

  /**
   * Returns the current client version
   * @param  {Array<>} [params] An empty array
   * @param  {Function} [cb] A function with an error object as the first argument and the
   * client version as the second argument
   */
  clientVersion (params, cb) {
    const packageVersion = require('../../../package.json').version
    const { version } = process
    const ethJsVersion = `EthereumJS/${packageVersion}/${platform()}/node${version.substring(
      1
    )}`
    cb(null, ethJsVersion)
  }

  /**
   * Returns Keccak-256 (not the standardized SHA3-256) of the given data
   * @param  {Array<string>} [params] The data to convert into a SHA3 hash
   * @param  {Function} [cb] A function with an error object as the first argument and the
   * Keccak-256 hash of the given data as the second argument
   */
  sha3 (params, cb) {
    try {
      const rawDigest = keccak256(params[0])
      const hexEncodedDigest = addHexPrefix(rawDigest.toString('hex'))
      cb(null, hexEncodedDigest)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = Web3
