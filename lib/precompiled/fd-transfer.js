const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../exceptions.js').ERROR
const assert = require('assert')

module.exports = function (opts, cb) {
  assert(opts.data)

  var results = {}

  // TODO(asa): Pick an appropriate gas amount
  results.gasUsed = new BN(20)
  if (opts.gasLimit.lt(results.gasUsed)) {
    results.return = Buffer.alloc(0)
    results.gasUsed = opts.gasLimit
    results.exceptionError = error.OUT_OF_GAS
    results.exception = 0 // 0 means VM fail (in this case because of OOG)
    cb(error.OUT_OF_GAS, results)
    return
  }

  // These are all correct!
  const from = new BN(opts.data.slice(0, 32))
  const to = new BN(opts.data.slice(32, 64))
  const value = new BN(opts.data.slice(64, 96))
  const incrementBalance = function(address, delta) {
    opts.stateManager.getAccountBalance(address, function (err, balance) {
      if (err) {
        return cb(err, results)
      } else {
        const newBalance = new BN(balance).add(new BN(delta))
        opts.stateManager.putAccountBalance(address,  newBalance, function(err) {
          if (err) {
            return cb(err, results)
          }
        })
      }
    })
  }

  incrementBalance(from, -1 * value)
  incrementBalance(to, value)

  results.return = true
  results.exception = 1
  cb(null, results)
}
