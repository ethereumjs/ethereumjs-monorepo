import { short } from '@ethereumjs/util'

import { OOGResult } from '../evm'

import type { ExecResult } from '../evm'
import type { PrecompileInput } from './types'

const bn128 = require('rustbn.js')

export function precompile07(opts: PrecompileInput): ExecResult {
  const inputData = opts.data.slice(0, 128)
  const gasUsed = opts._common.param('gasPrices', 'ecMul')
  if (opts._debug) {
    opts._debug(
      `Run ECMUL (0x07) precompile data=${short(opts.data)} length=${opts.data.length} gasLimit=${
        opts.gasLimit
      } gasUsed=${gasUsed}`
    )
  }

  if (opts.gasLimit < gasUsed) {
    if (opts._debug) {
      opts._debug(`ECMUL (0x07) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  const returnData = bn128.mul(inputData)
  // check ecmul success or failure by comparing the output length
  if (returnData.length !== 64) {
    if (opts._debug) {
      opts._debug(`ECMUL (0x07) failed: OOG`)
    }
    // TODO: should this really return OOG?
    return OOGResult(opts.gasLimit)
  }

  if (opts._debug) {
    opts._debug(`ECMUL (0x07) return value=${returnData.toString('hex')}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: returnData,
  }
}
