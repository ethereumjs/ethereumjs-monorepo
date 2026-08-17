import { bytesToHex } from '@ethereumjs/util'
import { sha256 } from '@noble/hashes/sha2.js'

import { OOGResult } from '../evm.ts'

import { getPrecompileName } from './index.ts'
import { gasLimitCheck } from './util.ts'

import type { ExecResult } from '../types.ts'
import type { PrecompileInput } from './types.ts'

export function precompile02(opts: PrecompileInput): ExecResult {
  const pName = getPrecompileName('02')
  const data = opts.data
  const sha256Function = opts.common.customCrypto.sha256 ?? sha256
  let gasUsed = opts.common.param('sha256Gas')
  gasUsed += opts.common.param('sha256WordGas') * BigInt(Math.ceil(data.length / 32))

  if (!gasLimitCheck(opts, gasUsed, pName)) {
    return OOGResult(opts.gasLimit)
  }

  const hash = sha256Function(data)
  if (opts._debug !== undefined) {
    opts._debug(`${pName} return hash=${bytesToHex(hash)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: hash,
  }
}
