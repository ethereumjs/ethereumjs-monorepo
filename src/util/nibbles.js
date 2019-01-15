/**
 * Converts a string OR a buffer to a nibble array.
 * @method stringToNibbles
 * @param {Buffer| String} key
 * @private
 */
export function stringToNibbles (key) {
  const bkey = new Buffer(key)
  let nibbles = []

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
 * @param {Array} Nibble array
 * @private
 */
export function nibblesToBuffer (arr) {
  let buf = new Buffer(arr.length / 2)
  for (let i = 0; i < buf.length; i++) {
    let q = i * 2
    buf[i] = (arr[q] << 4) + arr[++q]
  }
  return buf
}

/**
 * Returns the number of in order matching nibbles of two give nibble arrays.
 * @method matchingNibbleLength
 * @param {Array} nib1
 * @param {Array} nib2
 * @private
 */
export function matchingNibbleLength (nib1, nib2) {
  let i = 0
  while (nib1[i] === nib2[i] && nib1.length > i) {
    i++
  }
  return i
}

/**
 * Compare two nibble array keys.
 * @param {Array} keyA
 * @param {Array} keyB
 */
export function doKeysMatch (keyA, keyB) {
  const length = matchingNibbleLength(keyA, keyB)
  return length === keyA.length && length === keyB.length
}
