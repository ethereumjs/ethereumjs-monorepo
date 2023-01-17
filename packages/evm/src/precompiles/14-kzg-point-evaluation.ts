import { computeVersionedHash, kzg } from '@ethereumjs/tx'
import { bigIntToBuffer, bufferToBigInt, bufferToHex, setLengthLeft } from '@ethereumjs/util'

import { EvmErrorResult } from '../evm'
import { ERROR, EvmError } from '../exceptions'

import type { ExecResult } from '../evm'
import type { PrecompileInput } from './types'

export const BLS_MODULUS = BigInt(
  '52435875175126190479447740508185965837690552500527637822603658699938581184513'
)

export async function precompile14(opts: PrecompileInput): Promise<ExecResult> {
  const gasUsed = opts._common.param('gasPrices', 'kzgPointEvaluationGasPrecompilePrice')
  const version = Number(opts._common.paramByEIP('sharding', 'blobCommitmentVersionKzg', 4844))
  const fieldElementsPerBlob = opts._common.paramByEIP('sharding', 'fieldElementsPerBlob', 4844)!
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

  kzg.verifyKzgProof(commitment, z, y, kzgProof)

  // Return value - FIELD_ELEMENTS_PER_BLOB and BLS_MODULUS as padded 32 byte big endian values
  const fieldElementsBuffer = setLengthLeft(bigIntToBuffer(fieldElementsPerBlob), 32)
  const modulusBuffer = setLengthLeft(bigIntToBuffer(BLS_MODULUS), 32)
  return {
    executionGasUsed: gasUsed,
    returnValue: Buffer.concat([fieldElementsBuffer, modulusBuffer]),
  }
}
