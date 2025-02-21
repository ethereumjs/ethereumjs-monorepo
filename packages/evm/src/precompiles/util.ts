import { short } from '@ethereumjs/util'

import type { PrecompileInput } from './index.js'

/**
 * Checks that the gas used remain under the gas limit.
 *
 * @param opts
 * @param gasUsed
 * @param pName
 * @returns
 */
export const gasLimitCheck = (opts: PrecompileInput, gasUsed: bigint, pName: string) => {
  if (opts._debug !== undefined) {
    opts._debug(
      `Run ${pName} precompile data=${short(opts.data)} length=${
        opts.data.length
      } gasLimit=${opts.gasLimit} gasUsed=${gasUsed}`,
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

/**
 * Checks that the length of the provided data is equal to `length`.
 *
 * @param opts
 * @param length
 * @param pName
 * @returns
 */
export const equalityLengthCheck = (opts: PrecompileInput, length: number, pName: string) => {
  if (opts.data.length !== length) {
    if (opts._debug !== undefined) {
      opts._debug(
        `${pName} failed: Invalid input length length=${opts.data.length} (expected: ${length})`,
      )
    }
    return false
  }
  return true
}

/**
 * Checks that the total length of the provided data input can be subdivided into k equal parts
 * with `length` (without leaving some remainder bytes).
 *
 * @param opts
 * @param length
 * @param pName
 * @returns
 */
export const moduloLengthCheck = (opts: PrecompileInput, length: number, pName: string) => {
  if (opts.data.length % length !== 0) {
    if (opts._debug !== undefined) {
      opts._debug(
        `${pName} failed: Invalid input length length=${opts.data.length} (expected: ${length}*k bytes)`,
      )
    }
    return false
  }
  return true
}
