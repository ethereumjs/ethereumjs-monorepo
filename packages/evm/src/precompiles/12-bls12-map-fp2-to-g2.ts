import { short } from '@ethereumjs/util'

import { EvmErrorResult, OOGResult } from '../evm'
import { ERROR, EvmError } from '../exceptions'

import type { ExecResult } from '../evm'
import type { PrecompileInput } from './types'

const { BLS12_381_ToFp2Point, BLS12_381_FromG2Point } = require('./util/bls12_381')

export async function precompile12(opts: PrecompileInput): Promise<ExecResult> {
  const mcl = (<any>opts._EVM)._mcl!

  const inputData = opts.data

  // note: the gas used is constant; even if the input is incorrect.
  const gasUsed = opts._common.paramByEIP('gasPrices', 'Bls12381MapG2Gas', 2537) ?? BigInt(0)
  if (opts._debug) {
    opts._debug(
      `Run BLS12MAPFP2TOG2 (0x12) precompile data=${short(opts.data)} length=${
        opts.data.length
      } gasLimit=${opts.gasLimit} gasUsed=${gasUsed}`
    )
  }

  if (opts.gasLimit < gasUsed) {
    if (opts._debug) {
      opts._debug(`BLS12MAPFP2TOG2 (0x12) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  if (inputData.length !== 128) {
    if (opts._debug) {
      opts._debug(`BLS12MAPFP2TOG2 (0x12) failed: Invalid input length length=${inputData.length}`)
    }
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_INVALID_INPUT_LENGTH), opts.gasLimit)
  }

  // check if some parts of input are zero bytes.
  const zeroBytes16 = Buffer.alloc(16, 0)
  const zeroByteCheck = [
    [0, 16],
    [64, 80],
  ]

  for (const index in zeroByteCheck) {
    const slicedBuffer = opts.data.slice(zeroByteCheck[index][0], zeroByteCheck[index][1])
    if (!slicedBuffer.equals(zeroBytes16)) {
      if (opts._debug) {
        opts._debug(`BLS12MAPFP2TOG2 (0x12) failed: Point not on curve`)
      }
      return EvmErrorResult(new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE), opts.gasLimit)
    }
  }

  // convert input to mcl Fp2 point

  let Fp2Point
  try {
    Fp2Point = BLS12_381_ToFp2Point(opts.data.slice(0, 64), opts.data.slice(64, 128), mcl)
  } catch (e: any) {
    if (opts._debug) {
      opts._debug(`BLS12MAPFP2TOG2 (0x12) failed: ${e.message}`)
    }
    return EvmErrorResult(e, opts.gasLimit)
  }
  // map it to G2
  const result = Fp2Point.mapToG2()

  const returnValue = BLS12_381_FromG2Point(result)

  if (opts._debug) {
    opts._debug(`BLS12MAPFP2TOG2 (0x12) return value=${returnValue.toString('hex')}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue,
  }
}
