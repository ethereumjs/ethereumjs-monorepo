import { isFalsy } from '@ethereumjs/util'

import type { ExecResult } from '../evm'
import { OOGResult } from '../evm'
import type { PrecompileInput } from './types'

export function precompile04(opts: PrecompileInput): ExecResult {
  if (isFalsy(opts.data)) throw new Error('opts.data missing but required')

  const data = opts.data

  let gasUsed = opts._common.param('gasPrices', 'identity')
  gasUsed += opts._common.param('gasPrices', 'identityWord') * BigInt(Math.ceil(data.length / 32))

  if (opts.gasLimit < gasUsed) {
    return OOGResult(opts.gasLimit)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: data,
  }
}
