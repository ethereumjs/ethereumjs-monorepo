const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../exceptions.js').ERROR
const assert = require('assert')

// For the v0.3 of the AddressBasedEncryption contract we need access from within the VM to the
// miner of past blocks.
module.exports = function (opts, cb) {
  assert(opts.data)

  let results = {}
  results.gasUsed = new BN(20)
  if (opts.gasLimit.lt(results.gasUsed)) {
    results.return = Buffer.alloc(0)
    results.exception = 0
    results.gasUsed = new BN(opts.gasLimit)
    results.exceptionError = error.OUT_OF_GAS
    cb(error.OUT_OF_GAS, results)
    return
  }

  const blockNumber = new BN(opts.data.slice(0, 32))
  opts.blockchain.getBlock(blockNumber.toArrayLike(Buffer, 'be', 32), function (err, targetBlock) {
    if (err) {
      return cb(err, results)
    }
    results.return = targetBlock.header.coinbase
    results.account = opts.account
    results.exception = 1
    cb(null, results)
  })
}
