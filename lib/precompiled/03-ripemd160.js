const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../constants.js').ERROR
const fees = require('ethereum-common')

module.exports = function (opts) {
  var results = {}
  var data = opts.data

  results.gasUsed = new BN(fees.ripemd160Gas.v)
  results.gasUsed.iadd(new BN(fees.ripemd160WordGas.v).imuln(Math.ceil(data.length / 32)))

  if (opts.gasLimit.cmp(results.gasUsed) === -1) {
    results.gasUsed = opts.gasLimit
    results.exceptionError = error.OUT_OF_GAS
    results.exception = 0 // 0 means VM fail (in this case because of OOG)
    return results
  }

  results.return = utils.ripemd160(data, true)
  results.exception = 1

  return results
}
