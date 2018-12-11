'use strict'

const { middleware, validators } = require('../validation')
const { toBuffer } = require('ethereumjs-util')

/**
 * eth_* RPC module
 * @memberof module:rpc/modules
 */
class Eth {
  /**
   * Create eth_* RPC module
   * @param {Node} Node to which the module binds
   */
  constructor (node) {
    const service = node.services.find(s => s.name === 'eth')
    this._chain = service.chain
    const ethProtocol = service.protocols.find(p => p.name === 'eth')
    this.ethVersion = Math.max.apply(Math, ethProtocol.versions)

    this.getBlockByNumber = middleware(this.getBlockByNumber.bind(this), 2,
      [[validators.hex], [validators.bool]])

    this.getBlockByHash = middleware(this.getBlockByHash.bind(this), 2,
      [[validators.hex, validators.blockHash], [validators.bool]])

    this.protocolVersion = middleware(this.protocolVersion.bind(this), 0, [])
  }

  /**
   * Returns information about a block by block number
   * @param  {Array<BN|bool>} [params] An array of two parameters: An big integer of a block number and a
   * boolean determining whether it returns full transaction objects or just the transaction hashes
   * @param  {Function} [cb] A function with an error object as the first argument and an actual value
   * as the second argument
   * @return {Promise}
   */
  async getBlockByNumber (params, cb) {
    let [blockNumber, includeTransactions] = params

    blockNumber = Number.parseInt(blockNumber, 16)
    try {
      const block = await this._chain.getBlock(blockNumber)
      const json = block.toJSON(true)
      if (!includeTransactions) {
        json.transactions = json.transactions.map(tx => tx.hash)
      }
      cb(null, json)
    } catch (err) {
      cb(err)
    }
  }

  /**
   * Returns information about a block by hash
   * @param  {Array<string|bool>} [params] An array of two parameters: A block hash as the first argument and a
   * boolean determining whether it returns full transaction objects or just the transaction hashes
   * @param  {Function} [cb] A function with an error object as the first argument and an actual value
   * as the second argument
   * @return {Promise}
   */
  async getBlockByHash (params, cb) {
    let [blockHash, includeTransactions] = params

    try {
      let block = await this._chain.getBlock(toBuffer(blockHash))

      const json = block.toJSON(true)

      if (!includeTransactions) {
        json.transactions = json.transactions.map(tx => tx.hash)
      }
      cb(null, json)
    } catch (err) {
      cb(err)
    }
  }

  /**
   * Returns the current ethereum protocol version
   * @param  {Array<>} [params] An empty array
   * @param  {Function} [cb] A function with an error object as the first argument and a
   * hex-encoded string of the current protocol version as the second argument
   */
  protocolVersion (params, cb) {
    cb(null, `0x${this.ethVersion.toString(16)}`)
  }
}

module.exports = Eth
