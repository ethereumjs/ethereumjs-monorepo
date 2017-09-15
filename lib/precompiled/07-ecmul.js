const utils = require('ethereumjs-util')
const BN = utils.BN
const fees = require('ethereum-common')

const bn128_module = require('rustbn.js')
const ecMul_precompile = bn128_module.cwrap('ec_mul', 'string', ['string'])

module.exports = function (opts) {
  let results = {}
  let data = opts.data

  let inputHexStr = data.toString('hex')

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

  results.gasUsed = new BN(fees.ecMulGas.v)
  return results
}
