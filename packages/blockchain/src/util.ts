import BN = require('bn.js')

// Geth compatible DB keys

const headsKey = 'heads'
/**
 * Current canonical head for light sync
 */
const headHeaderKey = 'LastHeader'
/**
 * Current canonical head for full sync
 */
const headBlockKey = 'LastBlock'
/**
 * headerPrefix + number + hash -> header
 */
const headerPrefix = Buffer.from('h')
/**
 * headerPrefix + number + hash + tdSuffix -> td
 */
const tdSuffix = Buffer.from('t')
/**
 * headerPrefix + number + numSuffix -> hash
 */
const numSuffix = Buffer.from('n')
/**
 * blockHashPrefix + hash -> number
 */
const blockHashPrefix = Buffer.from('H')
/**
 * bodyPrefix + number + hash -> block body
 */
const bodyPrefix = Buffer.from('b')

// Utility functions

/**
 * Convert BN to big endian Buffer
 */
const bufBE8 = (n: BN) => n.toArrayLike(Buffer, 'be', 8)
const tdKey = (n: BN, hash: Buffer) => Buffer.concat([headerPrefix, bufBE8(n), hash, tdSuffix])
const headerKey = (n: BN, hash: Buffer) => Buffer.concat([headerPrefix, bufBE8(n), hash])
const bodyKey = (n: BN, hash: Buffer) => Buffer.concat([bodyPrefix, bufBE8(n), hash])
const numberToHashKey = (n: BN) => Buffer.concat([headerPrefix, bufBE8(n), numSuffix])
const hashToNumberKey = (hash: Buffer) => Buffer.concat([blockHashPrefix, hash])

/**
 * @hidden
 */
export {
  headsKey,
  headHeaderKey,
  headBlockKey,
  bufBE8,
  tdKey,
  headerKey,
  bodyKey,
  numberToHashKey,
  hashToNumberKey,
}
