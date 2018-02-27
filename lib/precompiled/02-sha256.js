import utils from 'ethereumjs-util'
import {ERROR as error} from '../exceptions.js'
import fees from 'ethereum-common'
import assert from 'assert'
const BN = utils.BN

export default function (opts) {
  assert(opts.data)

  var results = {}
  var data = opts.data

  results.gasUsed = new BN(fees.sha256Gas.v)
  results.gasUsed.iadd(new BN(fees.sha256WordGas.v).imuln(Math.ceil(data.length / 32)))

  if (opts.gasLimit.lt(results.gasUsed)) {
    results.gasUsed = opts.gasLimit
    results.exceptionError = error.OUT_OF_GAS
    results.exception = 0 // 0 means VM fail (in this case because of OOG)
    return results
  }

  results.return = utils.sha256(data)
  results.exception = 1

  return results
}
