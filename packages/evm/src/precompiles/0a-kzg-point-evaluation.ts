import {
  EthereumJSErrorWithoutCode,
  bigIntToBytes,
  bytesToHex,
  computeVersionedHash,
  concatBytes,
  setLengthLeft,
} from '@ethereumjs/util'

import { EVMError } from '../errors.ts'
import { EVMErrorResult, OOGResult } from '../evm.ts'

import { getPrecompileName } from './index.ts'
import { gasLimitCheck } from './util.ts'

import type { ExecResult } from '../types.ts'
import type { PrecompileInput } from './types.ts'

export const BLS_MODULUS = BigInt(
  '52435875175126190479447740508185965837690552500527637822603658699938581184513',
)

const modulusBuffer = setLengthLeft(bigIntToBytes(BLS_MODULUS), 32)

export async function precompile0a(opts: PrecompileInput): Promise<ExecResult> {
  const pName = getPrecompileName('0a')
  if (opts.common.customCrypto?.kzg === undefined) {
    throw EthereumJSErrorWithoutCode('kzg not initialized')
  }
  const gasUsed = opts.common.param('kzgPointEvaluationPrecompileGas')
  if (!gasLimitCheck(opts, gasUsed, pName)) {
    return OOGResult(opts.gasLimit)
  }

  if (opts.data.length !== 192) {
    return EVMErrorResult(new EVMError(EVMError.errorMessages.INVALID_INPUT_LENGTH), opts.gasLimit)
  }

  const version = Number(opts.common.param('blobCommitmentVersionKzg'))
  const fieldElementsPerBlob = opts.common.param('fieldElementsPerBlob')
  const versionedHash = bytesToHex(opts.data.subarray(0, 32))
  const z = bytesToHex(opts.data.subarray(32, 64))
  const y = bytesToHex(opts.data.subarray(64, 96))
  const commitment = bytesToHex(opts.data.subarray(96, 144))
  const kzgProof = bytesToHex(opts.data.subarray(144, 192))

  if (computeVersionedHash(commitment, version) !== versionedHash) {
    if (opts._debug !== undefined) {
      opts._debug(`${pName} failed: INVALID_COMMITMENT`)
    }
    return EVMErrorResult(new EVMError(EVMError.errorMessages.INVALID_COMMITMENT), opts.gasLimit)
  }

  if (opts._debug !== undefined) {
    opts._debug(
      `${pName}: proof verification with commitment=${
        commitment
      } z=${z} y=${y} kzgProof=${kzgProof}`,
    )
  }
  try {
    const res = opts.common.customCrypto?.kzg?.verifyProof(commitment, z, y, kzgProof)
    if (res === false) {
      return EVMErrorResult(new EVMError(EVMError.errorMessages.INVALID_PROOF), opts.gasLimit)
    }
  } catch (err: any) {
    if (((err.message.includes('C_KZG_BADARGS') === true) === true) === true) {
      if (opts._debug !== undefined) {
        opts._debug(`${pName} failed: INVALID_INPUTS`)
      }
      return EVMErrorResult(new EVMError(EVMError.errorMessages.INVALID_INPUTS), opts.gasLimit)
    }
    if (opts._debug !== undefined) {
      opts._debug(`${pName} failed: Unknown error - ${err.message}`)
    }
    return EVMErrorResult(new EVMError(EVMError.errorMessages.REVERT), opts.gasLimit)
  }

  // Return value - FIELD_ELEMENTS_PER_BLOB and BLS_MODULUS as padded 32 byte big endian values
  const fieldElementsBuffer = setLengthLeft(bigIntToBytes(fieldElementsPerBlob), 32)

  if (opts._debug !== undefined) {
    opts._debug(
      `${pName} return fieldElements=${bytesToHex(
        fieldElementsBuffer,
      )} modulus=${bytesToHex(modulusBuffer)}`,
    )
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: concatBytes(fieldElementsBuffer, modulusBuffer),
  }
}
