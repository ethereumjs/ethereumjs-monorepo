export function bytesToLimbs(b: Uint8Array): Uint8Array[] {
  const wordCount = Math.ceil(b.length / 8)

  // Calculate the padded size to be a multiple of 8 bytes
  const paddedSize = wordCount * 8

  // Create a padded array to right-align the input bytes within the padded size
  const paddedBytes = new Uint8Array(paddedSize)
  paddedBytes.set(b, paddedSize - b.length)

  const limbs: Uint8Array[] = new Array(wordCount)

  // Extract each 64-bit word as an 8-byte Uint8Array (big-endian)
  for (let i = 0; i < wordCount; i++) {
    const offset = i * 8
    // Slice out 8 bytes for this limb
    limbs[i] = paddedBytes.slice(offset, offset + 8)
  }

  // Reverse the limbs to have little-endian limb order:
  // The least significant limb (lowest-order 64 bits) should be at index 0.
  limbs.reverse()

  return limbs
}
