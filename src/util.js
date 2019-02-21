// geth compatible db keys
const headsKey = 'heads'
const headHeaderKey = 'LastHeader' // current canonical head for light sync
const headBlockKey = 'LastBlock' // current canonical head for full sync
const headerPrefix = Buffer.from('h') // headerPrefix + number + hash -> header
const tdSuffix = Buffer.from('t') // headerPrefix + number + hash + tdSuffix -> td
const numSuffix = Buffer.from('n') // headerPrefix + number + numSuffix -> hash
const blockHashPrefix = Buffer.from('H') // blockHashPrefix + hash -> number
const bodyPrefix = Buffer.from('b') // bodyPrefix + number + hash -> block body

// utility functions
const bufBE8 = n => n.toArrayLike(Buffer, 'be', 8) // convert BN to big endian Buffer
const tdKey = (n, hash) => Buffer.concat([headerPrefix, bufBE8(n), hash, tdSuffix])
const headerKey = (n, hash) => Buffer.concat([headerPrefix, bufBE8(n), hash])
const bodyKey = (n, hash) => Buffer.concat([bodyPrefix, bufBE8(n), hash])
const numberToHashKey = n => Buffer.concat([headerPrefix, bufBE8(n), numSuffix])
const hashToNumberKey = hash => Buffer.concat([blockHashPrefix, hash])

module.exports = {
  headsKey,
  headHeaderKey,
  headBlockKey,
  bufBE8,
  tdKey,
  headerKey,
  bodyKey,
  numberToHashKey,
  hashToNumberKey
}
