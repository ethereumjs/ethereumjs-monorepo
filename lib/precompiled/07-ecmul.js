const utils = require('ethereumjs-util')
const ERROR = require('../constants.js').ERROR
const BN = utils.BN
const fees = require('ethereum-common')

const bn128_module = require('rustbn.js')
const ecMul_precompile = bn128_module.cwrap('ec_mul', 'string', ['string'])

module.exports = function (opts) {
  let results = {}
  let data = opts.data

  let inputHexStr = data.toString('hex')
  results.gasUsed = new BN(fees.ecMulGas.v)

  if (opts.gasLimit.lt(results.gasUsed)) {
    results.return = Buffer.alloc(0)
    results.exception = 0
    results.gasUsed = new BN(opts.gasLimit)
    results.exceptionError = ERROR.OUT_OF_GAS
    return results
  }

  try {
    let returnData = ecMul_precompile(inputHexStr)
    results.return = Buffer.from(returnData, 'hex')
    results.exception = 1
  } catch (e) {
    console.log('exception in ecMul precompile is expected. ignore previous panic...')
    // console.log(e)
    results.return = Buffer.alloc(0)
    results.exception = 0
  }


  return results
}
