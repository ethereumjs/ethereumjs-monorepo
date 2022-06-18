import { sha256 } from 'ethereum-cryptography/sha256'
import { toBuffer } from '@ethereumjs/util'
import { PrecompileInput } from './types'
import { OOGResult, ExecResult } from '../evm'

export default function (opts: PrecompileInput): ExecResult {
  if (!opts.data) throw new Error('opts.data missing but required')

  const data = opts.data

  let gasUsed = opts._common.param('gasPrices', 'sha256')
  gasUsed += opts._common.param('gasPrices', 'sha256Word') * BigInt(Math.ceil(data.length / 32))

  if (opts.gasLimit < gasUsed) {
    return OOGResult(opts.gasLimit)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: toBuffer(sha256(data)),
  }
}
