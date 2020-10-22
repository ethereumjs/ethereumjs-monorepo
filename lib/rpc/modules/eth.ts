import { middleware, validators } from '../validation'
import { toBuffer, bufferToHex } from 'ethereumjs-util'

/**
 * eth_* RPC module
 * @memberof module:rpc/modules
 */
export class Eth {
  private _chain: any
  public ethVersion: any

  /**
   * Create eth_* RPC module
   * @param {Node} Node to which the module binds
   */
  constructor (node: any) {
    const service = node.services.find((s: any) => s.name === 'eth')
    this._chain = service.chain
    const ethProtocol = service.protocols.find((p: any) => p.name === 'eth')
    this.ethVersion = Math.max.apply(Math, ethProtocol.versions)

    this.blockNumber = middleware(this.blockNumber.bind(this), 0)

    this.getBlockByNumber = middleware(this.getBlockByNumber.bind(this), 2,
      [[validators.hex], [validators.bool]])

    this.getBlockByHash = middleware(this.getBlockByHash.bind(this), 2,
      [[validators.hex, validators.blockHash], [validators.bool]])

    this.getBlockTransactionCountByHash = middleware(this.getBlockTransactionCountByHash.bind(this), 1,
      [[validators.hex, validators.blockHash]])

    this.protocolVersion = middleware(this.protocolVersion.bind(this), 0, [])
  }

  /**
   * Returns Returns the number of most recent block.
   * @param  {Array<*>} [params] An empty array
   * @param  {Function} [cb] A function with an error object as the first argument and an actual value
   * as the second argument
   * @return {Promise}
   */
  async blockNumber (params=[], cb: (err: Error | null, val?: string) => void ) {
    try {
      const latestHeader = await this._chain.getLatestHeader()
      const latestBlockNumber = bufferToHex(latestHeader.number)
      cb(null, `${latestBlockNumber}`)
    } catch (err) {
      cb(err)
    }
  }

  /**
   * Returns information about a block by block number
   * @param  {Array<BN|bool>} [params] An array of two parameters: An big integer of a block number and a
   * boolean determining whether it returns full transaction objects or just the transaction hashes
   * @param  {Function} [cb] A function with an error object as the first argument and an actual value
   * as the second argument
   * @return {Promise}
   */
  async getBlockByNumber (params: any[] | boolean[], cb: (err: Error | null, val?: any) => void) {
    let [blockNumber, includeTransactions] = params

    blockNumber = Number.parseInt(blockNumber, 16)
    try {
      const block = await this._chain.getBlock(blockNumber)
      const json = block.toJSON(true)
      if (!includeTransactions) {
        json.transactions = json.transactions.map((tx: any) => tx.hash)
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
  async getBlockByHash (params: [string, boolean], cb: (err: Error | null, val?: any) => void) {
    let [blockHash, includeTransactions] = params

    try {
      let block = await this._chain.getBlock(toBuffer(blockHash))

      const json = block.toJSON(true)

      if (!includeTransactions) {
        json.transactions = json.transactions.map((tx: any) => tx.hash)
      }
      cb(null, json)
    } catch (err) {
      cb(err)
    }
  }

  /**
   * Returns the transaction count for a block given by the block hash
   * @param  {Array<string>} [params] An array of one parameter: A block hash
   * @param  {Function} [cb] A function with an error object as the first argument and an actual value
   * as the second argument
   * @return {Promise}
   */
  async getBlockTransactionCountByHash (params: string[], cb: (err: Error | null, val?: any) => void) {
    let [blockHash] = params

    try {
      let block = await this._chain.getBlock(toBuffer(blockHash))

      const json = block.toJSON(true)
      cb(null, `0x${json.transactions.length.toString(16)}`)
    } catch (err) {
      cb(err)
    }
  }

  /**
   * Returns the current ethereum protocol version
   * @param  {Array<*>} [params] An empty array
   * @param  {Function} [cb] A function with an error object as the first argument and a
   * hex-encoded string of the current protocol version as the second argument
   */
  protocolVersion (params = [], cb: (err: null, val: string) => void) {
    cb(null, `0x${this.ethVersion.toString(16)}`)
  }
}
