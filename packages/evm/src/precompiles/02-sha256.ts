import { short, toBuffer } from '@ethereumjs/util'
import { sha256 } from 'ethereum-cryptography/sha256'

import { OOGResult } from '../evm'

import type { ExecResult } from '../evm'
import type { PrecompileInput } from './types'

export function precompile02(opts: PrecompileInput): ExecResult {
  const data = opts.data

  let gasUsed = opts._common.param('gasPrices', 'sha256')
  gasUsed += opts._common.param('gasPrices', 'sha256Word') * BigInt(Math.ceil(data.length / 32))

  if (opts._debug) {
    opts._debug(
      `Run KECCAK256 (0x02) precompile data=${short(opts.data)} length=${
        opts.data.length
      } gasLimit=${opts.gasLimit} gasUsed=${gasUsed}`
    )
  }

  if (opts.gasLimit < gasUsed) {
    if (opts._debug) {
      opts._debug(`KECCAK256 (0x02) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  const hash = toBuffer(sha256(data))
  if (opts._debug) {
    opts._debug(`KECCAK256 (0x02) return hash=${hash.toString('hex')}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: hash,
  }
}
