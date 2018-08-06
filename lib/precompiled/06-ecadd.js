const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../exceptions.js').ERROR
const assert = require('assert')

const bn128 = require('rustbn.js')

module.exports = function (opts) {
  assert(opts.data)

  let results = {}
  let inputData = opts.data

  results.gasUsed = new BN(opts._common.param('gasPrices', 'ecAdd'))
  if (opts.gasLimit.lt(results.gasUsed)) {
    results.return = Buffer.alloc(0)
    results.exception = 0
    results.gasUsed = new BN(opts.gasLimit)
    results.exceptionError = error.OUT_OF_GAS
    return results
  }

  let returnData = bn128.add(inputData)

  // check ecadd success or failure by comparing the output length
  if (returnData.length !== 64) {
    results.return = Buffer.alloc(0)
    results.exception = 0
    results.gasUsed = new BN(opts.gasLimit)
    results.exceptionError = error.OUT_OF_GAS
  } else {
    results.return = returnData
    results.exception = 1
  }

  return results
}
