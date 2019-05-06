import BN = require('bn.js')
import { PrecompileInput, PrecompileResult, OOGResult } from './types'
const assert = require('assert')
const bn128 = require('rustbn.js')

export default function (opts: PrecompileInput): PrecompileResult {
  assert(opts.data)

  let inputData = opts.data

  const gasUsed = new BN(opts._common.param('gasPrices', 'ecAdd'))
  if (opts.gasLimit.lt(gasUsed)) {
    return OOGResult(opts.gasLimit)
  }

  const returnData = bn128.add(inputData)

  // check ecadd success or failure by comparing the output length
  if (returnData.length !== 64) {
    return OOGResult(opts.gasLimit)
  }

  return {
    gasUsed,
    return: returnData,
    exception: 1
  }
}
