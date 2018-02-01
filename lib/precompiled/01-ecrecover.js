const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../exceptions.js').ERROR
const fees = require('ethereum-common')
const assert = require('assert')

module.exports = function (opts) {
  assert(opts.data)

  var results = {}

  results.gasUsed = new BN(fees.ecrecoverGas.v)

  if (opts.gasLimit.lt(results.gasUsed)) {
    results.gasUsed = opts.gasLimit
    results.exception = 0 // 0 means VM fail (in this case because of OOG)
    results.exceptionError = error.OUT_OF_GAS
    return results
  }

  var data = utils.setLengthRight(opts.data, 128)

  var msgHash = data.slice(0, 32)
  var v = data.slice(32, 64)
  var r = data.slice(64, 96)
  var s = data.slice(96, 128)

  var publicKey
  try {
    publicKey = utils.ecrecover(msgHash, new BN(v).toNumber(), r, s)
  } catch (e) {
    return results
  }

  results.return = utils.setLengthLeft(utils.publicToAddress(publicKey), 32)
  results.exception = 1

  return results
}
