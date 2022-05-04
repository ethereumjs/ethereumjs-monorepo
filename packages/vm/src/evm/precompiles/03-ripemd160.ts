import { ripemd160 } from 'ethereum-cryptography/ripemd160'
import { setLengthLeft, toBuffer } from 'ethereumjs-util'
import { PrecompileInput } from './types'
import { OOGResult, ExecResult } from '../evm'
const assert = require('assert')

export default function (opts: PrecompileInput): ExecResult {
  assert(opts.data)

  const data = opts.data

  let gasUsed = opts._common.param('gasPrices', 'ripemd160')
  gasUsed += opts._common.param('gasPrices', 'ripemd160Word') * BigInt(Math.ceil(data.length / 32))

  if (opts.gasLimit < gasUsed) {
    return OOGResult(opts.gasLimit)
  }

  return {
    gasUsed,
    returnValue: setLengthLeft(toBuffer(ripemd160(data)), 32),
  }
}
