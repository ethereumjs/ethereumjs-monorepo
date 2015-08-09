const BN = require('bn.js')
const fees = require('ethereum-common')
const error = require('../constants.js').ERROR

module.exports = function(opts){
  var data = opts.data
  var results = {}

  results.gasUsed =  new BN(Math.ceil(data.length / 32) * fees.identityWordGas.v  +  fees.identityGas.v)
  results.exception = 1
  results.return =  opts.data

  if (opts.gasLimit.cmp(new BN(results.gasUsed)) === -1) {
    results.gasUsed = opts.gasLimit
    results.exceptionError = error.OUT_OF_GAS
    results.exception = 0 // 0 means VM fail (in this case because of OOG)
    return results
  }

  return results
}
