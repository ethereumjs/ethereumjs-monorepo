import { short } from '@ethereumjs/util'

import { OOGResult } from '../evm.ts'

import { getPrecompileName } from './index.ts'
import { gasLimitCheck } from './util.ts'

import type { ExecResult } from '../types.ts'
import type { PrecompileInput } from './types.ts'

export function precompile04(opts: PrecompileInput): ExecResult {
  const pName = getPrecompileName('04')
  const data = opts.data

  let gasUsed = opts.common.param('identityGas')
  gasUsed += opts.common.param('identityWordGas') * BigInt(Math.ceil(data.length / 32))
  if (!gasLimitCheck(opts, gasUsed, pName)) {
    return OOGResult(opts.gasLimit)
  }

  if (opts._debug !== undefined) {
    opts._debug(`${pName} return data=${short(opts.data)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: Uint8Array.from(data), // Copy the memory (`Uint8Array.from()`)
  }
}
