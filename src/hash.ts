const createKeccakHash = require('keccak')
const createHash = require('create-hash')
const ethjsUtil = require('ethjs-util')
import * as rlp from 'rlp'
import { toBuffer, setLengthLeft } from './bytes'
import { assertIsString, assertIsBuffer, assertIsArray } from './helpers'

/**
 * Creates Keccak hash of a Buffer input
 * @param a The input data (Buffer)
 * @param bits (number = 256) The Keccak width
 */
export const keccak = function(a: Buffer, bits: number = 256): Buffer {
  assertIsBuffer(a)
  return createKeccakHash(`keccak${bits}`)
    .update(a)
    .digest()
}

/**
 * Creates Keccak-256 hash of the input, alias for keccak(a, 256).
 * @param a The input data (Buffer)
 */
export const keccak256 = function(a: Buffer): Buffer {
  return keccak(a)
}

/**
 * Creates Keccak hash of a String input
 * @param a The input data (String) If string is 0x-prefixed hex value it's
 *          interpreted as hexadecimal, otherwise as utf8.
 * @param bits (number = 256) The Keccak width
 */
export const keccakFromString = function(a: string, bits: number = 256) {
  assertIsString(a)
  let buf
  if (!ethjsUtil.isHexString(a)) {
    buf = Buffer.from(a, 'utf8')
  } else {
    buf = toBuffer(a)
  }

  return keccak(buf, bits)
}

/**
 * Creates Keccak hash of a number array input
 * @param a The input data (number[])
 * @param bits (number = 256) The Keccak width
 */
export const keccakFromArray = function(a: number[], bits: number = 256) {
  assertIsArray(a)
  return keccak(toBuffer(a), bits)
}

/**
 * Creates SHA256 hash of the input.
 * @param a The input data (Buffer|Array|String|Number)
 */
export const sha256 = function(a: any): Buffer {
  a = toBuffer(a)
  return createHash('sha256')
    .update(a)
    .digest()
}

/**
 * Creates RIPEMD160 hash of the input.
 * @param a The input data (Buffer|Array|String|Number)
 * @param padded Whether it should be padded to 256 bits or not
 */
export const ripemd160 = function(a: any, padded: boolean): Buffer {
  a = toBuffer(a)
  const hash = createHash('rmd160')
    .update(a)
    .digest()
  if (padded === true) {
    return setLengthLeft(hash, 32)
  } else {
    return hash
  }
}

/**
 * Creates SHA-3 hash of the RLP encoded version of the input.
 * @param a The input data
 */
export const rlphash = function(a: rlp.Input): Buffer {
  return keccak(rlp.encode(a))
}
