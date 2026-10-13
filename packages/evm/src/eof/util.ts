import { equalsBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { FORMAT, MAGIC } from './constants.ts'

/** Two-byte EOF magic prefix (`0xEF00`). */
export const EOFBYTES = new Uint8Array([FORMAT, MAGIC])
/** Keccak-256 hash of {@link EOFBYTES}; used as the EOF codehash prefix. */
export const EOFHASH = keccak_256(EOFBYTES)

/**
 * Returns whether bytecode begins with the EOF format prefix.
 */
export function isEOF(code: Uint8Array): boolean {
  const check = code.subarray(0, EOFBYTES.length)
  return equalsBytes(EOFBYTES, check)
}
