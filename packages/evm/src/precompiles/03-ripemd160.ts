import { setLengthLeft, short, toBuffer } from '@ethereumjs/util'
import { ripemd160 } from 'ethereum-cryptography/ripemd160'

import { OOGResult } from '../evm'

import type { ExecResult } from '../evm'
import type { PrecompileInput } from './types'

export function precompile03(opts: PrecompileInput): ExecResult {
  const data = opts.data

  let gasUsed = opts._common.param('gasPrices', 'ripemd160')
  gasUsed += opts._common.param('gasPrices', 'ripemd160Word') * BigInt(Math.ceil(data.length / 32))

  if (opts._debug) {
    opts._debug(
      `Run RIPEMD160 (0x03) precompile data=${short(opts.data)} length=${
        opts.data.length
      } gasLimit=${opts.gasLimit} gasUsed=${gasUsed}`
    )
  }

  if (opts.gasLimit < gasUsed) {
    if (opts._debug) {
      opts._debug(`RIPEMD160 (0x03) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  const hash = setLengthLeft(toBuffer(ripemd160(data)), 32)
  if (opts._debug) {
    opts._debug(`RIPEMD160 (0x03) return hash=${hash.toString('hex')}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: hash,
  }
}
