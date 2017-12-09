const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../exceptions.js').ERROR
const fees = require('ethereum-common')
const assert = require('assert')

const bn128Module = require('rustbn.js')
const ecAddPrecompile = bn128Module.cwrap('ec_add', 'string', ['string'])

module.exports = function (opts) {
  assert(opts.data)

  let results = {}
  let data = opts.data
  let inputHexStr = data.toString('hex')

  results.gasUsed = new BN(fees.ecAddGas.v)
  if (opts.gasLimit.lt(results.gasUsed)) {
    results.return = Buffer.alloc(0)
    results.exception = 0
    results.gasUsed = new BN(opts.gasLimit)
    results.exceptionError = error.OUT_OF_GAS
    return results
  }

  let returnData = ecAddPrecompile(inputHexStr)

  // check ecadd success or failure by comparing the output length
  if (returnData.length !== 128) {
    results.return = Buffer.alloc(0)
    results.exception = 0
    results.gasUsed = new BN(opts.gasLimit)
    results.exceptionError = error.OUT_OF_GAS
  } else {
    results.return = Buffer.from(returnData, 'hex')
    results.exception = 1
  }

  return results
}
