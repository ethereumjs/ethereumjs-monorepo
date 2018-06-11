class Eth {
  constructor (chain) {
    this._chain = chain
  }

  getBlockByNumber (params, cb) {
    let [blockNumber] = params
    blockNumber = Number.parseInt(blockNumber, 16)
    this._chain.getBlock(blockNumber, (err, block) => {
      cb(err, block.toJSON(true))
    })
  }
}

module.exports = Eth
