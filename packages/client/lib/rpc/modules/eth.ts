import { Chain } from '../../blockchain'
import { middleware, validators } from '../validation'
import { BN, bufferToHex, toBuffer, stripHexPrefix } from 'ethereumjs-util'
import { EthereumClient } from '../..'

/**
 * eth_* RPC module
 * @memberof module:rpc/modules
 */
export class Eth {
  private _chain: Chain
  public ethVersion: number

  /**
   * Create eth_* RPC module
   * @param {Node} Node to which the module binds
   */
  constructor(node: EthereumClient) {
    const service = node.services.find((s) => s.name === 'eth')
    this._chain = service!.chain
    const ethProtocol = service!.protocols.find((p) => p.name === 'eth')
    this.ethVersion = Math.max.apply(Math, ethProtocol!.versions)

    this.blockNumber = middleware(this.blockNumber.bind(this), 0)

    this.getBlockByNumber = middleware(this.getBlockByNumber.bind(this), 2, [
      [validators.hex],
      [validators.bool],
    ])

    this.getBlockByHash = middleware(this.getBlockByHash.bind(this), 2, [
      [validators.hex, validators.blockHash],
      [validators.bool],
    ])

    this.getBlockTransactionCountByHash = middleware(
      this.getBlockTransactionCountByHash.bind(this),
      1,
      [[validators.hex, validators.blockHash]]
    )

    this.protocolVersion = middleware(this.protocolVersion.bind(this), 0, [])
  }

  /**
   * Returns number of the most recent block.
   * @param  {Array<*>} [params] An empty array
   * @return {Promise}
   */
  async blockNumber(_params = []) {
    const latestHeader = await this._chain.getLatestHeader()
    return `0x${latestHeader.number.toString(16)}`
  }

  /**
   * Returns information about a block by block number
   * @param  {Array<BN|bool>} [params] An array of two parameters: An big integer of a block number and a
   * boolean determining whether it returns full transaction objects or just the transaction hashes
   * @return {Promise}
   */
  async getBlockByNumber(params: [string, boolean]) {
    const [blockNumber, includeTransactions] = params
    const blockNumberBN = new BN(stripHexPrefix(blockNumber), 16)
    const block = await this._chain.getBlock(blockNumberBN)
    const json = block.toJSON()
    if (!includeTransactions) {
      json.transactions = block.transactions.map((tx) => bufferToHex(tx.hash())) as any
    }
    return json
  }

  /**
   * Returns information about a block by hash
   * @param  {Array<string|bool>} [params] An array of two parameters: A block hash as the first argument and a
   * boolean determining whether it returns full transaction objects or just the transaction hashes
   * @return {Promise}
   */
  async getBlockByHash(params: [string, boolean]) {
    const [blockHash, includeTransactions] = params

    const block = await this._chain.getBlock(toBuffer(blockHash))
    const json = block.toJSON()
    if (!includeTransactions) {
      json.transactions = block.transactions.map((tx) => bufferToHex(tx.hash())) as any
    }
    return json
  }

  /**
   * Returns the transaction count for a block given by the block hash
   * @param  {Array<string>} [params] An array of one parameter: A block hash
   * @return {Promise}
   */
  async getBlockTransactionCountByHash(params: [string]) {
    const [blockHash] = params
    const block = await this._chain.getBlock(toBuffer(blockHash))
    const json = block.toJSON()
    return `0x${json.transactions!.length.toString(16)}`
  }

  /**
   * Returns the current ethereum protocol version as a hex-encoded string
   * @param  {Array<*>} [params] An empty array
   */
  protocolVersion(_params = []) {
    return `0x${this.ethVersion.toString(16)}`
  }
}
