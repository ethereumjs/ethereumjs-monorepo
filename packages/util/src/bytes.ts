import { getRandomBytesSync } from 'ethereum-cryptography/random.js'
// eslint-disable-next-line no-restricted-imports
import {
  bytesToHex as _bytesToUnprefixedHex,
  hexToBytes as _unprefixedHexToBytes,
} from 'ethereum-cryptography/utils.js'

import { assertIsArray, assertIsBytes, assertIsHexString } from './helpers.js'
import { isHexPrefixed, isHexString, padToEven, stripHexPrefix } from './internal.js'

import type { PrefixedHexString, TransformabletoBytes } from './types.js'

/**
 * @deprecated
 */
export const bytesToUnprefixedHex = _bytesToUnprefixedHex

/**
 * @deprecated
 */
export const unprefixedHexToBytes = (inp: string) => {
  if (inp.slice(0, 2) === '0x') {
    throw new Error('hex string is prefixed with 0x, should be unprefixed')
  } else {
    return _unprefixedHexToBytes(padToEven(inp))
  }
}

/****************  Borrowed from @chainsafe/ssz */
// Caching this info costs about ~1000 bytes and speeds up toHexString() by x6
const hexByByte = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, '0'))

export const bytesToHex = (bytes: Uint8Array): string => {
  let hex = '0x'
  if (bytes === undefined || bytes.length === 0) return hex
  for (const byte of bytes) {
    hex += hexByByte[byte]
  }
  return hex
}

/**
 * Converts a {@link Uint8Array} to a {@link bigint}
 * @param {Uint8Array} bytes the bytes to convert
 * @returns {bigint}
 */
export const bytesToBigInt = (bytes: Uint8Array): bigint => {
  const hex = bytesToHex(bytes)
  if (hex === '0x') {
    return BigInt(0)
  }
  return BigInt(hex)
}

/**
 * Converts a {@link Uint8Array} to a {@link number}.
 * @param {Uint8Array} bytes the bytes to convert
 * @return  {number}
 * @throws If the input number exceeds 53 bits.
 */
export const bytesToInt = (bytes: Uint8Array): number => {
  const res = Number(bytesToBigInt(bytes))
  if (!Number.isSafeInteger(res)) throw new Error('Number exceeds 53 bits')
  return res
}

export const hexToBytes = (hex: string): Uint8Array => {
  if (typeof hex !== 'string') {
    throw new Error(`hex argument type ${typeof hex} must be of type string`)
  }

  if (!hex.startsWith('0x')) {
    throw new Error(`prefixed hex input should start with 0x, got ${hex.substring(0, 2)}`)
  }

  hex = hex.slice(2)

  if (hex.length % 2 !== 0) {
    hex = padToEven(hex)
  }

  const byteLen = hex.length / 2
  const bytes = new Uint8Array(byteLen)
  for (let i = 0; i < byteLen; i++) {
    const byte = parseInt(hex.slice(i * 2, (i + 1) * 2), 16)
    bytes[i] = byte
  }
  return bytes
}

/******************************************/

/**
 * Converts a {@link number} into a {@link PrefixedHexString}
 * @param {number} i
 * @return {PrefixedHexString}
 */
export const intToHex = (i: number): PrefixedHexString => {
  if (!Number.isSafeInteger(i) || i < 0) {
    throw new Error(`Received an invalid integer type: ${i}`)
  }
  return `0x${i.toString(16)}`
}

/**
 * Converts an {@link number} to a {@link Uint8Array}
 * @param {Number} i
 * @return {Uint8Array}
 */
export const intToBytes = (i: number): Uint8Array => {
  const hex = intToHex(i)
  return hexToBytes(hex)
}

/**
 * Converts a {@link bigint} to a {@link Uint8Array}
 *  * @param {bigint} num the bigint to convert
 * @returns {Uint8Array}
 */
export const bigIntToBytes = (num: bigint): Uint8Array => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return toBytes('0x' + padToEven(num.toString(16)))
}

/**
 * Returns a Uint8Array filled with 0s.
 * @param {number} bytes the number of bytes of the Uint8Array
 * @return {Uint8Array}
 */
