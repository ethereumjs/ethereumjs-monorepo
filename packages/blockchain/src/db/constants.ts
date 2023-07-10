import { bigIntToBytes, concatBytes, utf8ToBytes } from '@ethereumjs/util'

// Geth compatible DB keys

const HEADS_KEY = 'heads'

/**
 * Current canonical head for light sync
 */
const HEAD_HEADER_KEY = 'LastHeader'

/**
 * Current canonical head for full sync
 */
const HEAD_BLOCK_KEY = 'LastBlock'

/**
 * headerPrefix + number + hash -> header
 */
const HEADER_PREFIX = utf8ToBytes('h')

/**
 * headerPrefix + number + hash + tdSuffix -> td
 */
const TD_SUFFIX = utf8ToBytes('t')

/**
 * headerPrefix + number + numSuffix -> hash
 */
const NUM_SUFFIX = utf8ToBytes('n')

/**
 * blockHashPrefix + hash -> number
 */
const BLOCK_HASH_PEFIX = utf8ToBytes('H')

/**
 * bodyPrefix + number + hash -> block body
 */
const BODY_PREFIX = utf8ToBytes('b')

// Utility functions

/**
 * Convert bigint to big endian Uint8Array
 */
const bytesBE8 = (n: bigint) => bigIntToBytes(BigInt.asUintN(64, n))

const tdKey = (n: bigint, hash: Uint8Array) =>
  concatBytes(HEADER_PREFIX, bytesBE8(n), hash, TD_SUFFIX)

const headerKey = (n: bigint, hash: Uint8Array) => concatBytes(HEADER_PREFIX, bytesBE8(n), hash)

const bodyKey = (n: bigint, hash: Uint8Array) => concatBytes(BODY_PREFIX, bytesBE8(n), hash)

const numberToHashKey = (n: bigint) => concatBytes(HEADER_PREFIX, bytesBE8(n), NUM_SUFFIX)

const hashToNumberKey = (hash: Uint8Array) => concatBytes(BLOCK_HASH_PEFIX, hash)

/**
 * @hidden
 */
export {
  bodyKey,
  bytesBE8,
  hashToNumberKey,
  HEAD_BLOCK_KEY,
  HEAD_HEADER_KEY,
  headerKey,
  HEADS_KEY,
  numberToHashKey,
  tdKey,
}
