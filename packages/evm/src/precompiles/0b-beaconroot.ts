import {
  Address,
  bigIntToBytes,
  bytesToBigInt,
  setLengthLeft,
  short,
  zeros,
} from '@ethereumjs/util'

import { type ExecResult, OOGResult } from '../evm.js'
import { ERROR, EvmError } from '../exceptions.js'

import type { PrecompileInput } from './types.js'

const address = Address.fromString('0x000000000000000000000000000000000000000b')

export async function precompile0b(opts: PrecompileInput): Promise<ExecResult> {
  const data = opts.data

  const gasUsed = opts.common.param('gasPrices', 'beaconrootCost')
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

  if (data.length < 32) {
    return {
      returnValue: new Uint8Array(0),
      executionGasUsed: gasUsed,
      exceptionError: new EvmError(ERROR.INVALID_INPUT_LENGTH),
    }
  }

  const timestampInput = bytesToBigInt(data.slice(0, 32))
  const historicalRootsLength = BigInt(opts.common.param('vm', 'historicalRootsLength'))

  const timestampIndex = timestampInput % historicalRootsLength
  const recordedTimestamp = await opts._EVM.stateManager.getContractStorage(
    address,
    setLengthLeft(bigIntToBytes(timestampIndex), 32)
  )

  if (bytesToBigInt(recordedTimestamp) !== timestampInput) {
    return {
      executionGasUsed: gasUsed,
      returnValue: zeros(32),
    }
  }
  const timestampExtended = timestampIndex + historicalRootsLength
  const returnData = setLengthLeft(
    await opts._EVM.stateManager.getContractStorage(
      address,
      setLengthLeft(bigIntToBytes(timestampExtended), 32)
    ),
    32
  )

  if (opts._debug !== undefined) {
    opts._debug(`BEACONROOT (0x0B) return data=${short(returnData)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: returnData,
  }
}
