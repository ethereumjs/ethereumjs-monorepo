const createKeccakHash = require('keccak')
const createHash = require('create-hash')
import rlp = require('rlp')
import { toBuffer, setLength } from './buffer'

/**
 * Creates Keccak hash of the input
 * @param a The input data (Buffer|Array|String|Number)
 * @param bits The Keccak width
 */
export const keccak = function(a: any, bits: number = 256): Buffer {
  a = toBuffer(a)
  if (!bits) bits = 256

  return createKeccakHash(`keccak${bits}`)
    .update(a)
    .digest()
}

/**
 * Creates Keccak-256 hash of the input, alias for keccak(a, 256).
 * @param a The input data (Buffer|Array|String|Number)
 */
export const keccak256 = function(a: any): Buffer {
  return keccak(a)
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
    return setLength(hash, 32)
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
