import { short } from '@ethereumjs/util'

import { EvmErrorResult, OOGResult } from '../evm'
import { ERROR, EvmError } from '../exceptions'

import type { ExecResult } from '../evm'
import type { PrecompileInput } from './types'

const { BLS12_381_ToFpPoint, BLS12_381_FromG1Point } = require('./util/bls12_381')

export async function precompile11(opts: PrecompileInput): Promise<ExecResult> {
  const mcl = (<any>opts._EVM)._mcl!

  const inputData = opts.data

  // note: the gas used is constant; even if the input is incorrect.
  const gasUsed = opts._common.paramByEIP('gasPrices', 'Bls12381MapG1Gas', 2537) ?? BigInt(0)
  if (opts._debug) {
    opts._debug(
      `Run BLS12MAPFPTOG1 (0x11) precompile data=${short(opts.data)} length=${
        opts.data.length
      } gasLimit=${opts.gasLimit} gasUsed=${gasUsed}`
    )
  }

  if (opts.gasLimit < gasUsed) {
    if (opts._debug) {
      opts._debug(`BLS12MAPFPTOG1 (0x11) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  if (inputData.length !== 64) {
    if (opts._debug) {
      opts._debug(`BLS12MAPFPTOG1 (0x11) failed: Invalid input length length=${inputData.length}`)
    }
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_INVALID_INPUT_LENGTH), opts.gasLimit)
  }

  // check if some parts of input are zero bytes.
  const zeroBytes16 = Buffer.alloc(16, 0)
  if (!opts.data.slice(0, 16).equals(zeroBytes16)) {
    if (opts._debug) {
      opts._debug(`BLS12MAPFPTOG1 (0x11) failed: Point not on curve`)
    }
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE), opts.gasLimit)
  }

  // convert input to mcl Fp1 point

  let Fp1Point
  try {
    Fp1Point = BLS12_381_ToFpPoint(opts.data.slice(0, 64), mcl)
  } catch (e: any) {
    if (opts._debug) {
      opts._debug(`BLS12MAPFPTOG1 (0x11) failed: ${e.message}`)
    }
    return EvmErrorResult(e, opts.gasLimit)
  }

  // map it to G1
  const result = Fp1Point.mapToG1()

  const returnValue = BLS12_381_FromG1Point(result)

  if (opts._debug) {
    opts._debug(`BLS12MAPFPTOG1 (0x11) return value=${returnValue.toString('hex')}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue,
  }
}
