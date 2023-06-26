import { short } from '@ethereumjs/util'
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils.js'

import { OOGResult } from '../evm.js'

import type { ExecResult } from '../evm.js'
import type { PrecompileInput } from './types.js'

const bn128 = require('rustbn.js')

export function precompile07(opts: PrecompileInput): ExecResult {
  const inputData = bytesToHex(opts.data.subarray(0, 128))
  const gasUsed = opts._common.param('gasPrices', 'ecMul')
  if (opts._debug !== undefined) {
    opts._debug(
      `Run ECMUL (0x07) precompile data=${short(opts.data)} length=${opts.data.length} gasLimit=${
        opts.gasLimit
      } gasUsed=${gasUsed}`
    )
  }

  if (opts.gasLimit < gasUsed) {
    if (opts._debug !== undefined) {
      opts._debug(`ECMUL (0x07) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  const returnData = hexToBytes(bn128.mul(inputData))

  // check ecmul success or failure by comparing the output length
  if (returnData.length !== 64) {
    if (opts._debug !== undefined) {
      opts._debug(`ECMUL (0x07) failed: OOG`)
    }
    // TODO: should this really return OOG?
    return OOGResult(opts.gasLimit)
  }

  if (opts._debug !== undefined) {
    opts._debug(`ECMUL (0x07) return value=${bytesToHex(returnData)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: returnData,
  }
}
