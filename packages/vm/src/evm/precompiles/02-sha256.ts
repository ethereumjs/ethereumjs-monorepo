import { sha256 } from 'ethereumjs-util'
import { PrecompileInput } from './types'
import { OOGResult, ExecResult } from '../evm'
const assert = require('assert')

export default function (opts: PrecompileInput): ExecResult {
  assert(opts.data)

  const data = opts.data

  let gasUsed = BigInt(opts._common.param('gasPrices', 'sha256'))
  gasUsed +=
    BigInt(opts._common.param('gasPrices', 'sha256Word')) * BigInt(Math.ceil(data.length / 32))

  if (opts.gasLimit < gasUsed) {
    return OOGResult(opts.gasLimit)
  }

  return {
    gasUsed,
    returnValue: sha256(data),
  }
}
