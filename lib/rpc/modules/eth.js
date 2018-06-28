const { middleware, validators } = require('../validation')

class Eth {
  constructor (chain) {
    this._chain = chain

    this.getBlockByNumber = middleware(this.getBlockByNumber.bind(this), 2,
      [validators.hex, validators.bool])
  }

  getBlockByNumber (params, cb) {
    let [blockNumber, includeTransactions] = params

    blockNumber = Number.parseInt(blockNumber, 16)
    this._chain.getBlock(blockNumber, (err, block) => {
      const json = block.toJSON(true)
      if (!includeTransactions) {
        json.transactions = json.transactions.map(tx => tx.hash)
      }
      cb(err, json)
    })
  }
}

module.exports = Eth
