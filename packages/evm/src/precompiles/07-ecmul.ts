import { bytesToHex, short } from '@ethereumjs/util'

import { EvmErrorResult, OOGResult } from '../evm.js'
import { ERROR, EvmError } from '../exceptions.js'

import { equalityLengthCheck } from './util.js'

import type { EVM } from '../evm.js'
import type { ExecResult } from '../types.js'
import type { PrecompileInput } from './types.js'

export function precompile07(opts: PrecompileInput): ExecResult {
  const gasUsed = opts.common.param('ecMulGas')
  if (opts._debug !== undefined) {
    opts._debug(
      `Run ECMUL (0x07) precompile data=${short(opts.data)} length=${opts.data.length} gasLimit=${
        opts.gasLimit
      } gasUsed=${gasUsed}`,
    )
  }

  if (opts.gasLimit < gasUsed) {
    if (opts._debug !== undefined) {
      opts._debug(`ECMUL (0x07) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  if (!equalityLengthCheck(opts, 128, 'ECMUL (0x07)')) {
    // TODO: I changed opts.gasLimit (as being used for BLS) to gasUsed
    // This passes the local npx vitest run test/precompiles/07-ecmul.spec.ts test,
    // getting to the expected 40000 (instead of 65535), a bit spooky though.
    // Should be analyzed if both cases (BLS and BN254) are correctly applied.
    return EvmErrorResult(new EvmError(ERROR.INVALID_INPUT_LENGTH), gasUsed)
  }

  const returnData = (opts._EVM as EVM)['_bn254'].mul(opts.data.subarray(0, 128))

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
