import {
  bufferToBigInt,
  ecrecover,
  publicToAddress,
  setLengthLeft,
  setLengthRight,
  short,
} from '@ethereumjs/util'

import { OOGResult } from '../evm'

import type { ExecResult } from '../evm'
import type { PrecompileInput } from './types'

export function precompile01(opts: PrecompileInput): ExecResult {
  const gasUsed = opts._common.param('gasPrices', 'ecRecover')
  if (opts._debug) {
    opts._debug(
      `Run ECRECOVER (0x01) precompile data=${short(opts.data)} length=${
        opts.data.length
      } gasLimit=${opts.gasLimit} gasUsed=${gasUsed}`
    )
  }

  if (opts.gasLimit < gasUsed) {
    if (opts._debug) {
      opts._debug(`ECRECOVER (0x01) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  const data = setLengthRight(opts.data, 128)

  const msgHash = data.slice(0, 32)
  const v = data.slice(32, 64)
  const vBigInt = bufferToBigInt(v)

  // Guard against util's `ecrecover`: without providing chainId this will return
  // a signature in most of the cases in the cases that `v=0` or `v=1`
  // However, this should throw, only 27 and 28 is allowed as input
  if (vBigInt !== BigInt(27) && vBigInt !== BigInt(28)) {
    if (opts._debug) {
      opts._debug(`ECRECOVER (0x01) failed: v neither 27 nor 28`)
    }
    return {
      executionGasUsed: gasUsed,
      returnValue: Buffer.alloc(0),
    }
  }

  const r = data.slice(64, 96)
  const s = data.slice(96, 128)

  let publicKey
  try {
    if (opts._debug) {
      opts._debug(
        `ECRECOVER (0x01): PK recovery with msgHash=${msgHash.toString('hex')} v=${v.toString(
          'hex'
        )} r=${r.toString('hex')}s=${s.toString('hex')}}`
      )
    }
    publicKey = ecrecover(msgHash, bufferToBigInt(v), r, s)
  } catch (e: any) {
    if (opts._debug) {
      opts._debug(`ECRECOVER (0x01) failed: PK recovery failed`)
    }
    return {
      executionGasUsed: gasUsed,
      returnValue: Buffer.alloc(0),
    }
  }
  const address = setLengthLeft(publicToAddress(publicKey), 32)
  if (opts._debug) {
    opts._debug(`ECRECOVER (0x01) return address=${address.toString('hex')}`)
  }
  return {
    executionGasUsed: gasUsed,
    returnValue: address,
  }
}
