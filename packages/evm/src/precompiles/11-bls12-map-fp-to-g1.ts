import { short } from '@ethereumjs/util'
import { bytesToHex, equalsBytes } from 'ethereum-cryptography/utils.js'

import { EvmErrorResult, OOGResult } from '../evm.js'
import { ERROR, EvmError } from '../exceptions.js'

import { BLS12_381_FromG1Point, BLS12_381_ToFpPoint } from './util/bls12_381.js'

import type { ExecResult } from '../evm.js'
import type { PrecompileInput } from './types.js'

export async function precompile11(opts: PrecompileInput): Promise<ExecResult> {
  const mcl = (<any>opts._EVM)._mcl!

  const inputData = opts.data

  // note: the gas used is constant; even if the input is incorrect.
  const gasUsed = opts._common.paramByEIP('gasPrices', 'Bls12381MapG1Gas', 2537) ?? BigInt(0)
  if (opts._debug !== undefined) {
    opts._debug(
      `Run BLS12MAPFPTOG1 (0x11) precompile data=${short(opts.data)} length=${
        opts.data.length
      } gasLimit=${opts.gasLimit} gasUsed=${gasUsed}`
    )
  }

  if (opts.gasLimit < gasUsed) {
    if (opts._debug !== undefined) {
      opts._debug(`BLS12MAPFPTOG1 (0x11) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  if (inputData.length !== 64) {
    if (opts._debug !== undefined) {
      opts._debug(`BLS12MAPFPTOG1 (0x11) failed: Invalid input length length=${inputData.length}`)
    }
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_INVALID_INPUT_LENGTH), opts.gasLimit)
  }

  // check if some parts of input are zero bytes.
  const zeroBytes16 = new Uint8Array(16)
  if (!equalsBytes(opts.data.subarray(0, 16), zeroBytes16)) {
    if (opts._debug !== undefined) {
      opts._debug(`BLS12MAPFPTOG1 (0x11) failed: Point not on curve`)
    }
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE), opts.gasLimit)
  }

  // convert input to mcl Fp1 point

  let Fp1Point
  try {
    Fp1Point = BLS12_381_ToFpPoint(opts.data.subarray(0, 64), mcl)
  } catch (e: any) {
    if (opts._debug !== undefined) {
      opts._debug(`BLS12MAPFPTOG1 (0x11) failed: ${e.message}`)
    }
    return EvmErrorResult(e, opts.gasLimit)
  }

  // map it to G1
  const result = Fp1Point.mapToG1()

  const returnValue = BLS12_381_FromG1Point(result)

  if (opts._debug !== undefined) {
    opts._debug(`BLS12MAPFPTOG1 (0x11) return value=${bytesToHex(returnValue)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue,
  }
}
