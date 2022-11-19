import { bigIntToBuffer, setLengthLeft } from '@ethereumjs/util'

import { OOGResult } from '../evm'

import type { ExecResult } from '../evm'
import type { PrecompileInput } from './types'

export function precompileF8Epochsize(opts: PrecompileInput): ExecResult {
  const gasUsed = BigInt(1000)
  if (opts.gasLimit < gasUsed) {
    return OOGResult(opts.gasLimit)
  }

  const sizeBuf = bigIntToBuffer(BigInt(100))
  return {
    returnValue: setLengthLeft(sizeBuf, 32),
    executionGasUsed: gasUsed,
  }
}
