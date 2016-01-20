const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../constants.js').ERROR
const fees = require('ethereum-common')
const gasCost = new BN(fees.ecrecoverGas.v)

module.exports = function (opts) {
  var results = {}

  if (opts.gasLimit.cmp(gasCost) === -1) {
    results.gasUsed = opts.gasLimit
    results.exception = 0 // 0 means VM fail (in this case because of OOG)
    results.exceptionError = error.OUT_OF_GAS
    return results
  }

  results.gasUsed = gasCost

  var data = utils.rpad(opts.data, 128)

  var msgHash = data.slice(0, 32)
  var v = data.slice(32, 64)
  var r = data.slice(64, 96)
  var s = data.slice(96, 128)

  var publicKey
  try {
    publicKey = utils.ecrecover(msgHash, v, r, s)
  } catch (e) {
    return results
  }

  results.return = utils.pad(utils.publicToAddress(publicKey), 32)
  results.exception = 1
  return results
}
