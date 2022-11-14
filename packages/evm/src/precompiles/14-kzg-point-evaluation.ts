import { bufferToBigInt, bufferToHex, computeVersionedHash } from '@ethereumjs/util'

import { EvmErrorResult } from '../evm'
import { ERROR, EvmError } from '../exceptions'

import type { ExecResult } from '../evm'
import type { PrecompileInput } from './types'

const BLS_MODULUS = BigInt(
  '52435875175126190479447740508185965837690552500527637822603658699938581184513'
)
export async function precompile14(opts: PrecompileInput): Promise<ExecResult> {
  const gasUsed = opts._common.param('gasPrices', 'kzgPointEvaluationGasPrecompilePrice')
  const versionedHash = opts.data.slice(0, 32)
  const x = bufferToBigInt(opts.data.slice(32, 64))
  const y = bufferToBigInt(opts.data.slice(64, 96))
  if (x >= BLS_MODULUS || y >= BLS_MODULUS) {
    return EvmErrorResult(new EvmError(ERROR.POINT_GREATER_THAN_BLS_MODULUS), opts.gasLimit)
  }

  const dataKzg = opts.data.slice(96, 144)
  if (bufferToHex(Buffer.from(computeVersionedHash(dataKzg))) !== bufferToHex(versionedHash)) {
    return EvmErrorResult(new EvmError(ERROR.INVALID_COMMITMENT), opts.gasLimit)
  }
  // TODO: Integrate kzg library and verify kzg_to_versioned_hash(dataKzg) === versionedHash
  const quotientKzg = opts.data.slice(144, 192)
  // TODO: Integrate kzg library and run verify_kzg_proof(dataKzg, x, y, quotientKzg)
  return {
    executionGasUsed: gasUsed,
    returnValue: Buffer.from([]),
  }
}
