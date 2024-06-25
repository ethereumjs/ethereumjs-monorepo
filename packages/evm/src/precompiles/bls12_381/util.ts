import { equalsBytes, short } from '@ethereumjs/util'

import type { PrecompileInput } from '../types'

const ZERO_BYTES_16 = new Uint8Array(16)

export const gasCheck = (opts: PrecompileInput, gasUsed: bigint, pName: string) => {
  if (opts._debug !== undefined) {
    opts._debug(
      `Run ${pName} precompile data=${short(opts.data)} length=${opts.data.length} gasLimit=${
        opts.gasLimit
      } gasUsed=${gasUsed}`
    )
  }

  if (opts.gasLimit < gasUsed) {
    if (opts._debug !== undefined) {
      opts._debug(`${pName} failed: OOG`)
    }
    return false
  }
  return true
}

export const zeroByteCheck = (
  opts: PrecompileInput,
  zeroByteRanges: number[][],
  pName: string,
  pairStart = 0
) => {
  for (const index in zeroByteRanges) {
    const slicedBuffer = opts.data.subarray(
      zeroByteRanges[index][0] + pairStart,
      zeroByteRanges[index][1] + pairStart
    )
    if (!(equalsBytes(slicedBuffer, ZERO_BYTES_16) === true)) {
      if (opts._debug !== undefined) {
        opts._debug(`${pName} failed: Point not on curve`)
      }
      return false
    }
  }
  return true
}
