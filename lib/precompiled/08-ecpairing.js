const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../constants.js').ERROR
const fees = require('ethereum-common')
const assert = require('assert')

const bn128Module = require('rustbn.js')
const ecPairingPrecompile = bn128Module.cwrap('ec_pairing', 'string', ['string'])

module.exports = function (opts) {
  assert(opts.data)

  let results = {}
  let data = opts.data

  let inputHexStr = data.toString('hex')
  let inputData = Buffer.from(inputHexStr, 'hex')
  let inputDataSize = Math.floor(inputData.length / 192)

  const gascost = fees.ecPairingGas.v + (inputDataSize * fees.ecPairingWordGas.v)
  results.gasUsed = new BN(gascost)

  if (opts.gasLimit.ltn(gascost)) {
    results.gasUsed = opts.gasLimit
    results.exceptionError = error.OUT_OF_GAS
    results.exception = 0 // 0 means VM fail (in this case because of OOG)
    return results
  }

  let returnData = ecPairingPrecompile(inputHexStr)

  // check ecpairing success or failure by comparing the output length
  if (returnData.length !== 64) {
    results.return = Buffer.alloc(0)
    results.gasUsed = opts.gasLimit
    results.exceptionError = error.OUT_OF_GAS
    results.exception = 0
  } else {
    results.return = Buffer.from(returnData, 'hex')
    results.exception = 1
  }

  return results
}
