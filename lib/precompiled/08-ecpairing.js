const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../exceptions.js').ERROR
const assert = require('assert')

const bn128 = require('rustbn.js')

module.exports = function (opts) {
  assert(opts.data)

  let results = {}
  let inputData = opts.data

  // no need to care about non-divisible-by-192, because bn128.pairing will properly fail in that case
  let inputDataSize = Math.floor(inputData.length / 192)

  const gascost = opts._common.param('gasPrices', 'ecPairing') + (inputDataSize * opts._common.param('gasPrices', 'ecPairingWord'))
  results.gasUsed = new BN(gascost)

  if (opts.gasLimit.ltn(gascost)) {
    results.return = Buffer.alloc(0)
    results.gasUsed = opts.gasLimit
    results.exceptionError = error.OUT_OF_GAS
    results.exception = 0 // 0 means VM fail (in this case because of OOG)
    return results
  }

  let returnData = bn128.pairing(inputData)

  // check ecpairing success or failure by comparing the output length
  if (returnData.length !== 32) {
    results.return = Buffer.alloc(0)
    results.gasUsed = opts.gasLimit
    results.exceptionError = error.OUT_OF_GAS
    results.exception = 0
  } else {
    results.return = returnData
    results.exception = 1
  }

  return results
}
