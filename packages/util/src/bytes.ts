import {
  bytesToHex as bytesToUnprefixedHexNoble,
  hexToBytes as hexToBytesNoble,
  randomBytes as randomBytesNoble,
} from '@noble/hashes/utils.js'

import { EthereumJSErrorWithoutCode } from './errors.ts'
import { assertIsArray, assertIsBytes, assertIsHexString } from './helpers.ts'
import { isHexString, padToEven, stripHexPrefix } from './internal.ts'

import type { PrefixedHexString, TransformableToBytes } from './types.ts'

const BIGINT_0 = BigInt(0)

/**
 * @deprecated Use {@link bytesToHex} from `@ethereumjs/util` or the unprefixed variant from `@noble/hashes/utils`.
 */
export const bytesToUnprefixedHex = bytesToUnprefixedHexNoble

/**
 * Convert a `0x`-prefixed hex string to bytes.
 *
 * @throws If the input is not `0x`-prefixed
 */
export const hexToBytes = (hex: PrefixedHexString): Uint8Array => {
  if (!hex.startsWith('0x')) throw EthereumJSErrorWithoutCode('input string must be 0x prefixed')
  return hexToBytesNoble(padToEven(stripHexPrefix(hex)))
}

/** Convert a hex string without a `0x` prefix to bytes. @throws If the input is prefixed */
export const unprefixedHexToBytes = (hex: string): Uint8Array => {
  if (hex.startsWith('0x')) throw EthereumJSErrorWithoutCode('input string cannot be 0x prefixed')
  return hexToBytesNoble(padToEven(hex))
}

/**
 * Convert bytes to a `0x`-prefixed hex string.
 *
 * Returns `0x` for an empty input.
 */
export const bytesToHex = (bytes: Uint8Array): PrefixedHexString => {
  // Using deprecated bytesToUnprefixedHex for performance: bytesToHex is a wrapper that adds the 0x prefix.
  // Using bytesToUnprefixedHex directly avoids creating an intermediate prefixed string and then stripping it.
  const unprefixedHex = bytesToUnprefixedHex(bytes)
  return `0x${unprefixedHex}`
}

// BigInt cache for the numbers 0 - 256*256-1 (two-byte bytes)
const BIGINT_CACHE: bigint[] = []
for (let i = 0; i <= 256 * 256 - 1; i++) {
  BIGINT_CACHE[i] = BigInt(i)
}

/**
 * Interpret bytes as an unsigned big-endian integer (optionally little-endian).
 *
 * @param littleEndian When true, reverse byte order before conversion
 */
export const bytesToBigInt = (bytes: Uint8Array, littleEndian = false): bigint => {
  assertIsBytes(bytes)
  if (littleEndian) {
    bytes = bytes.slice().reverse()
  }
  const hex = bytesToHex(bytes)
  if (hex === '0x') {
    return BIGINT_0
  }
  if (hex.length === 4) {
    // If the byte length is 1 (this is faster than checking `bytes.length === 1`)
    return BIGINT_CACHE[bytes[0]]
  }
  if (hex.length === 6) {
    return BIGINT_CACHE[bytes[0] * 256 + bytes[1]]
  }
  return BigInt(hex)
}

/**
 * Interpret bytes as an unsigned big-endian integer and coerce to a safe JS number.
 *
 * @throws If the value exceeds 53 bits
 */
export const bytesToInt = (bytes: Uint8Array): number => {
  const res = Number(bytesToBigInt(bytes))
  if (!Number.isSafeInteger(res)) throw EthereumJSErrorWithoutCode('Number exceeds 53 bits')
  return res
}

/******************************************/

/** Convert a non-negative safe integer to a `0x`-prefixed hex string. @throws If the input is invalid */
export const intToHex = (i: number): PrefixedHexString => {
  if (!Number.isSafeInteger(i) || i < 0) {
    throw EthereumJSErrorWithoutCode(`Received an invalid integer type: ${i}`)
  }
  return `0x${i.toString(16)}`
}

/** Convert a non-negative safe integer to minimal big-endian bytes. */
export const intToBytes = (i: number): Uint8Array => {
  const hex = intToHex(i)
  return hexToBytes(hex)
}

