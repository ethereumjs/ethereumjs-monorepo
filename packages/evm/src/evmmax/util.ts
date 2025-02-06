export const MASK_64 = (1n << 64n) - 1n

/**
 * Places the lower 64 bits of a bigint interpreted as a byte array in a destination byte array starting at offset
 *
 * @param dst destination byte array to put bytes into
 * @param offset offset to start putting bytes from
 * @param value bigint whose lower 64 bits are to be interpreted as big endian bytes and put into destination from offset
 */
export function putUint64BE(dst: Uint8Array, offset: number, value: bigint): void {
  value = BigInt.asUintN(64, value)
  const hex = value.toString(16).padStart(16, '0')
  for (let i = 0; i < 8; i++) {
    dst[offset + i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
}

/**
 * Computes the negative modular inverse of mod modulo 2^64,
 * i.e. returns (-mod^-1) mod 2^64.
 *
 * This uses a Newton-like iteration (based on the Go standard library
 * approach) to find the 64-bit inverse of mod, then negates it
 * modulo 2^64. Commonly used in single-limb Montgomery multiplication
 * to get (-mod^-1) mod 2^64.
 *
 * @param mod A 64-bit bigint value to invert (mod must be < 2^64).
 * @returns The negative inverse of mod, i.e. (-1 * mod^-1) mod 2^64.
 */
export function negModInverse(mod: bigint): bigint {
  let k0 = (2n - mod) & MASK_64
  let t = (mod - 1n) & MASK_64

  for (let i = 1; i < 64; i <<= 1) {
    t = (t * t) & MASK_64
    k0 = (k0 * ((t + 1n) & MASK_64)) & MASK_64
  }
  k0 = -k0 & MASK_64

  return k0
}

/**
 * Converts a big-endian byte array into an array of 64-bit limbs (bigints)
 * in little-endian limb order.
 *
 * @param b A Uint8Array of bytes in big-endian order (most significant byte first).
 * @returns An array of 64-bit bigints (limbs) in little-endian order.
 */
export function bytesToLimbs(b: Uint8Array): bigint[] {
  // Determine how many 64-bit words (limbs) are needed to hold b
  const wordCount = Math.ceil(b.length / 8)
  const paddedSize = wordCount * 8

  // Zero-pads b on the left (most-significant bytes) if needed
  const paddedBytes = new Uint8Array(paddedSize)
  paddedBytes.set(b, paddedSize - b.length)

  // Reads each 8-byte block as a 64-bit big-endian integer
  const limbs: bigint[] = new Array(wordCount)
  for (let i = 0; i < wordCount; i++) {
    const offset = i * 8
    // Construct the 64-bit limb as a bigint
    const limb =
      (BigInt(paddedBytes[offset]) << 56n) |
      (BigInt(paddedBytes[offset + 1]) << 48n) |
      (BigInt(paddedBytes[offset + 2]) << 40n) |
      (BigInt(paddedBytes[offset + 3]) << 32n) |
      (BigInt(paddedBytes[offset + 4]) << 24n) |
      (BigInt(paddedBytes[offset + 5]) << 16n) |
      (BigInt(paddedBytes[offset + 6]) << 8n) |
      BigInt(paddedBytes[offset + 7])
    limbs[i] = limb
  }

  // Reverse the limbs to get little-endian
  limbs.reverse()

  return limbs
}

/**
 * Converts an array of 64-bit limbs (bigints) in little-endian limb order
 * into a big-endian byte array, then removes leading zeros.
 *
 * @param limbs An array of 64-bit bigints in little-endian limb order.
 * @returns A Uint8Array in big-endian order with no leading zeros.
 */
export function limbsToBytes(limbs: bigint[]): Uint8Array {
  const limbCount = limbs.length
  const result = new Uint8Array(limbCount * 8)

  for (let i = 0; i < limbCount; i++) {
    const limb = limbs[limbCount - 1 - i]
    // Extract 8 bytes in big-endian order
    const offset = i * 8
    result[offset] = Number((limb >> 56n) & 0xffn)
    result[offset + 1] = Number((limb >> 48n) & 0xffn)
    result[offset + 2] = Number((limb >> 40n) & 0xffn)
    result[offset + 3] = Number((limb >> 32n) & 0xffn)
    result[offset + 4] = Number((limb >> 24n) & 0xffn)
    result[offset + 5] = Number((limb >> 16n) & 0xffn)
    result[offset + 6] = Number((limb >> 8n) & 0xffn)
    result[offset + 7] = Number(limb & 0xffn)
  }

  // Remove leading zeros
  let firstNonZero = 0
  while (firstNonZero < result.length && result[firstNonZero] === 0) {
    firstNonZero++
  }

  return firstNonZero === result.length ? new Uint8Array([0]) : result.slice(firstNonZero)
}

/**
 * Helper function to convert a Uint8Array (big-endian) to bigint
 *
 * @param arr big endian byte array
 * @returns bigint representation of input bytes
 */
export function uint8ArrayToBigint(arr: Uint8Array): bigint {
  if (arr.length === 0) return 0n
  const hex = '0x' + Array.from(arr, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return BigInt(hex)
}

export function limbsToInt(limbs: bigint[]): bigint {
  const numBytes = limbsToBytes(limbs)
  return uint8ArrayToBigint(numBytes)
}

/**
 * Compares two limb arrays and returns true iff x < y
 *
 * @param x first limb array being compared
 * @param y second limb array being compared
 * @returns x < y
 */
export function lt(x: bigint[], y: bigint[]): boolean {
  for (let i = x.length; i > 0; i--) {
    if (x[i - 1] < y[i - 1]) {
      return true
    }
  }
  return false
}

/**
 * Interprets the provided big-endian byte array b as a 64-bit limb sequence
 * and places it into the given out array of bigints, each representing 64 bits
 *
 * @param out An array of bigints, each 64 bits in size, to hold the result
 * @param b A big-endian byte array to be interpreted and placed into out
 */
export function placeBEBytesInOutput(out: bigint[], b: Uint8Array): void {
  const padded = new Uint8Array(out.length * 8)
  padded.set(b, padded.length - b.length)

  const resultLimbs = out.length
  for (let i = 0; i < resultLimbs; i++) {
    const offset = i * 8
    let limb = 0n
    limb |= BigInt(padded[offset]) << 56n
    limb |= BigInt(padded[offset + 1]) << 48n
    limb |= BigInt(padded[offset + 2]) << 40n
    limb |= BigInt(padded[offset + 3]) << 32n
    limb |= BigInt(padded[offset + 4]) << 24n
    limb |= BigInt(padded[offset + 5]) << 16n
    limb |= BigInt(padded[offset + 6]) << 8n
    limb |= BigInt(padded[offset + 7])

    out[resultLimbs - 1 - i] = limb
  }
}

/**
 * Converts a non-negative bigint value into a big-endian byte array,
 * removing any leading zeros
 *
 * @param value A non-negative bigint to convert to a big-endian byte array.
 * @returns A big-endian Uint8Array representation of value with no leading zeros
 */
export function bigIntToBEBytes(value: bigint): Uint8Array {
  if (value === 0n) return new Uint8Array([0])
  let hex = value.toString(16)

  // prepend '0' if needed to make the hex length even
  if (hex.length % 2 !== 0) {
    hex = '0' + hex
  }

  // parse pairs of hex chars into a byte array in big-endian order
  const arr = new Uint8Array(hex.length / 2)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return arr
}

//
// odd modulus arithmetic helpers, below
//

/**
 * Performs a 64-bit multiplication of a * b and returns [hi, lo],
 * where lo is the low 64 bits, and hi is the high 64 bits.
 *
 * @param a A 64-bit bigint
 * @param b A 64-bit bigint
 * @returns [hi, lo] => two 64-bit bigints: high part and low part of the product
 */
export function mul64(a: bigint, b: bigint): [bigint, bigint] {
  const product = a * b
  const lo = product & MASK_64
  const hi = product >> 64n
  return [hi, lo]
}

/**
 * Adds three 64-bit bigints (x, y, carryIn) and returns [low, carryOut],
 * where low is the sum masked to 64 bits, and carryOut is the overflow.
 *
 * @param x A 64-bit bigint
 * @param y A 64-bit bigint
 * @param carryIn A 64-bit bigint carry-in
 * @returns [low, carryOut] => sum's low 64 bits and carry-out
 */
export function add64(x: bigint, y: bigint, carryIn: bigint): [bigint, bigint] {
  const sum = x + y + carryIn
  const low = sum & MASK_64
  const carryOut = sum >> 64n
  return [low, carryOut]
}

/**
 * Subtracts y + borrowIn from x in 64-bit space, returning [diff, borrowOut].
 * If the difference is negative, diff is masked to 64 bits and borrowOut = 1.
 *
 * @param x A 64-bit bigint operand
 * @param y A 64-bit bigint operand
 * @param borrowIn A 64-bit bigint borrow going into the difference
 * @returns [diff, borrowOut] => 64-bit difference and borrow-out
 */
export function sub64(x: bigint, y: bigint, borrowIn: bigint): [bigint, bigint] {
  let diff = x - y - borrowIn
  let borrowOut = 0n
  if (diff < 0n) {
    diff &= MASK_64
    borrowOut = 1n
  }
  return [diff & MASK_64, borrowOut]
}

/**
 * Multiplies a and b in 64-bit space (hi, lo) then adds c to lo,
 * returning the high part of the result, masked to 64 bits.
 *
 * @param a A 64-bit bigint operand
 * @param b A 64-bit bigint operand
 * @param c A 64-bit bigint addend to lo
 * @returns A 64-bit bigint representing (hi + carry)
 */
export function madd0(a: bigint, b: bigint, c: bigint): bigint {
  const [hi, lo] = mul64(a, b)
  const sum = lo + c
  const carry = sum >> 64n
  const newHi = (hi + carry) & MASK_64
  return newHi
}

/**
 * Multiplies a and b (64 bits), then adds c to the low part.
 * Returns [updatedHi, updatedLo], both masked to 64 bits.
 *
 * @param a A 64-bit bigint operand
 * @param b A 64-bit bigint operand
 * @param c A 64-bit bigint carry added to the product's low part
 * @returns [hi2, lo2] => two 64-bit bigints: new high and new low
 */
export function madd1(a: bigint, b: bigint, c: bigint): [bigint, bigint] {
  const [hi, lo] = mul64(a, b)
  const [lo2, carry] = add64(lo, c, 0n)
  const [hi2, _] = add64(hi, 0n, carry)
  return [hi2 & MASK_64, lo2 & MASK_64]
}

/**
 * Multiplies a and b (64 bits), adds c and d to the partial sums,
 * carrying through intermediate steps. Returns [updatedHi, updatedLo].
 *
 * @param a A 64-bit bigint operand
 * @param b A 64-bit bigint operand
 * @param c A 64-bit bigint carry to add
 * @param d A 64-bit bigint carry to add
 * @returns [hi, lo] => final high and low 64-bit bigints after all adds
 */
export function madd2(a: bigint, b: bigint, c: bigint, d: bigint): [bigint, bigint] {
  const [hi, lo] = mul64(a, b)
  const [c2, carry] = add64(c, d, 0n)
  const [hi2, _] = add64(hi, 0n, carry)
  const [lo2, carry2] = add64(lo, c2, 0n)
  const [hi3, __] = add64(hi2, 0n, carry2)
  return [hi3 & MASK_64, lo2 & MASK_64]
}
