import {
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

// TODO: Move all Blob related constants to util
const BLS_MODULUS = BigInt(
  '52435875175126190479447740508185965837690552500527637822603658699938581184513'
)

const FIELD_ELEMENTS_PER_BLOB = 4096

export async function precompile14(opts: PrecompileInput): Promise<ExecResult> {
  const gasUsed = opts._common.param('gasPrices', 'kzgPointEvaluationGasPrecompilePrice')
  const versionedHash = opts.data.slice(0, 32)
  const x = bufferToBigInt(opts.data.slice(32, 64)) // TODO: Determine if x/y will stay in the input
  const y = bufferToBigInt(opts.data.slice(64, 96))
  if (x >= BLS_MODULUS || y >= BLS_MODULUS) {
    return EvmErrorResult(new EvmError(ERROR.POINT_GREATER_THAN_BLS_MODULUS), opts.gasLimit)
  }

  const dataKzg = opts.data.slice(96, 144)
  if (bufferToHex(Buffer.from(computeVersionedHash(dataKzg))) !== bufferToHex(versionedHash)) {
    return EvmErrorResult(new EvmError(ERROR.INVALID_COMMITMENT), opts.gasLimit)
  }

  //const quotientKzg = opts.data.slice(144, 192)
  // TODO: Verify the kzg proof once the kzg library interface is ironed out

  // Return value - FIELD_ELEMENTS_PER_BLOB and BLS_MODULUS as padded 32 byte big endian values
  const fieldElementsBuffer = setLengthLeft(intToBuffer(FIELD_ELEMENTS_PER_BLOB), 32)
  const modulusBuffer = setLengthLeft(bigIntToBuffer(BLS_MODULUS), 32)
  return {
    executionGasUsed: gasUsed,
    returnValue: Buffer.concat([fieldElementsBuffer, modulusBuffer]),
  }
}