export const zeros = (bytes: number): Uint8Array => {
  return new Uint8Array(bytes)
}

/**
 * Pads a `Uint8Array` with zeros till it has `length` bytes.
 * Truncates the beginning or end of input if its length exceeds `length`.
 * @param {Uint8Array} msg the value to pad
 * @param {number} length the number of bytes the output should be
 * @param {boolean} right whether to start padding form the left or right
 * @return {Uint8Array}
 */
const setLength = (msg: Uint8Array, length: number, right: boolean): Uint8Array => {
  if (right) {
    if (msg.length < length) {
      return new Uint8Array([...msg, ...zeros(length - msg.length)])
    }
    return msg.subarray(0, length)
  } else {
    if (msg.length < length) {
      return new Uint8Array([...zeros(length - msg.length), ...msg])
    }
    return msg.subarray(-length)
  }
}

/**
 * Left Pads a `Uint8Array` with leading zeros till it has `length` bytes.
 * Or it truncates the beginning if it exceeds.
 * @param {Uint8Array} msg the value to pad
 * @param {number} length the number of bytes the output should be
 * @return {Uint8Array}
 */
export const setLengthLeft = (msg: Uint8Array, length: number): Uint8Array => {
  assertIsBytes(msg)
  return setLength(msg, length, false)
}

/**
 * Right Pads a `Uint8Array` with trailing zeros till it has `length` bytes.
 * it truncates the end if it exceeds.
 * @param {Uint8Array} msg the value to pad
 * @param {number} length the number of bytes the output should be
 * @return {Uint8Array}
 */
export const setLengthRight = (msg: Uint8Array, length: number): Uint8Array => {
  assertIsBytes(msg)
  return setLength(msg, length, true)
}

/**
 * Trims leading zeros from a `Uint8Array`, `number[]` or PrefixedHexString`.
 * @param {Uint8Array|number[]|PrefixedHexString} a
 * @return {Uint8Array|number[]|PrefixedHexString}
 */
const stripZeros = <
  T extends Uint8Array | number[] | PrefixedHexString = Uint8Array | number[] | PrefixedHexString
>(
  a: T
): T => {
  let first = a[0]
  while (a.length > 0 && first.toString() === '0') {
    a = a.slice(1) as T
    first = a[0]
  }
  return a
}

/**
 * Trims leading zeros from a `Uint8Array`.
 * @param {Uint8Array} a
 * @return {Uint8Array}
 */
export const unpadBytes = (a: Uint8Array): Uint8Array => {
  assertIsBytes(a)
  return stripZeros(a)
}

/**
 * Trims leading zeros from an `Array` (of numbers).
 * @param  {number[]} a
 * @return {number[]}
 */
export const unpadArray = (a: number[]): number[] => {
  assertIsArray(a)
  return stripZeros(a)
}

/**
 * Trims leading zeros from a `PrefixedHexString`.
 * @param {PrefixedHexString} a
 * @return {PrefixedHexString}
 */
export const unpadHex = (a: string): PrefixedHexString => {
  assertIsHexString(a)
  a = stripHexPrefix(a)
  return '0x' + stripZeros(a)
}

export type ToBytesInputTypes =
  | PrefixedHexString
  | number
  | bigint
  | Uint8Array
  | number[]
  | TransformabletoBytes
  | null
  | undefined

/**
 * Attempts to turn a value into a `Uint8Array`.
 * Inputs supported: `Buffer`, `Uint8Array`, `String` (hex-prefixed), `Number`, null/undefined, `BigInt` and other objects
 * with a `toArray()` or `toBytes()` method.
 * @param {ToBytesInputTypes} v the value
 * @return {Uint8Array}
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
      throw new Error(
        `Cannot convert string to Uint8Array. toBytes only supports 0x-prefixed hex strings and this string was given: ${v}`
      )
    }
    return hexToBytes(v)
  }

  if (typeof v === 'number') {
    return intToBytes(v)
  }

  if (typeof v === 'bigint') {
    if (v < BigInt(0)) {
      throw new Error(`Cannot convert negative bigint to Uint8Array. Given: ${v}`)
    }
    let n = v.toString(16)
    if (n.length % 2) n = '0' + n
    return unprefixedHexToBytes(n)
  }

  if (v.toBytes !== undefined) {
    // converts a `TransformableToBytes` object to a Uint8Array
    return v.toBytes()
  }

  throw new Error('invalid type')
}

/**
 * Interprets a `Uint8Array` as a signed integer and returns a `BigInt`. Assumes 256-bit numbers.
 * @param {Uint8Array} num Signed integer value
 * @returns {bigint}
 */
