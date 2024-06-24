import { bytesToHex, equalsBytes, short } from '@ethereumjs/util'

import { EvmErrorResult, OOGResult } from '../evm.js'
import { ERROR, EvmError } from '../exceptions.js'

import { NobleBLS } from './bls12_381/noble.js'

import type { EVMBLSInterface, ExecResult } from '../types.js'
import type { PrecompileInput } from './types.js'

export async function precompile0b(opts: PrecompileInput): Promise<ExecResult> {
  // const bls = (<any>opts._EVM)._bls! as EVMBLSInterface
  const bls: EVMBLSInterface = new NobleBLS((<any>opts._EVM)._mcl!)

  const inputData = opts.data

  // note: the gas used is constant; even if the input is incorrect.
  const gasUsed = opts.common.paramByEIP('gasPrices', 'Bls12381G1AddGas', 2537) ?? BigInt(0)
  if (opts._debug !== undefined) {
    opts._debug(
      `Run BLS12G1ADD (0x0b) precompile data=${short(opts.data)} length=${
        opts.data.length
      } gasLimit=${opts.gasLimit} gasUsed=${gasUsed}`
    )
  }

  if (opts.gasLimit < gasUsed) {
    if (opts._debug !== undefined) {
      opts._debug(`BLS12G1ADD (0x0b) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  if (inputData.length !== 256) {
    if (opts._debug !== undefined) {
      opts._debug(`BLS12G1ADD (0x0b) failed: Invalid input length length=${inputData.length}`)
    }
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_INVALID_INPUT_LENGTH), opts.gasLimit)
  }

  // check if some parts of input are zero bytes.
  const zeroBytes16 = new Uint8Array(16)
  const zeroByteCheck = [
    [0, 16],
    [64, 80],
    [128, 144],
    [192, 208],
  ]

  for (const index in zeroByteCheck) {
    const slicedBuffer = opts.data.subarray(zeroByteCheck[index][0], zeroByteCheck[index][1])
    if (!(equalsBytes(slicedBuffer, zeroBytes16) === true)) {
      if (opts._debug !== undefined) {
        opts._debug(`BLS12G1ADD (0x0b) failed: Point not on curve`)
      }
      return EvmErrorResult(new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE), opts.gasLimit)
    }
  }
  let returnValue
  try {
    returnValue = bls.add(inputData)
  } catch (e: any) {
    if (opts._debug !== undefined) {
      opts._debug(`BLS12G1ADD (0x0b) failed: ${e.message}`)
    }
    return EvmErrorResult(e, opts.gasLimit)
  }

  if (opts._debug !== undefined) {
    opts._debug(`BLS12G1ADD (0x0b) return value=${bytesToHex(returnValue)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue,
  }
}