/**
 * Convert a bigint to minimal big-endian bytes (optionally little-endian).
 *
 * @param littleEndian When true, reverse the output byte order
 */
export const bigIntToBytes = (num: bigint, littleEndian = false): Uint8Array => {
  const bytes = hexToBytes(`0x${padToEven(num.toString(16))}`)

  return littleEndian ? bytes.reverse() : bytes
}

/**
 * Pads a `Uint8Array` with zeros till it has `length` bytes.
 * Throws if input length exceeds target length, unless allowTruncate is true.
 * @param msg the value to pad
 * @param length the number of bytes the output should be
 * @param right whether to start padding from the left or right
 * @param allowTruncate whether to allow truncation if msg exceeds length
 */
const setLength = (
  msg: Uint8Array,
  length: number,
  right: boolean,
  allowTruncate: boolean,
): Uint8Array => {
  if (msg.length > length) {
    if (!allowTruncate) {
      throw EthereumJSErrorWithoutCode(
        `Input length ${msg.length} exceeds target length ${length}. Use allowTruncate option to truncate.`,
      )
    }
    return right ? msg.subarray(0, length) : msg.subarray(-length)
  }
  if (msg.length < length) {
    return right
      ? new Uint8Array([...msg, ...new Uint8Array(length - msg.length)])
      : new Uint8Array([...new Uint8Array(length - msg.length), ...msg])
  }
  return msg
}

/** Options for {@link setLengthLeft} and {@link setLengthRight}. */
export interface SetLengthOpts {
  /** Allow truncation if msg exceeds length. Default: false */
  allowTruncate?: boolean
}

/**
 * Left-pad bytes with leading zeros to the target length.
 *
 * @throws If the input exceeds the target length unless {@link SetLengthOpts.allowTruncate} is set
 */
export const setLengthLeft = (
  msg: Uint8Array,
  length: number,
  opts: SetLengthOpts = {},
): Uint8Array => {
  assertIsBytes(msg)
  return setLength(msg, length, false, opts.allowTruncate ?? false)
}

/**
 * Right-pad bytes with trailing zeros to the target length.
 *
 * @throws If the input exceeds the target length unless {@link SetLengthOpts.allowTruncate} is set
 */
export const setLengthRight = (
  msg: Uint8Array,
  length: number,
  opts: SetLengthOpts = {},
): Uint8Array => {
  assertIsBytes(msg)
  return setLength(msg, length, true, opts.allowTruncate ?? false)
}

/**
 * Trims leading zeros from a `Uint8Array`, `number[]` or `string`.
 */
const stripZeros = <T extends Uint8Array | number[] | string = Uint8Array | number[] | string>(
  a: T,
): T => {
  let first = a[0]
  while (a.length > 0 && first.toString() === '0') {
    a = a.slice(1) as T
    first = a[0]
  }
  return a
}

/** Trim leading zero bytes from a byte array. */
export const unpadBytes = (a: Uint8Array): Uint8Array => {
  assertIsBytes(a)
  return stripZeros(a)
}

/**
 * Trims leading zeros from an `Array` (of numbers).
 */
export const unpadArray = (a: number[]): number[] => {
  assertIsArray(a)
  return stripZeros(a)
}

/**
 * Trims leading zeros from a `PrefixedHexString`.
 */
export const unpadHex = (a: PrefixedHexString): PrefixedHexString => {
  assertIsHexString(a)
  return `0x${stripZeros(stripHexPrefix(a))}`
}

/** Union of values accepted by {@link toBytes}. */
export type ToBytesInputTypes =
  | PrefixedHexString
  | number
  | bigint
  | Uint8Array
  | number[]
  | TransformableToBytes
  | null
  | undefined

/**
 * Coerce supported JavaScript values to bytes.
 *
 * Accepts hex strings, numbers, bigints, arrays, objects with `toBytes()`, and null/undefined (empty bytes).
 *
 * @throws On invalid strings, negative bigints, or unsupported types
 */
