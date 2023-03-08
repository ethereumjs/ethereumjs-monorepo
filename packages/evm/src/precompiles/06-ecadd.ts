import { short } from '@ethereumjs/util'

import { OOGResult } from '../evm'

import type { ExecResult } from '../evm'
import type { PrecompileInput } from './types'

const bn128 = require('rustbn.js')

export function precompile06(opts: PrecompileInput): ExecResult {
  const inputData = opts.data.slice(0, 128)

  const gasUsed = opts._common.param('gasPrices', 'ecAdd')
  if (opts._debug) {
    opts._debug(
      `Run ECADD (0x06) precompile data=${short(opts.data)} length=${opts.data.length} gasLimit=${
        opts.gasLimit
      } gasUsed=${gasUsed}`
    )
  }
  if (opts.gasLimit < gasUsed) {
    if (opts._debug) {
      opts._debug(`ECADD (0x06) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  const returnData: Buffer = bn128.add(inputData)

  // check ecadd success or failure by comparing the output length
  if (returnData.length !== 64) {
    if (opts._debug) {
      opts._debug(`ECADD (0x06) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  if (opts._debug) {
    opts._debug(`ECADD (0x06) return value=${returnData.toString('hex')}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: returnData,
  }
}
