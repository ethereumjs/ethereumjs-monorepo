/**
 * Compares two byte arrays and returns the count of consecutively matching items from the start.
 *
 * @function
 * @param {Uint8Array} bytes1 - The first Uint8Array to compare.
 * @param {Uint8Array} bytes2 - The second Uint8Array to compare.
 * @returns {number} The count of consecutively matching items from the start.
 */
export function matchingBytesLength(bytes1: Uint8Array, bytes2: Uint8Array): number {
  let count = 0
  const minLength = Math.min(bytes1.length, bytes2.length)

  // Unroll the loop for better performance
  for (let i = 0; i < minLength - 3; i += 4) {
    // Compare 4 bytes at a time
    if (
      bytes1[i] === bytes2[i] &&
      bytes1[i + 1] === bytes2[i + 1] &&
      bytes1[i + 2] === bytes2[i + 2] &&
      bytes1[i + 3] === bytes2[i + 3]
    ) {
      count += 4
    } else {
      // Break early if a mismatch is found
      break
    }
  }

  // Handle any remaining elements
  for (let i = minLength - (minLength % 4); i < minLength; i++) {
    if (bytes1[i] === bytes2[i]) {
      count++
    } else {
      break
    }
  }

  return count
}
