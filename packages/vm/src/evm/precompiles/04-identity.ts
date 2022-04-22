import { PrecompileInput } from './types'
import { OOGResult, ExecResult } from '../evm'
const assert = require('assert')

export default function (opts: PrecompileInput): ExecResult {
  assert(opts.data)

  const data = opts.data

  let gasUsed = opts._common.param('gasPrices', 'identity')
  gasUsed += opts._common.param('gasPrices', 'identityWord') * BigInt(Math.ceil(data.length / 32))

  if (opts.gasLimit < gasUsed) {
    return OOGResult(opts.gasLimit)
  }

  return {
    gasUsed,
    returnValue: data,
  }
}
