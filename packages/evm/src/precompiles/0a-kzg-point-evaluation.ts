import {
  bigIntToBytes,
  bytesToHex,
  computeVersionedHash,
  concatBytes,
  setLengthLeft,
  short,
} from '@ethereumjs/util'

import { EvmErrorResult, OOGResult } from '../evm.js'
import { ERROR, EvmError } from '../exceptions.js'

import type { ExecResult } from '../types.js'
import type { PrecompileInput } from './types.js'

export const BLS_MODULUS = BigInt(
  '52435875175126190479447740508185965837690552500527637822603658699938581184513'
)

const modulusBuffer = setLengthLeft(bigIntToBytes(BLS_MODULUS), 32)

export async function precompile0a(opts: PrecompileInput): Promise<ExecResult> {
  if (opts.common.customCrypto?.kzg === undefined) {
    throw new Error('kzg not initialized')
  }
  const gasUsed = opts.common.param('gasPrices', 'kzgPointEvaluationGasPrecompilePrice')
  if (opts._debug !== undefined) {
    opts._debug(
      `Run KZG_POINT_EVALUATION (0x14) precompile data=${short(opts.data)} length=${
        opts.data.length
      } gasLimit=${opts.gasLimit} gasUsed=${gasUsed}`
    )
  }

  if (opts.gasLimit < gasUsed) {
    if (opts._debug !== undefined) {
      opts._debug(`KZG_POINT_EVALUATION (0x14) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  if (opts.data.length !== 192) {
    return EvmErrorResult(new EvmError(ERROR.INVALID_INPUT_LENGTH), opts.gasLimit)
  }

  const version = Number(opts.common.param('sharding', 'blobCommitmentVersionKzg'))
  const fieldElementsPerBlob = opts.common.param('sharding', 'fieldElementsPerBlob')
  const versionedHash = opts.data.subarray(0, 32)
  const z = opts.data.subarray(32, 64)
  const y = opts.data.subarray(64, 96)
  const commitment = opts.data.subarray(96, 144)
  const kzgProof = opts.data.subarray(144, 192)

  if (bytesToHex(computeVersionedHash(commitment, version)) !== bytesToHex(versionedHash)) {
    if (opts._debug !== undefined) {
      opts._debug(`KZG_POINT_EVALUATION (0x14) failed: INVALID_COMMITMENT`)
    }
    return EvmErrorResult(new EvmError(ERROR.INVALID_COMMITMENT), opts.gasLimit)
  }

  if (opts._debug !== undefined) {
    opts._debug(
      `KZG_POINT_EVALUATION (0x14): proof verification with commitment=${bytesToHex(
        commitment
      )} z=${bytesToHex(z)} y=${bytesToHex(y)} kzgProof=${bytesToHex(kzgProof)}`
    )
  }
  try {
    const res = opts.common.customCrypto?.kzg?.verifyKzgProof(commitment, z, y, kzgProof)
    if (res === false) {
      return EvmErrorResult(new EvmError(ERROR.INVALID_PROOF), opts.gasLimit)
    }
  } catch (err: any) {
    if (err.message.includes('C_KZG_BADARGS') === true) {
      if (opts._debug !== undefined) {
        opts._debug(`KZG_POINT_EVALUATION (0x14) failed: INVALID_INPUTS`)
      }
      return EvmErrorResult(new EvmError(ERROR.INVALID_INPUTS), opts.gasLimit)
    }
    if (opts._debug !== undefined) {
      opts._debug(`KZG_POINT_EVALUATION (0x14) failed: Unknown error - ${err.message}`)
    }
    return EvmErrorResult(new EvmError(ERROR.REVERT), opts.gasLimit)
  }

  // Return value - FIELD_ELEMENTS_PER_BLOB and BLS_MODULUS as padded 32 byte big endian values
  const fieldElementsBuffer = setLengthLeft(bigIntToBytes(fieldElementsPerBlob), 32)

  if (opts._debug !== undefined) {
    opts._debug(
      `KZG_POINT_EVALUATION (0x14) return fieldElements=${bytesToHex(
        fieldElementsBuffer
      )} modulus=${bytesToHex(modulusBuffer)}`
    )
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: concatBytes(fieldElementsBuffer, modulusBuffer),
  }
}
