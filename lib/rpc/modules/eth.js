const { middleware, validators } = require('../validation')
const { toBuffer } = require('ethereumjs-util')
class Eth {
  constructor (node) {
    const service = node.services.find(s => s.name === 'eth')
    this._chain = service.chain

    this.getBlockByNumber = middleware(this.getBlockByNumber.bind(this), 2,
      [[validators.hex], [validators.bool]])

    this.getBlockByHash = middleware(this.getBlockByHash.bind(this), 2,
      [[validators.hex, validators.blockHash], [validators.bool]])
  }

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
}

module.exports = Eth
