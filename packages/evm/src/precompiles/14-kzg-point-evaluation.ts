import { kzg } from '@ethereumjs/tx'
import {
  BLS_MODULUS,
  bigIntToBuffer,
  bufferToBigInt,
  bufferToHex,
  computeVersionedHash,
  intToBuffer,
  setLengthLeft,
} from '@ethereumjs/util'

import { EvmErrorResult } from '../evm'
import { ERROR, EvmError } from '../exceptions'

import type { ExecResult } from '../evm'
import type { PrecompileInput } from './types'

const FIELD_ELEMENTS_PER_BLOB = 4096
const { verifyKzgProof } = kzg

export async function precompile14(opts: PrecompileInput): Promise<ExecResult> {
  const gasUsed = opts._common.param('gasPrices', 'kzgPointEvaluationGasPrecompilePrice')
  const version = Number(opts._common.param('blobsConfig', 'blobCommitmentVersionKzg'))
  const versionedHash = opts.data.slice(0, 32)
  const z = opts.data.slice(32, 64)
  const y = opts.data.slice(64, 96)
  const commitment = opts.data.slice(96, 144)
  const kzgProof = opts.data.slice(144, 192)

  if (bufferToBigInt(z) >= BLS_MODULUS || bufferToBigInt(y) >= BLS_MODULUS) {
    return EvmErrorResult(new EvmError(ERROR.POINT_GREATER_THAN_BLS_MODULUS), opts.gasLimit)
  }

  if (
    bufferToHex(Buffer.from(computeVersionedHash(commitment, version))) !==
    bufferToHex(versionedHash)
  ) {
    return EvmErrorResult(new EvmError(ERROR.INVALID_COMMITMENT), opts.gasLimit)
  }

  verifyKzgProof(commitment, z, y, kzgProof)

  // Return value - FIELD_ELEMENTS_PER_BLOB and BLS_MODULUS as padded 32 byte big endian values
  const fieldElementsBuffer = setLengthLeft(intToBuffer(FIELD_ELEMENTS_PER_BLOB), 32)
  const modulusBuffer = setLengthLeft(bigIntToBuffer(BLS_MODULUS), 32)
  return {
    executionGasUsed: gasUsed,
    returnValue: Buffer.concat([fieldElementsBuffer, modulusBuffer]),
  }
}
