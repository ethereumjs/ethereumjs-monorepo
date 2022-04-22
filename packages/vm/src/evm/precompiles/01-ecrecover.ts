import {
  setLengthLeft,
  setLengthRight,
  ecrecover,
  publicToAddress,
  bufferToBigInt,
} from 'ethereumjs-util'
import { PrecompileInput } from './types'
import { OOGResult, ExecResult } from '../evm'
const assert = require('assert')

export default function (opts: PrecompileInput): ExecResult {
  assert(opts.data)

  const gasUsed = opts._common.param('gasPrices', 'ecRecover')

  if (opts.gasLimit < gasUsed) {
    return OOGResult(opts.gasLimit)
  }

  const data = setLengthRight(opts.data, 128)

  const msgHash = data.slice(0, 32)
  const v = data.slice(32, 64)
  const r = data.slice(64, 96)
  const s = data.slice(96, 128)

  let publicKey
  try {
    publicKey = ecrecover(msgHash, bufferToBigInt(v), r, s)
  } catch (e: any) {
    return {
      gasUsed,
      returnValue: Buffer.alloc(0),
    }
  }

  return {
    gasUsed,
    returnValue: setLengthLeft(publicToAddress(publicKey), 32),
  }
}
