import utils from 'ethereumjs-util'
import {ERROR} from '../exceptions.js'
import fees from 'ethereum-common'
import assert from 'assert'
import bn128Module from 'rustbn.js'
const BN = utils.BN
const ecMulPrecompile = bn128Module.cwrap('ec_mul', 'string', ['string'])

export default function (opts) {
  assert(opts.data)

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

  let returnData = ecMulPrecompile(inputHexStr)

  // check ecmul success or failure by comparing the output length
  if (returnData.length !== 128) {
    results.return = Buffer.alloc(0)
    results.exception = 0
  } else {
    results.return = Buffer.from(returnData, 'hex')
    results.exception = 1
  }

  return results
}
