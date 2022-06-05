import ethCryptoRipemd160 = require('ethereum-cryptography/ripemd160')
import { setLengthLeft } from 'ethereumjs-util'
import { PrecompileInput } from './types.js'
import { OOGResult, ExecResult } from '../evm.js'

export default function (opts: PrecompileInput): ExecResult {
  if (!opts.data) throw new Error('opts.data missing but required')

  const data = opts.data

  let gasUsed = opts._common.param('gasPrices', 'ripemd160')
  gasUsed += opts._common.param('gasPrices', 'ripemd160Word') * BigInt(Math.ceil(data.length / 32))

  if (opts.gasLimit < gasUsed) {
    return OOGResult(opts.gasLimit)
  }

  return {
    gasUsed,
    returnValue: setLengthLeft(Buffer.from(ethCryptoRipemd160.ripemd160(data)), 32),
  }
}
