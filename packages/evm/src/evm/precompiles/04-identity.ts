import { PrecompileInput } from './types'
import { OOGResult, ExecResult } from '../evm'

export default function (opts: PrecompileInput): ExecResult {
  if (!opts.data) throw new Error('opts.data missing but required')

  const data = opts.data

  let gasUsed = opts._common.param('gasPrices', 'identity')
  gasUsed += opts._common.param('gasPrices', 'identityWord') * BigInt(Math.ceil(data.length / 32))

  if (opts.gasLimit < gasUsed) {
    return OOGResult(opts.gasLimit)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: data,
  }
}
