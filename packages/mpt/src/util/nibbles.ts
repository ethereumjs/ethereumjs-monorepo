import type { Nibbles } from '../types.ts'

/**
 * Expand a byte array into one nibble per half-byte.
 *
 * @param key Raw key bytes
 */
export function bytesToNibbles(key: Uint8Array): Nibbles {
  const nibbles = [] as Nibbles

  for (let i = 0; i < key.length; i++) {
    let q = i * 2
    nibbles[q] = key[i] >> 4
    ++q
    nibbles[q] = key[i] % 16
  }

  return nibbles
}

/**
 * Pack an even-length nibble array into bytes (two nibbles per byte).
 *
 * @param arr Nibble array with even length
 */
export function nibblesTypeToPackedBytes(arr: Nibbles): Uint8Array {
  const buf = new Uint8Array(arr.length / 2)
  for (let i = 0; i < buf.length; i++) {
    let q = i * 2
    buf[i] = (arr[q] << 4) + arr[++q]
  }
  return buf
}

/**
 * Lexicographic compare of two nibble arrays.
 *
 * @returns `-1`, `0`, or `1` when `n1` is less than, equal to, or greater than `n2`
 */
export function nibblesCompare(n1: Nibbles, n2: Nibbles) {
  const cmpLength = Math.min(n1.length, n2.length)

  let res = 0
  for (let i = 0; i < cmpLength; i++) {
    if (n1[i] < n2[i]) {
      res = -1
      break
    } else if (n1[i] > n2[i]) {
      res = 1
      break
    }
  }

  if (res === 0) {
    if (n1.length < n2.length) {
      res = -1
    } else if (n1.length > n2.length) {
      res = 1
    }
  }

  return res
}

/**
 * Count matching prefix nibbles shared by two paths.
 */
export function matchingNibbleLength(nib1: Nibbles, nib2: Nibbles): number {
  let i = 0
  while (nib1[i] === nib2[i] && nib1.length > i) {
    i++
  }
  return i
}
