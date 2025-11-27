import { bytesToHex, setLengthLeft } from '@ethereumjs/util'
import { ripemd160 } from '@noble/hashes/legacy.js'

import { OOGResult } from '../evm.ts'

import { getPrecompileName } from './index.ts'
import { gasLimitCheck } from './util.ts'

import type { ExecResult } from '../types.ts'
import type { PrecompileInput } from './types.ts'

export function precompile03(opts: PrecompileInput): ExecResult {
  const pName = getPrecompileName('03')
  const data = opts.data

  let gasUsed = opts.common.param('ripemd160Gas')
  gasUsed += opts.common.param('ripemd160WordGas') * BigInt(Math.ceil(data.length / 32))

  if (!gasLimitCheck(opts, gasUsed, pName)) {
    return OOGResult(opts.gasLimit)
  }

  const hash = setLengthLeft(ripemd160(data), 32)
  if (opts._debug !== undefined) {
    opts._debug(`${pName} return hash=${bytesToHex(hash)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: setLengthLeft(ripemd160(data), 32),
  }
}
