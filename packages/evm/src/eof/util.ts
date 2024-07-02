import { equalsBytes } from 'ethereum-cryptography/utils'

import { FORMAT, MAGIC } from './constants.js'

/**
 * Returns `true` if `code` is an EOF contract, returns `false` otherwise
 * @param code Code to test if it is EOF
 */
export function isEOF(code: Uint8Array): boolean {
  const bytes = new Uint8Array([FORMAT, MAGIC])
  const check = code.subarray(0, bytes.length)
  return equalsBytes(bytes, check)
}
