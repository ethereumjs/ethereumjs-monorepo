import { equalsBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { FORMAT, MAGIC } from './constants.ts'

export const EOFBYTES = new Uint8Array([FORMAT, MAGIC])
export const EOFHASH = keccak_256(EOFBYTES)

/**
 * Returns `true` if `code` is an EOF contract, otherwise `false`
 * @param code Code to test
 */
export function isEOF(code: Uint8Array): boolean {
  const check = code.subarray(0, EOFBYTES.length)
  return equalsBytes(EOFBYTES, check)
}
