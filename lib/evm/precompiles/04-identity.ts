import BN = require('bn.js')
import { PrecompileInput, PrecompileResult, OOGResult } from './types'
const error = require('../../exceptions.js').ERROR
const assert = require('assert')

export default function (opts: PrecompileInput): PrecompileResult {
  assert(opts.data)

  const data = opts.data

  const gasUsed = new BN(opts._common.param('gasPrices', 'identity'))
  gasUsed.iadd(new BN(opts._common.param('gasPrices', 'identityWord')).imuln(Math.ceil(data.length / 32)))

  if (opts.gasLimit.lt(gasUsed)) {
    return OOGResult(opts.gasLimit)
  }

  return {
    gasUsed,
    return: data,
    exception: 1
  }
}
