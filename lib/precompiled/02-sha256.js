const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../constants.js').ERROR
const fees = require('ethereum-common')

module.exports = function (opts) {
  var data = opts.data
  var results = {}
  var gasCost = fees.sha256Gas.v

  results.gasUsed = gasCost
  var dataGas = Math.ceil(data.length / 32) * fees.sha256WordGas.v
  results.gasUsed += dataGas
  results.gasUsed = new BN(results.gasUsed)

  if (opts.gasLimit.cmp(new BN(gasCost + dataGas)) === -1) {
    results.gasUsed = opts.gasLimit
    results.exceptionError = error.OUT_OF_GAS
    results.exception = 0 // 0 means VM fail (in this case because of OOG)
    return results
  }

  results.return = utils.sha256(data)
  results.exception = 1

  return results
}
