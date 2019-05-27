import BN = require('bn.js')
import { ripemd160 } from 'ethereumjs-util'
import { PrecompileInput, PrecompileResult, OOGResult } from './types'
const assert = require('assert')

export default function(opts: PrecompileInput): PrecompileResult {
  assert(opts.data)

  const data = opts.data

  const gasUsed = new BN(opts._common.param('gasPrices', 'ripemd160'))
  gasUsed.iadd(
    new BN(opts._common.param('gasPrices', 'ripemd160Word')).imuln(Math.ceil(data.length / 32)),
  )

  if (opts.gasLimit.lt(gasUsed)) {
    return OOGResult(opts.gasLimit)
  }

  return {
    gasUsed,
    return: ripemd160(data, true),
    exception: 1,
  }
}
