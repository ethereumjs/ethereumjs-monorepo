import BN = require('bn.js')
import { ripemd160 } from 'ethereumjs-util'
import { PrecompileInput } from './types'
import { OOGResult, ExecResult } from '../evm'
const assert = require('assert')

export default function(opts: PrecompileInput): ExecResult {
  assert(opts.data)

  const data = opts.data

  let gasUsed = new BN(opts._common.param('gasPrices', 'ripemd160'))
  gasUsed = gasUsed.add(
    new BN(opts._common.param('gasPrices', 'ripemd160Word')).muln(Math.ceil(data.length / 32)),
  )

  if (opts.gasLimit.lt(gasUsed)) {
    return OOGResult(opts.gasLimit)
  }

  return {
    gasUsed,
    returnValue: ripemd160(data, true),
  }
}