export const toBytes = (v: ToBytesInputTypes): Uint8Array => {
  if (v === null || v === undefined) {
    return new Uint8Array()
  }

  if (Array.isArray(v) || v instanceof Uint8Array) {
    return Uint8Array.from(v)
  }

  if (typeof v === 'string') {
    if (!isHexString(v)) {
      throw EthereumJSErrorWithoutCode(
        `Cannot convert string to Uint8Array. toBytes only supports 0x-prefixed hex strings and this string was given: ${v}`,
      )
    }
    return hexToBytes(v)
  }

  if (typeof v === 'number') {
    return intToBytes(v)
  }

  if (typeof v === 'bigint') {
    if (v < BIGINT_0) {
      throw EthereumJSErrorWithoutCode(`Cannot convert negative bigint to Uint8Array. Given: ${v}`)
    }
    let n = v.toString(16)
    if (n.length % 2) n = '0' + n
    return unprefixedHexToBytes(n)
  }

  if (v.toBytes !== undefined) {
    // converts a `TransformableToBytes` object to a Uint8Array
    return v.toBytes()
  }

  throw EthereumJSErrorWithoutCode('invalid type')
}

/** Interpret bytes as a 256-bit signed integer. */
export const fromSigned = (num: Uint8Array): bigint => {
  return BigInt.asIntN(256, bytesToBigInt(num))
}

/** Encode a 256-bit unsigned integer from a bigint. */
export const toUnsigned = (num: bigint): Uint8Array => {
  return bigIntToBytes(BigInt.asUintN(256, num))
}

/** Add a `0x` prefix when the string is not already hex-prefixed. */
export const addHexPrefix = (str: string): PrefixedHexString => {
  if (typeof str !== 'string') {
    return str
  }

  return isHexString(str) ? str : `0x${str}`
}

/**
 * Truncate a hex string or bytes display for logging.
 *
 * @param maxLength Maximum visible characters excluding the ellipsis (default 50)
 */
export const short = (bytes: Uint8Array | string, maxLength: number = 50): string => {
  const byteStr = bytes instanceof Uint8Array ? bytesToHex(bytes) : bytes
  const len = byteStr.slice(0, 2) === '0x' ? maxLength + 2 : maxLength
  if (byteStr.length <= len) {
    return byteStr
  }
  return byteStr.slice(0, len) + '…'
}

/**
 * Checks provided Uint8Array for leading zeroes and throws if found.
 *
 * Examples:
 *
 * Valid values: 0x1, 0x, 0x01, 0x1234
 * Invalid values: 0x0, 0x00, 0x001, 0x0001
 *
 * Note: This method is useful for validating that RLP encoded integers comply with the rule that all
 * integer values encoded to RLP must be in the most compact form and contain no leading zero bytes
 * @param values An object containing string keys and Uint8Array values
 * @throws if any provided value is found to have leading zero bytes
 */
export const validateNoLeadingZeroes = (values: { [key: string]: Uint8Array | undefined }) => {
  for (const [k, v] of Object.entries(values)) {
    if (v !== undefined && v.length > 0 && v[0] === 0) {
      throw EthereumJSErrorWithoutCode(
        `${k} cannot have leading zeroes, received: ${bytesToHex(v)}`,
      )
    }
  }
}

/**
 * Converts a `bigint` to a `0x` prefixed hex string
 * @param num the bigint to convert
 */
export const bigIntToHex = (num: bigint): PrefixedHexString => {
  return `0x${num.toString(16)}`
}

/**
 * Calculates max bigint from an array of bigints
 * @param args array of bigints
 */
export const bigIntMax = (...args: bigint[]) => args.reduce((m, e) => (e > m ? e : m))

/**
 * Calculates min BigInt from an array of BigInts
 * @param args array of bigints
 */
export const bigIntMin = (...args: bigint[]) => args.reduce((m, e) => (e < m ? e : m))

/**
 * Convert value from bigint to an unpadded Uint8Array
 * (useful for RLP transport)
 * @param value the bigint to convert
 */
export const bigIntToUnpaddedBytes = (value: bigint): Uint8Array => {
  return unpadBytes(bigIntToBytes(value))
}

/** Encode a bigint as a 20-byte address, optionally truncating when not strict. */
/**
 * Encode a bigint as a 20-byte address.
 *
 * @param strict When true, reject values longer than 20 bytes instead of truncating
 * @throws If `strict` is true and the encoded value exceeds 20 bytes
 */
