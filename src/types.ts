import * as BN from 'bn.js'
import { unpadBuffer } from './bytes'

export type BNLike = BN | string | number

export type BufferLike = Buffer | TransformableToBuffer | PrefixedHexString | number

export type PrefixedHexString = string

export interface TransformableToBuffer {
  toBuffer(): Buffer
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
