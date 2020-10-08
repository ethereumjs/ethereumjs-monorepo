import { BN } from 'ethereumjs-util'
import { BNLike } from './types'

/**
 * Convert BN to 0x-prefixed hex string.
 */
export function bnToHex(value: BN): string {
  return `0x${value.toString(16)}`
}

/**
 * This utility function returns a new (cloned) BN from a Buffer or BNLike object.
 */
export function toBN(value: BNLike | Buffer) {
  if (typeof value == 'string') {
    if (value.substr(0, 2) == '0x') {
      // in case that the hex string is of odd-length, we pad a 0 at the start.
      let hexStr = value.substr(2)
      hexStr = hexStr.padStart(hexStr.length + (hexStr.length % 2), '0')
      return new BN(Buffer.from(hexStr, 'hex'))
    }
  }
  return new BN(value).clone()
}
