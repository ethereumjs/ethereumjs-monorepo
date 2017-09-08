const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../constants.js').ERROR

const bn128_module = require('rustbn.js')
const ecPairing_precompile = bn128_module.cwrap('ec_pairing', 'string', ['string'])

module.exports = function (opts) {
  let results = {}
  let data = opts.data

  let inputHexStr = data.toString('hex')
  let inputData = Buffer.from(inputHexStr, 'hex')
  let inputDataSize = Math.floor(inputData.length / 192)

  // Temporary, replace with finalized gas cost from EIP spec (via ethereum-common)
  const gascost = 100000 + (inputDataSize * 80000)
  results.gasUsed = new BN(gascost)

  if (opts.gasLimit.ltn(gascost)) {
    results.gasUsed = opts.gasLimit
    results.exceptionError = error.OUT_OF_GAS
    results.exception = 0 // 0 means VM fail (in this case because of OOG)
    return results
  }

  try {
    let returnData = ecPairing_precompile(inputHexStr)
    results.return = Buffer.from(returnData, 'hex')
    results.exception = 1
  } catch (e) {
    console.log('exception in ecPairing precompile is expected, ignore previous panic...')
    // console.log(e)
    results.return = Buffer.alloc(0)
    results.gasUsed = opts.gasLimit
    results.exceptionError = error.OUT_OF_GAS
    results.exception = 0
  }

  return results
}
