const utils = require('ethereumjs-util')
const ERROR = require('../exceptions.js').ERROR
const BN = utils.BN
const assert = require('assert')

const bn128 = require('rustbn.js')

module.exports = function (opts) {
  assert(opts.data)
  
  console.log('ECMUL IN', opts)


  let results = {}
  let inputData = opts.data

  console.log('ECMUL INPUTDATA', inputData.toString('hex'))

  results.gasUsed = new BN(opts._common.param('gasPrices', 'ecMul'))

  if (opts.gasLimit.lt(results.gasUsed)) {
    results.return = Buffer.alloc(0)
    results.exception = 0
    results.gasUsed = new BN(opts.gasLimit)
    results.exceptionError = ERROR.OUT_OF_GAS

    console.log('ECMUL OUT', results)
    return results
  }

  // bn128.mul will behave with inputData as calldatacopy (e.g. fill with zeroes)
  let returnData = bn128.mul(inputData)

  console.log('ECMUL RETURNDATA', returnData.toString('hex'))

  // check ecmul success or failure by comparing the output length
  if (returnData.length !== 64) {
    results.return = Buffer.alloc(0)
    results.exception = 0
    results.gasUsed = new BN(opts.gasLimit)
    results.exceptionError = ERROR.OUT_OF_GAS
  } else {
    results.return = returnData
    results.exception = 1
  }

  console.log('ECMUL OUT', results)

  return results
}