export const bigIntToAddressBytes = (value: bigint, strict: boolean = true): Uint8Array => {
  const addressBytes = bigIntToBytes(value)
  if (strict && addressBytes.length > 20) {
    throw Error(`Invalid address bytes length=${addressBytes.length} strict=${strict}`)
  }

  // When not strict, allow truncation of values larger than 20 bytes
  return setLengthLeft(addressBytes, 20, { allowTruncate: !strict })
}

/**
 * Convert value from number to an unpadded Uint8Array
 * (useful for RLP transport)
 * @param value the bigint to convert
 */
export const intToUnpaddedBytes = (value: number): Uint8Array => {
  return unpadBytes(intToBytes(value))
}

/**
 * Compares two Uint8Arrays and returns a number indicating their order in a sorted array.
 *
 * @param value1 - The first Uint8Array to compare.
 * @param value2 - The second Uint8Array to compare.
 * @returns A positive number if value1 is larger than value2,
 *                   A negative number if value1 is smaller than value2,
 *                   or 0 if value1 and value2 are equal.
 */
export const compareBytes = (value1: Uint8Array, value2: Uint8Array): number => {
  const bigIntValue1 = bytesToBigInt(value1)
  const bigIntValue2 = bytesToBigInt(value2)
  return bigIntValue1 > bigIntValue2 ? 1 : bigIntValue1 < bigIntValue2 ? -1 : 0
}

/**
 * Generates a Uint8Array of random bytes of specified length.
 *
 * @param length - The length of the Uint8Array.
 * @returns A Uint8Array of random bytes of specified length.
 */
export const randomBytes = (length: number): Uint8Array => {
  return randomBytesNoble(length)
}

/**
 * This mirrors the functionality of the `ethereum-cryptography` export except
 * it skips the check to validate that every element of `arrays` is indeed a `uint8Array`
 * Can give small performance gains on large arrays
 * @param arrays an array of Uint8Arrays
 * @returns one Uint8Array with all the elements of the original set
 * works like `Buffer.concat`
 */
export const concatBytes = (...arrays: Uint8Array[]): Uint8Array<ArrayBuffer> => {
  if (arrays.length === 1) return arrays[0] as Uint8Array<ArrayBuffer>
  const length = arrays.reduce((a, arr) => a + arr.length, 0)
  const result = new Uint8Array(length) as Uint8Array<ArrayBuffer>
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const arr = arrays[i]
    result.set(arr, pad)
    pad += arr.length
  }
  return result
}

/**
 * Convert a Uint8Array to a 32-bit integer.
 *
 * @param bytes The input bytes from which to read the integer
 * @param littleEndian True for little-endian, false for big-endian (default)
 * @returns The 32-bit integer
 */
export function bytesToInt32(bytes: Uint8Array, littleEndian: boolean = false): number {
  if (bytes.length < 4) {
    bytes = setLength(bytes, 4, littleEndian, false)
  }
  const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  return dataView.getUint32(0, littleEndian)
}

/**
 * Convert a Uint8Array to a 64-bit bigint.
 *
 * @param bytes The input bytes from which to read the bigint
 * @param littleEndian True for little-endian, false for big-endian (default)
 * @returns The 64-bit bigint
 */
export function bytesToBigInt64(bytes: Uint8Array, littleEndian: boolean = false): bigint {
  if (bytes.length < 8) {
    bytes = setLength(bytes, 8, littleEndian, false)
  }
  const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  return dataView.getBigUint64(0, littleEndian)
}

/**
 * Convert a 32-bit integer to an 8-byte Uint8Array.
 *
 * @param value The 32-bit integer to convert
 * @param littleEndian True for little-endian, false for big-endian (default)
 */
export function int32ToBytes(value: number, littleEndian: boolean = false): Uint8Array {
  const buffer = new ArrayBuffer(4)
  const dataView = new DataView(buffer)
  dataView.setUint32(0, value, littleEndian)
  return new Uint8Array(buffer)
}

/**
 * Convert a 64-bit bigint to an 8-byte Uint8Array.
 *
 * @param value The 64-bit bigint to convert
 * @param littleEndian True for little-endian, false for big-endian (default)
 */
export function bigInt64ToBytes(value: bigint, littleEndian: boolean = false): Uint8Array {
  const buffer = new ArrayBuffer(8)
  const dataView = new DataView(buffer)
  dataView.setBigUint64(0, value, littleEndian)
  return new Uint8Array(buffer)
}

