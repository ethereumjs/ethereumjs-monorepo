import { hexToBytes } from 'ethereum-cryptography/utils'

import { assertIsArray, assertIsBytes, assertIsHexString } from './helpers'
import { isHexPrefixed, isHexString, padToEven, stripHexPrefix } from './internal'

import type {
  NestedBufferArray,
  NestedUint8Array,
  PrefixedHexString,
  TransformableToArray,
  TransformabletoBuffer,
} from './types'

/****************  Borrowed from @chainsafe/ssz */
// Caching this info costs about ~1000 bytes and speeds up toHexString() by x6
const hexByByte = new Array<string>(256)

export const bytesToPrefixedHexString = (bytes: Uint8Array): string => {
  let hex = '0x'
  for (const byte of bytes) {
    if (!hexByByte[byte]) {
      hexByByte[byte] = byte < 16 ? '0' + byte.toString(16) : byte.toString(16)
    }
    hex += hexByByte[byte]
  }
  return hex
}

export const hexStringToBytes = (hex: string): Uint8Array => {
  if (typeof hex !== 'string') {
    throw new Error(`hex argument type ${typeof hex} must be of type string`)
  }

  if (hex.startsWith('0x')) {
    hex = hex.slice(2)
  }

  if (hex.length % 2 !== 0) {
    throw new Error(`hex string length ${hex.length} must be multiple of 2`)
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
 * Converts a `Number` into a hex `String`
 * @param {Number} i
 * @return {String}
 */
export const intToHex = function (i: number) {
  if (!Number.isSafeInteger(i) || i < 0) {
    throw new Error(`Received an invalid integer type: ${i}`)
  }
  return `0x${i.toString(16)}`
}

/**
 * Converts an `Number` to a `Buffer`
 * @param {Number} i
 * @return {Buffer}
 */
export const intToBytes = function (i: number) {
  const hex = intToHex(i)
  return hexToBytes(padToEven(hex.slice(2)))
}

/**
 * Returns a buffer filled with 0s.
 * @param bytes the number of bytes the buffer should be
 */
export const zeros = function (bytes: number): Buffer {
  return Buffer.allocUnsafe(bytes).fill(0)
}

/**
 * Pads a `Buffer` with zeros till it has `length` bytes.
 * Truncates the beginning or end of input if its length exceeds `length`.
 * @param msg the value to pad (Buffer)
 * @param length the number of bytes the output should be
 * @param right whether to start padding form the left or right
 * @return (Buffer)
 */
const setLength = function (msg: Buffer, length: number, right: boolean) {
  const buf = zeros(length)
  if (right) {
    if (msg.length < length) {
      msg.copy(buf)
      return buf
    }
    return msg.slice(0, length)
  } else {
    if (msg.length < length) {
      msg.copy(buf, length - msg.length)
      return buf
    }
    return msg.slice(-length)
  }
}

/**
 * Left Pads a `Buffer` with leading zeros till it has `length` bytes.
 * Or it truncates the beginning if it exceeds.
 * @param msg the value to pad (Buffer)
 * @param length the number of bytes the output should be
 * @return (Buffer)
 */
export const setLengthLeft = function (msg: Buffer, length: number) {
  assertIsBytes(msg)
  return setLength(msg, length, false)
}

/**
 * Right Pads a `Buffer` with trailing zeros till it has `length` bytes.
 * it truncates the end if it exceeds.
 * @param msg the value to pad (Buffer)
 * @param length the number of bytes the output should be
 * @return (Buffer)
 */
export const setLengthRight = function (msg: Buffer, length: number) {
  assertIsBytes(msg)
  return setLength(msg, length, true)
}

/**
 * Trims leading zeros from a `Uint8Array`, `String` or `Number[]`.
 * @param a (Buffer|Array|String)
 * @return (Buffer|Array|String)
 */
const stripZeros = function (a: any): Uint8Array | number[] | string {
  let first = a[0]
  while (a.length > 0 && first.toString() === '0') {
    a = a.slice(1)
    first = a[0]
  }
  return a
}

/**
 * Trims leading zeros from a `Buffer`.
 * @param a (Buffer)
 * @return (Buffer)
 */
export const unpadBytes = function (a: Uint8Array): Uint8Array {
  assertIsBytes(a)
  return stripZeros(a) as Uint8Array
}

/**
 * Trims leading zeros from an `Array` (of numbers).
 * @param a (number[])
 * @return (number[])
 */
export const unpadArray = function (a: number[]): number[] {
  assertIsArray(a)
  return stripZeros(a) as number[]
}

/**
 * Trims leading zeros from a hex-prefixed `String`.
 * @param a (String)
 * @return (String)
 */
export const unpadHexString = function (a: string): string {
  assertIsHexString(a)
  a = stripHexPrefix(a)
  return ('0x' + stripZeros(a)) as string
}

export type ToBytesInputTypes =
  | PrefixedHexString
  | number
  | bigint
  | Buffer
  | Uint8Array
  | number[]
  | TransformableToArray
  | TransformabletoBuffer
  | null
  | undefined

/**
 * Attempts to turn a value into a `Buffer`.
 * Inputs supported: `Buffer`, `Uint8Array`, `String` (hex-prefixed), `Number`, null/undefined, `BigInt` and other objects
 * with a `toArray()` or `toBytes()` method.
 * @param v the value
 */

export const toBytes = function (v: ToBytesInputTypes): Uint8Array {
  if (v === null || v === undefined) {
    return new Uint8Array()
  }

  if (Buffer.isBuffer(v)) {
    return Uint8Array.from(v)
  }

  if (Array.isArray(v) || v instanceof Uint8Array) {
    return Uint8Array.from(v)
  }

  if (typeof v === 'string') {
    if (!isHexString(v)) {
      throw new Error(
        `Cannot convert string to buffer. toBytes only supports 0x-prefixed hex strings and this string was given: ${v}`
      )
    }
    return hexStringToBytes(v)
  }

  if (typeof v === 'number') {
    return intToBytes(v)
  }

  if (typeof v === 'bigint') {
    if (v < BigInt(0)) {
      throw new Error(`Cannot convert negative bigint to buffer. Given: ${v}`)
    }
    let n = v.toString(16)
    if (n.length % 2) n = '0' + n
    return Buffer.from(n, 'hex')
  }

  if (v.toArray !== undefined) {
    // converts a BN to a Uint8Array
    return v.toArray()
  }

  if (v.toBuffer !== undefined) {
    return Uint8Array.from(v.toBuffer())
  }

  throw new Error('invalid type')
}

/**
 * Converts a {@link Uint8Array} to a {@link bigint}
 */
export function bytesToBigInt(bytes: Uint8Array) {
  const hex = bytesToPrefixedHexString(bytes)
  if (hex === '0x') {
    return BigInt(0)
  }
  return BigInt(hex)
}

/**
 * Converts a {@link bigint} to a {@link Uint8Array}
 */
export const bigIntToBytes = (num: bigint) => {
  return toBytes('0x' + padToEven(num.toString(16)))
}

/**
 * Converts a `Uint8Array` to a `Number`.
 * @param bytes `Uint8Array` object to convert
 * @throws If the input number exceeds 53 bits.
 */
export const bytesToInt = function (bytes: Uint8Array): number {
  const res = Number(bytesToBigInt(bytes))
  if (!Number.isSafeInteger(res)) throw new Error('Number exceeds 53 bits')
  return res
}

/**
 * Interprets a `Uint8Array` as a signed integer and returns a `BigInt`. Assumes 256-bit numbers.
 * @param num Signed integer value
 */
export const fromSigned = function (num: Uint8Array): bigint {
  return BigInt.asIntN(256, bytesToBigInt(num))
}

/**
 * Converts a `BigInt` to an unsigned integer and returns it as a `Uint8Array`. Assumes 256-bit numbers.
 * @param num
 */
export const toUnsigned = function (num: bigint): Uint8Array {
  return bigIntToBytes(BigInt.asUintN(256, num))
}

/**
 * Adds "0x" to a given `String` if it does not already start with "0x".
 */
export const addHexPrefix = function (str: string): string {
  if (typeof str !== 'string') {
    return str
  }

  return isHexPrefixed(str) ? str : '0x' + str
}

/**
 * Shortens a string  or buffer's hex string representation to maxLength (default 50).
 *
 * Examples:
 *
 * Input:  '657468657265756d000000000000000000000000000000000000000000000000'
 * Output: '657468657265756d0000000000000000000000000000000000…'
 */
export function short(buffer: Buffer | string, maxLength: number = 50): string {
  const bufferStr = Buffer.isBuffer(buffer) ? buffer.toString('hex') : buffer
  if (bufferStr.length <= maxLength) {
    return bufferStr
  }
  return bufferStr.slice(0, maxLength) + '…'
}

/**
 * Returns the utf8 string representation from a hex string.
 *
 * Examples:
 *
 * Input 1: '657468657265756d000000000000000000000000000000000000000000000000'
 * Input 2: '657468657265756d'
 * Input 3: '000000000000000000000000000000000000000000000000657468657265756d'
 *
 * Output (all 3 input variants): 'ethereum'
 *
 * Note that this method is not intended to be used with hex strings
 * representing quantities in both big endian or little endian notation.
 *
 * @param string Hex string, should be `0x` prefixed
 * @return Utf8 string
 */
export const toUtf8 = function (hex: string): string {
  const zerosRegexp = /^(00)+|(00)+$/g
  hex = stripHexPrefix(hex)
  if (hex.length % 2 !== 0) {
    throw new Error('Invalid non-even hex string input for toUtf8() provided')
  }
  const bufferVal = Buffer.from(hex.replace(zerosRegexp, ''), 'hex')

  return bufferVal.toString('utf8')
}

/**
 * Converts a `Buffer` or `Array` to JSON.
 * @param ba (Buffer|Array)
 * @return (Array|String|null)
 */
export const baToJSON = function (ba: any): any {
  if (Buffer.isBuffer(ba)) {
    return `0x${ba.toString('hex')}`
  } else if (ba instanceof Array) {
    const array = []
    for (let i = 0; i < ba.length; i++) {
      array.push(baToJSON(ba[i]))
    }
    return array
  }
}

/**
 * Checks provided Buffers for leading zeroes and throws if found.
 *
 * Examples:
 *
 * Valid values: 0x1, 0x, 0x01, 0x1234
 * Invalid values: 0x0, 0x00, 0x001, 0x0001
 *
 * Note: This method is useful for validating that RLP encoded integers comply with the rule that all
 * integer values encoded to RLP must be in the most compact form and contain no leading zero bytes
 * @param values An object containing string keys and Buffer values
 * @throws if any provided value is found to have leading zero bytes
 */
export const validateNoLeadingZeroes = function (values: { [key: string]: Buffer | undefined }) {
  for (const [k, v] of Object.entries(values)) {
    if (v !== undefined && v.length > 0 && v[0] === 0) {
      throw new Error(`${k} cannot have leading zeroes, received: ${v.toString('hex')}`)
    }
  }
}

/**
 * Converts a {@link Buffer} or {@link NestedBufferArray} to {@link Uint8Array} or {@link NestedUint8Array}
 */
export function bufArrToArr(arr: Buffer): Uint8Array
export function bufArrToArr(arr: NestedBufferArray): NestedUint8Array
export function bufArrToArr(arr: Buffer | NestedBufferArray): Uint8Array | NestedUint8Array
export function bufArrToArr(arr: Buffer | NestedBufferArray): Uint8Array | NestedUint8Array {
  if (!Array.isArray(arr)) {
    return Uint8Array.from(arr ?? [])
  }
  return arr.map((a) => bufArrToArr(a))
}

/**
 * Converts a {@link bigint} to a `0x` prefixed hex string
 */
export const bigIntToHex = (num: bigint) => {
  return '0x' + num.toString(16)
}

/**
 * Convert value from bigint to an unpadded Uint8Array
 * (useful for RLP transport)
 * @param value value to convert
 */
export function bigIntToUnpaddedBytes(value: bigint): Uint8Array {
  return unpadBytes(bigIntToBytes(value))
}

export function intToUnpaddedBytes(value: number): Uint8Array {
  return unpadBytes(intToBytes(value))
}
