const { middleware, validators } = require('../validation')

class Eth {
  constructor (node) {
    const service = node.services.find(s => s.name === 'eth')
    this._chain = service.chain

    this.getBlockByNumber = middleware(this.getBlockByNumber.bind(this), 2,
      [validators.hex, validators.bool])
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
}

module.exports = Eth