export const fromSigned = (num: Uint8Array): bigint => {
  return BigInt.asIntN(256, bytesToBigInt(num))
}

/**
 * Converts a `BigInt` to an unsigned integer and returns it as a `Uint8Array`. Assumes 256-bit numbers.
 * @param {bigint} num
 * @returns {Uint8Array}
 */
export const toUnsigned = (num: bigint): Uint8Array => {
  return bigIntToBytes(BigInt.asUintN(256, num))
}

/**
 * Adds "0x" to a given `string` if it does not already start with "0x".
 * @param {string} str
 * @return {PrefixedHexString}
 */
export const addHexPrefix = (str: string): PrefixedHexString => {
  if (typeof str !== 'string') {
    return str
  }

  return isHexPrefixed(str) ? str : '0x' + str
}

/**
 * Shortens a string  or Uint8Array's hex string representation to maxLength (default 50).
 *
 * Examples:
 *
 * Input:  '657468657265756d000000000000000000000000000000000000000000000000'
 * Output: '657468657265756d0000000000000000000000000000000000…'
 * @param {Uint8Array | string} bytes
 * @param {number} maxLength
 * @return {string}
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
      throw new Error(`${k} cannot have leading zeroes, received: ${bytesToHex(v)}`)
    }
  }
}

/**
 * Converts a {@link bigint} to a `0x` prefixed hex string
 * @param {bigint} num the bigint to convert
 * @returns {PrefixedHexString}
 */
export const bigIntToHex = (num: bigint): PrefixedHexString => {
  return '0x' + num.toString(16)
}

/**
 * Convert value from bigint to an unpadded Uint8Array
 * (useful for RLP transport)
 * @param {bigint} value the bigint to convert
 * @returns {Uint8Array}
 */
export const bigIntToUnpaddedBytes = (value: bigint): Uint8Array => {
  return unpadBytes(bigIntToBytes(value))
}

/**
 * Convert value from number to an unpadded Uint8Array
 * (useful for RLP transport)
 * @param {number} value the bigint to convert
 * @returns {Uint8Array}
 */
export const intToUnpaddedBytes = (value: number): Uint8Array => {
  return unpadBytes(intToBytes(value))
}

/**
 * Compares two Uint8Arrays and returns a number indicating their order in a sorted array.
 *
 * @param {Uint8Array} value1 - The first Uint8Array to compare.
 * @param {Uint8Array} value2 - The second Uint8Array to compare.
 * @returns {number} A positive number if value1 is larger than value2,
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
 * @param {number} length - The length of the Uint8Array.
 * @returns {Uint8Array} A Uint8Array of random bytes of specified length.
 */
export const randomBytes = (length: number): Uint8Array => {
  return getRandomBytesSync(length)
}

/**
 * This mirrors the functionality of the `ethereum-cryptography` export except
 * it skips the check to validate that every element of `arrays` is indead a `uint8Array`
 * Can give small performance gains on large arrays
 * @param {Uint8Array[]} arrays an array of Uint8Arrays
 * @returns {Uint8Array} one Uint8Array with all the elements of the original set
 * works like `Buffer.concat`
 */
export const concatBytes = (...arrays: Uint8Array[]): Uint8Array => {
  if (arrays.length === 1) return arrays[0]
  const length = arrays.reduce((a, arr) => a + arr.length, 0)
  const result = new Uint8Array(length)
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const arr = arrays[i]
    result.set(arr, pad)
    pad += arr.length
  }
  return result
}

// eslint-disable-next-line no-restricted-imports
export { bytesToUtf8, equalsBytes, utf8ToBytes } from 'ethereum-cryptography/utils.js'
