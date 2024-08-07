import { bytesToHex, setLengthRight, short } from '@ethereumjs/util'

import { EvmErrorResult, OOGResult } from '../evm.js'

import type { EVM } from '../evm.js'
import type { ExecResult } from '../types.js'
import type { PrecompileInput } from './types.js'

export function precompile06(opts: PrecompileInput): ExecResult {
  const gasUsed = opts.common.param('ecAddGas')
  if (opts._debug !== undefined) {
    opts._debug(
      `Run ECADD (0x06) precompile data=${short(opts.data)} length=${opts.data.length} gasLimit=${
        opts.gasLimit
      } gasUsed=${gasUsed}`,
    )
  }
  if (opts.gasLimit < gasUsed) {
    if (opts._debug !== undefined) {
      opts._debug(`ECADD (0x06) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  // > 128 bytes: chop off extra bytes
  // < 128 bytes: right-pad with 0-s
  const input = setLengthRight(opts.data.subarray(0, 128), 128)

  let returnData
  try {
    returnData = (opts._EVM as EVM)['_bn254'].add(input)
  } catch (e: any) {
    if (opts._debug !== undefined) {
      opts._debug(`ECADD (0x06) failed: ${e.message}`)
    }
    return EvmErrorResult(e, opts.gasLimit)
  }

  // check ecadd success or failure by comparing the output length
  if (returnData.length !== 64) {
    if (opts._debug !== undefined) {
      opts._debug(`ECADD (0x06) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  if (opts._debug !== undefined) {
    opts._debug(`ECADD (0x06) return value=${bytesToHex(returnData)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: returnData,
  }
}
