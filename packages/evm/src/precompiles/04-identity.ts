import { short } from '@ethereumjs/util'

import { OOGResult } from '../evm'

import type { ExecResult } from '../evm'
import type { PrecompileInput } from './types'

export function precompile04(opts: PrecompileInput): ExecResult {
  const data = opts.data

  let gasUsed = opts._common.param('gasPrices', 'identity')
  gasUsed += opts._common.param('gasPrices', 'identityWord') * BigInt(Math.ceil(data.length / 32))
  if (opts._debug) {
    opts._debug(
      `Run IDENTITY (0x04) precompile data=${short(opts.data)} length=${
        opts.data.length
      } gasLimit=${opts.gasLimit} gasUsed=${gasUsed}`
    )
  }

  if (opts.gasLimit < gasUsed) {
    if (opts._debug) {
      opts._debug(`IDENTITY (0x04) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  if (opts._debug) {
    opts._debug(`IDENTITY (0x04) return data=${short(opts.data)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: Buffer.from(data), // Copy the memory (`Buffer.from()`)
  }
}
