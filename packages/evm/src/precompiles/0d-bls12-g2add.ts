import { short } from '@ethereumjs/util'

import { EvmErrorResult, OOGResult } from '../evm'
import { ERROR, EvmError } from '../exceptions'

import type { ExecResult } from '../evm'
import type { PrecompileInput } from './types'

const { BLS12_381_ToG2Point, BLS12_381_FromG2Point } = require('./util/bls12_381')

export async function precompile0d(opts: PrecompileInput): Promise<ExecResult> {
  const mcl = (<any>opts._EVM)._mcl!

  const inputData = opts.data

  // note: the gas used is constant; even if the input is incorrect.
  const gasUsed = opts._common.paramByEIP('gasPrices', 'Bls12381G2AddGas', 2537) ?? BigInt(0)
  if (opts._debug) {
    opts._debug(
      `Run BLS12G2ADD (0x0d) precompile data=${short(opts.data)} length=${
        opts.data.length
      } gasLimit=${opts.gasLimit} gasUsed=${gasUsed}`
    )
  }

  if (opts.gasLimit < gasUsed) {
    if (opts._debug) {
      opts._debug(`BLS12G2ADD (0x0d) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  if (inputData.length !== 512) {
    if (opts._debug) {
      opts._debug(`BLS12G2ADD (0x0d) failed: Invalid input length length=${inputData.length}`)
    }
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_INVALID_INPUT_LENGTH), opts.gasLimit)
  }

  // check if some parts of input are zero bytes.
  const zeroBytes16 = Buffer.alloc(16, 0)
  const zeroByteCheck = [
    [0, 16],
    [64, 80],
    [128, 144],
    [192, 208],
    [256, 272],
    [320, 336],
    [384, 400],
    [448, 464],
  ]

  for (const index in zeroByteCheck) {
    const slicedBuffer = opts.data.slice(zeroByteCheck[index][0], zeroByteCheck[index][1])
    if (!slicedBuffer.equals(zeroBytes16)) {
      if (opts._debug) {
        opts._debug(`BLS12G2ADD (0x0d) failed: Point not on curve`)
      }
      return EvmErrorResult(new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE), opts.gasLimit)
    }
  }

  // TODO: verify that point is on G2

  // convert input to mcl G2 points, add them, and convert the output to a Buffer.
  let mclPoint1
  let mclPoint2

  try {
    mclPoint1 = BLS12_381_ToG2Point(opts.data.slice(0, 256), mcl)
    mclPoint2 = BLS12_381_ToG2Point(opts.data.slice(256, 512), mcl)
  } catch (e: any) {
    return EvmErrorResult(e, opts.gasLimit)
  }

  const result = mcl.add(mclPoint1, mclPoint2)

  const returnValue = BLS12_381_FromG2Point(result)

  if (opts._debug) {
    opts._debug(`BLS12G2ADD (0x0d) return value=${returnValue.toString('hex')}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue,
  }
}
