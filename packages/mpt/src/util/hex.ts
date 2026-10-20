import type { Nibbles } from '../types.ts'

/**
 * Prepends the Ethereum hex-prefix encoding to a nibble path.
 *
 * @param key Nibble path (modified in place)
 * @param terminator When `true`, marks a leaf (terminating) path
 */
export function addHexPrefix(key: Nibbles, terminator: boolean): Nibbles {
  // odd
  if (key.length % 2) {
    key.unshift(1)
  } else {
    // even
    key.unshift(0)
    key.unshift(0)
  }

  if (terminator) {
    key[0] += 2
  }

  return key
}

/**
 * Strip hex-prefix metadata from an encoded nibble path.
 *
 * @param val Hex-prefixed nibbles (modified in place)
 */
export function removeHexPrefix(val: Nibbles): Nibbles {
  if (val[0] % 2) {
    val = val.slice(1)
  } else {
    val = val.slice(2)
  }

  return val
}

/**
 * Return whether a hex-prefixed path marks a leaf (terminator) node.
 *
 * @param key Hex-prefixed nibble array
 */
export function isTerminator(key: Nibbles): boolean {
  return key[0] > 1
}
