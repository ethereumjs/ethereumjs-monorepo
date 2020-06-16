export type Nibbles = number[]

/**
 * Converts a buffer to a nibble array.
 * @method bufferToNibbles
 * @param {Buffer} key
 * @private
 */
export function bufferToNibbles(key: Buffer): Nibbles {
  const bkey = Buffer.from(key)
  let nibbles = [] as any

  for (let i = 0; i < bkey.length; i++) {
    let q = i * 2
    nibbles[q] = bkey[i] >> 4
    ++q
    nibbles[q] = bkey[i] % 16
  }

  return nibbles
}

/**
 * Converts a nibble array into a buffer.
 * @method nibblesToBuffer
 * @param {Nibbles} arr - Nibble array
 * @private
 */
export function nibblesToBuffer(arr: Nibbles): Buffer {
  let buf = Buffer.alloc(arr.length / 2)
  for (let i = 0; i < buf.length; i++) {
    let q = i * 2
    buf[i] = (arr[q] << 4) + arr[++q]
  }
  return buf
}

/**
 * Returns the number of in order matching nibbles of two give nibble arrays.
 * @method matchingNibbleLength
 * @param {Nibbles} nib1
 * @param {Nibbles} nib2
 * @private
 */
export function matchingNibbleLength(nib1: Nibbles, nib2: Nibbles): number {
  let i = 0
  while (nib1[i] === nib2[i] && nib1.length > i) {
    i++
  }
  return i
}

/**
 * Prepends hex prefix to an array of nibbles.
 * @method addHexPrefix
 * @param {Nibbles} key - Array of nibbles
 * @returns {Nibbles} - returns buffer of encoded data
 **/
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
 * Removes hex prefix of an array of nibbles.
 * @method removeHexPrefix
 * @param {Nibbles} val - Array of nibbles
 * @private
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
 * Returns true if hex-prefixed path is for a terminating (leaf) node.
 * @method isTerminator
 * @param {Nibbles} key - a hex-prefixed array of nibbles
 * @private
 */
export function isTerminator(key: Nibbles): boolean {
  return key[0] > 1
}
