const MASK_64 = (1n << 64n) - 1n

export function putUint64BE(dst: Uint8Array, offset: number, value: bigint): void {
  value = BigInt.asUintN(64, value)
  const hex = value.toString(16).padStart(16, '0')
  for (let i = 0; i < 8; i++) {
    dst[offset + i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
}

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

export function bytesToLimbs(b: Uint8Array): bigint[] {
  const wordCount = Math.ceil(b.length / 8)
  const paddedSize = wordCount * 8

  const paddedBytes = new Uint8Array(paddedSize)
  paddedBytes.set(b, paddedSize - b.length)

  const limbs: bigint[] = new Array(wordCount)

  // Extract each 64-bit word in big-endian order
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

function limbsToBytes(limbs: bigint[]): Uint8Array {
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

  // Remove leading zeros:
  let firstNonZero = 0
  while (firstNonZero < result.length && result[firstNonZero] === 0) {
    firstNonZero++
  }

  return firstNonZero === result.length ? new Uint8Array([0]) : result.slice(firstNonZero)
}

function limbsToInt(limbs: bigint[]): bigint {
  const numBytes = limbsToBytes(limbs)
  return uint8ArrayToBigint(numBytes)
}

// Helper function to convert a Uint8Array (big-endian) to bigint
function uint8ArrayToBigint(arr: Uint8Array): bigint {
  if (arr.length === 0) return 0n
  const hex = '0x' + Array.from(arr, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return BigInt(hex)
}

function placeBEBytesInOutput(out: bigint[], b: Uint8Array): void {
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

function intToBEBytes(value: bigint): Uint8Array {
  if (value === 0n) return new Uint8Array([0])
  let hex = value.toString(16)
  if (hex.length % 2 !== 0) {
    hex = '0' + hex
  }
  const arr = new Uint8Array(hex.length / 2)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return arr
}

export function mulModBinary(
  z: bigint[],
  x: bigint[],
  y: bigint[],
  modulus: bigint[],
  modInv: bigint,
) {
  const X = limbsToInt(x)
  const Y = limbsToInt(y)
  const M = limbsToInt(modulus)

  const result = (X * Y) % M
  const resultBytes = intToBEBytes(result)
  placeBEBytesInOutput(z, resultBytes)
}

export function addModBinary(z: bigint[], x: bigint[], y: bigint[], modulus: bigint[]) {
  const X = limbsToInt(x)
  const Y = limbsToInt(y)
  const M = limbsToInt(modulus)

  const result = (X + Y) % M
  const resultBytes = intToBEBytes(result)
  placeBEBytesInOutput(z, resultBytes)
}

export function subModBinary(z: bigint[], x: bigint[], y: bigint[], modulus: bigint[]) {
  const X = limbsToInt(x)
  const Y = limbsToInt(y)
  const M = limbsToInt(modulus)

  let result = (X - Y) % M
  if (result < 0n) {
    result += M
  }
  const resultBytes = intToBEBytes(result)
  placeBEBytesInOutput(z, resultBytes)
}

export function lt(x: bigint[], y: bigint[]): boolean {
  for (let i = x.length; i > 0; i--) {
    if (x[i - 1] < y[i - 1]) {
      return true
    }
  }
  return false
}
