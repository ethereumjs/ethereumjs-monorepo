import BN from 'bn.js'
import { Address } from './address'
import { unpadBuffer } from './bytes'

/*
 * A type that represents a BNLike input that can be converted to a BN.
 */
export type BNLike = BN | PrefixedHexString | number | Buffer

/*
 * A type that represents a BufferLike input that can be converted to a Buffer.
 */
export type BufferLike =
  | Buffer
  | Uint8Array
  | number[]
  | number
  | BN
  | TransformableToBuffer
  | PrefixedHexString

/*
 * A type that represents a `0x`-prefixed hex string.
 */
export type PrefixedHexString = string

/**
 * A type that represents an Address-like value.
 * To convert to address, use `new Address(toBuffer(value))`
 */
export type AddressLike = Address | Buffer | PrefixedHexString

/*
 * A type that represents an object that has a `toArray()` method.
 */
export interface TransformableToArray {
  toArray(): Uint8Array
  toBuffer?(): Buffer
}

/*
 * A type that represents an object that has a `toBuffer()` method.
 */
export interface TransformableToBuffer {
  toBuffer(): Buffer
  toArray?(): Uint8Array
}

/**
 * Convert BN to 0x-prefixed hex string.
 */
export function bnToHex(value: BN): PrefixedHexString {
  return `0x${value.toString(16)}`
}

/**
 * Convert value from BN to RLP (unpadded buffer)
 * @param value value to convert
 */
export function bnToRlp(value: BN): Buffer {
  // Using `bn.toArrayLike(Buffer)` instead of `bn.toBuffer()`
  // for compatibility with browserify and similar tools
  return unpadBuffer(value.toArrayLike(Buffer))
}
