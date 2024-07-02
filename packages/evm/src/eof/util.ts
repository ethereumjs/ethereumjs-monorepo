import { keccak256 } from 'ethereum-cryptography/keccak.js'
import { equalsBytes } from 'ethereum-cryptography/utils'

import { FORMAT, MAGIC } from './constants.js'

export const EOFBYTES = new Uint8Array([FORMAT, MAGIC])
export const EOFHASH = keccak256(EOFBYTES)

/**
 * Returns `true` if `code` is an EOF contract, returns `false` otherwise
 * @param code Code to test if it is EOF
 */
export function isEOF(code: Uint8Array): boolean {
  const check = code.subarray(0, EOFBYTES.length)
  return equalsBytes(EOFBYTES, check)
}