export { utf8ToBytes } from '@noble/hashes/utils.js'

/**
 * Convert a Uint8Array to a UTF-8 string.
 *
 * @param bytes The input bytes to decode
 * @throws If the input is not a Uint8Array
 */
export function bytesToUtf8(bytes: Uint8Array): string {
  if (!(bytes instanceof Uint8Array)) {
    throw new TypeError(`bytesToUtf8 expected Uint8Array, got ${typeof bytes}`)
  }
  return new TextDecoder().decode(bytes)
}

/**
 * Compare two Uint8Arrays for byte-wise equality.
 */
export function equalsBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

/** Parse a hex string (with or without `0x`) into a bigint. */
/** Parse a hex string (with or without `0x`) into a bigint. */
export function hexToBigInt(input: PrefixedHexString): bigint {
  return bytesToBigInt(hexToBytes(isHexString(input) ? input : `0x${input}`))
}

/**
 * Converts a Uint8Array of bytes into an array of bits.
 * @param bytes - The input byte array.
 * @param bitLength - The number of bits to extract from the input bytes.
 * @returns An array of bits (each 0 or 1) corresponding to the input bytes.
 */
export function bytesToBits(bytes: Uint8Array, bitLength?: number): number[] {
  const bits: number[] = []

  for (let i = 0; i < (bitLength ?? bytes.length * 8); i++) {
    const byteIndex = Math.floor(i / 8)
    const bitIndex = 7 - (i % 8)
    bits.push((bytes[byteIndex] >> bitIndex) & 1)
  }

  return bits
}

/**
 * Converts an array of bits into a Uint8Array.
 * The input bits are grouped into sets of 8, with the first bit in each group being the most significant.
 * @param bits - The input array of bits (each should be 0 or 1). Its length should be a multiple of 8.
 * @returns A Uint8Array constructed from the input bits.
 */
export function bitsToBytes(bits: number[]): Uint8Array {
  const numBytes = Math.ceil(bits.length / 8) // Ensure partial byte storage
  const byteData = new Uint8Array(numBytes)

  for (let i = 0; i < bits.length; i++) {
    const byteIndex = Math.floor(i / 8)
    const bitIndex = 7 - (i % 8)
    byteData[byteIndex] |= bits[i] << bitIndex
  }

  return byteData
}

/**
 * Compares two byte arrays and returns the count of consecutively matching items from the start.
 * @param bytes1 - The first Uint8Array to compare.
 * @param bytes2 - The second Uint8Array to compare.
 * @returns The count of consecutively matching items from the start.
 */
export function matchingBytesLength(bytes1: Uint8Array, bytes2: Uint8Array): number {
  let count = 0
  const minLength = Math.min(bytes1.length, bytes2.length)

  for (let i = 0; i < minLength; i++) {
    if (bytes1[i] === bytes2[i]) {
      count++
    } else {
      // Break early if a mismatch is found
      break
    }
  }
  return count
}

/**
 * Compares two arrays of bits (0 or 1) and returns the count of consecutively matching bits from the start.
 * @param bits1 - The first array of bits, in bytes or bits.
 * @param bits2 - The second array of bits, in bytes or bits.
 * @returns The count of consecutively matching bits from the start.
 */
export function matchingBitsLength(bits1: number[], bits2: number[]): number {
  let count = 0
  const minLength = Math.min(bits1.length, bits2.length)
  for (let i = 0; i < minLength; i++) {
    if (bits1[i] === bits2[i]) {
      count++
    } else {
      return count
    }
  }
  return count
}

/**
 * Checks whether two arrays of bits are equal.
 *
 * Two arrays are considered equal if they have the same length and each corresponding element is identical.
 *
 * @param bits1 - The first bits array.
 * @param bits2 - The second bits array.
 * @returns True if the arrays are equal; otherwise, false.
 */
export function equalsBits(bits1: number[], bits2: number[]): boolean {
  if (bits1.length !== bits2.length) {
    return false
  }
  for (let i = 0; i < bits1.length; i++) {
    if (bits1[i] !== bits2[i]) {
      return false
    }
  }
  return true
}
