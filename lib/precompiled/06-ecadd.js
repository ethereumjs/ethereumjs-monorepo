const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../constants.js').ERROR
const fees = require('ethereum-common')

const bn128_module = require('rustbn.js')
const ecAdd_precompile = bn128_module.cwrap('ec_add', 'string', ['string'])

module.exports = function (opts) {
  let results = {}
  let data = opts.data
  let inputHexStr = data.toString('hex')

  results.gasUsed = new BN(fees.ecAddGas.v)
  try {
    let returnData = ecAdd_precompile(inputHexStr)
    results.return = Buffer.from(returnData, 'hex')
    results.exception = 1
  } catch (e) {
    console.log('exception in ecAdd precompile is expected. ignore previous panic...')
    // console.log(e)
    results.return = Buffer.alloc(0)
    results.exception = 0
    results.gasUsed = new BN(opts.gasLimit)
    results.exceptionError = error.OUT_OF_GAS
  }

  return results
}
