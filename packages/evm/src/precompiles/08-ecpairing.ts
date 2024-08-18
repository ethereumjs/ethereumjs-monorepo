import { bytesToHex, short } from '@ethereumjs/util'

import { EvmErrorResult, OOGResult } from '../evm.js'
import { ERROR, EvmError } from '../exceptions.js'

import { moduloLengthCheck } from './util.js'

import type { EVM } from '../evm.js'
import type { ExecResult } from '../types.js'
import type { PrecompileInput } from './types.js'

export function precompile08(opts: PrecompileInput): ExecResult {
  if (!moduloLengthCheck(opts, 192, 'ECPAIRING (0x08)')) {
    return EvmErrorResult(new EvmError(ERROR.INVALID_INPUT_LENGTH), opts.gasLimit)
  }

  const inputDataSize = BigInt(Math.floor(opts.data.length / 192))
  const gasUsed =
    opts.common.param('ecPairingGas') + inputDataSize * opts.common.param('ecPairingWordGas')
  if (opts._debug !== undefined) {
    opts._debug(
      `Run ECPAIRING (0x08) precompile data=${short(opts.data)} length=${
        opts.data.length
      } gasLimit=${opts.gasLimit} gasUsed=${gasUsed}`,
    )
  }

  if (opts.gasLimit < gasUsed) {
    if (opts._debug !== undefined) {
      opts._debug(`ECPAIRING (0x08) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  let returnData
  try {
    returnData = (opts._EVM as EVM)['_bn254'].pairing(opts.data)
  } catch (e: any) {
    if (opts._debug !== undefined) {
      opts._debug(`ECPAIRING (0x08) failed: ${e.message}`)
    }
    return EvmErrorResult(e, opts.gasLimit)
  }

  // check ecpairing success or failure by comparing the output length
  if (returnData.length !== 32) {
    if (opts._debug !== undefined) {
      opts._debug(`ECPAIRING (0x08) failed: OOG`)
    }
    // TODO: should this really return OOG?
    return OOGResult(opts.gasLimit)
  }

  if (opts._debug !== undefined) {
    opts._debug(`ECPAIRING (0x08) return value=${bytesToHex(returnData)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: returnData,
  }
}
