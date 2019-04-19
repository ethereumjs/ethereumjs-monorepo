import BN = require('bn.js')
import { sha256 } from 'ethereumjs-util'
import { PrecompileInput, PrecompileResult, OOGResult } from './types'
const error = require('../../exceptions.js').ERROR
const assert = require('assert')

export default function (opts: PrecompileInput): PrecompileResult {
  assert(opts.data)

  const data = opts.data

  const gasUsed = new BN(opts._common.param('gasPrices', 'sha256'))
  gasUsed.iadd(new BN(opts._common.param('gasPrices', 'sha256Word')).imuln(Math.ceil(data.length / 32)))

  if (opts.gasLimit.lt(gasUsed)) {
    return OOGResult(opts.gasLimit)
  }

  return {
    gasUsed,
    return: sha256(data),
    exception: 1
  }
}
