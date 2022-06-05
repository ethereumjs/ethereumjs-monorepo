import ethCryptoSha256 = require('ethereum-cryptography/sha256')
import { PrecompileInput } from './types.js'
import { OOGResult, ExecResult } from '../evm.js'

export default function (opts: PrecompileInput): ExecResult {
  if (!opts.data) throw new Error('opts.data missing but required')

  const data = opts.data

  let gasUsed = opts._common.param('gasPrices', 'sha256')
  gasUsed += opts._common.param('gasPrices', 'sha256Word') * BigInt(Math.ceil(data.length / 32))

  if (opts.gasLimit < gasUsed) {
    return OOGResult(opts.gasLimit)
  }

  return {
    gasUsed,
    returnValue: Buffer.from(ethCryptoSha256.sha256(data)),
  }
}
