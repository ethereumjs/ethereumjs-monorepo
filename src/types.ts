import * as BN from 'bn.js'

export type BNLike = BN | string | number

export type BufferLike = Buffer | TransformableToBuffer | PrefixedHexString | number

export type PrefixedHexString = string

export interface TransformableToBuffer {
    toBuffer(): Buffer
}