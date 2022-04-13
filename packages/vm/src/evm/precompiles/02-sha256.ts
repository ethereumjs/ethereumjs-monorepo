import { sha256 } from 'ethereum-cryptography/sha256'
import { toBuffer } from 'ethereumjs-util'
import { PrecompileInput } from './types'
import { OOGResult, ExecResult } from '../evm'
const assert = require('assert')

export default function (opts: PrecompileInput): ExecResult {
  assert(opts.data)

  const data = opts.data

  let gasUsed = opts._common.param('gasPrices', 'sha256') ?? BigInt(0)
  gasUsed +=
    (opts._common.param('gasPrices', 'sha256Word') ?? BigInt(0)) *
    BigInt(Math.ceil(data.length / 32))

  if (opts.gasLimit < gasUsed) {
    return OOGResult(opts.gasLimit)
  }

  return {
    gasUsed,
    returnValue: toBuffer(sha256(data)),
  }
}
