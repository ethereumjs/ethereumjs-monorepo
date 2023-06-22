import { Address, short } from '@ethereumjs/util'

import { type ExecResult, OOGResult } from '../evm.js'

import type { PrecompileInput } from './types.js'

const address = Address.fromString('0x000000000000000000000000000000000000000b')

export async function precompile0B_Beaconroot(opts: PrecompileInput): Promise<ExecResult> {
  const data = opts.data

  const gasUsed = opts._common.param('gasPrices', 'beaconrootCost')
  if (opts._debug !== undefined) {
    opts._debug(
      `Run BEACONROOT (0x0B) precompile data=${short(opts.data)} length=${
        opts.data.length
      } gasLimit=${opts.gasLimit} gasUsed=${gasUsed}`
    )
  }

  if (opts.gasLimit < gasUsed) {
    if (opts._debug !== undefined) {
      opts._debug(`BEACONROOT (0x0B) failed: OOG`)
    }
    return OOGResult(opts.gasLimit)
  }

  const returnData = await opts.stateManager.getContractStorage(address, opts.data)

  if (opts._debug !== undefined) {
    opts._debug(`BEACONROOT (0x0B) return data=${short(returnData)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: returnData,
  }
}
