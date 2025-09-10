import { BIGINT_0, BIGINT_1, bytesToBigInt, bytesToHex } from '@ethereumjs/util'

import { p256 } from '@noble/curves/p256.js'
import { EVMError } from '../errors.ts'
import { EVMErrorResult, OOGResult } from '../evm.ts'
import { getPrecompileName } from './index.ts'
import { gasLimitCheck } from './util.ts'

import type { ExecResult } from '../types.ts'
import type { PrecompileInput } from './types.ts'

export const p256_MODULUS = BigInt(
  '0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff',
)
export async function precompile12(opts: PrecompileInput): Promise<ExecResult> {
  const pName = getPrecompileName('12')

  const gasUsed = opts.common.param('p256verifyGas')
  if (!gasLimitCheck(opts, gasUsed, pName)) {
    return OOGResult(opts.gasLimit)
  }

  if (opts.data.length !== 160) {
    opts._debug?.(`${pName} failed: Invalid input length: expeted 160, got ${opts.data.length}`)
    return EVMErrorResult(new EVMError(EVMError.errorMessages.INVALID_INPUT_LENGTH), opts.gasLimit)
  }

  const hash = bytesToHex(opts.data.subarray(0, 32)) // hash of signed data
  const r = bytesToBigInt(opts.data.subarray(32, 64)) // r component of signature
  const s = bytesToBigInt(opts.data.subarray(64, 96)) // s component of signature
  const x = bytesToBigInt(opts.data.subarray(96, 128)) // x coordinate of public key
  const y = bytesToBigInt(opts.data.subarray(128, 160)) // y coordinate of public key

  if (r >= p256.CURVE.n || s >= p256.CURVE.n || r < BIGINT_1 || s < BIGINT_1) {
    opts._debug?.(`${pName} failed: Invalid signature`)
    return EVMErrorResult(new EVMError(EVMError.errorMessages.INVALID_INPUTS), opts.gasLimit)
  }

  if ((x <= BIGINT_0 && y <= BIGINT_0) || (x >= p256_MODULUS && y >= p256_MODULUS)) {
    opts._debug?.(`${pName} failed: Invalid public key`)
    return EVMErrorResult(new EVMError(EVMError.errorMessages.INVALID_INPUTS), opts.gasLimit)
  }

  const isValid = p256.verify(
    { r, s },
    hash.slice(2),
    p256.ProjectivePoint.fromAffine({ x, y }).toHex(),
  )

  const returnValue = new Uint8Array(32)
  returnValue[0] = isValid ? 1 : 0
  return {
    executionGasUsed: gasUsed,
    returnValue,
  }
}
