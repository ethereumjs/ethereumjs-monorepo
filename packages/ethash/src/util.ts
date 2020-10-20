import { BN, keccak256 } from 'ethereumjs-util'
const MR = require('miller-rabin')

export const params = {
  DATASET_BYTES_INIT: 1073741824, // 2^30
  DATASET_BYTES_GROWTH: 8388608, // 2 ^ 23
  CACHE_BYTES_INIT: 16777216, // 2**24 number of bytes in dataset at genesis
  CACHE_BYTES_GROWTH: 131072, // 2**17 cache growth per epoch
  CACHE_MULTIPLIER: 1024, // Size of the DAG relative to the cache
  EPOCH_LENGTH: 30000, // blocks per epoch
  MIX_BYTES: 128, // width of mix
  HASH_BYTES: 64, // hash length in bytes
  DATASET_PARENTS: 256, // number of parents of each dataset element
  CACHE_ROUNDS: 3, // number of rounds in cache production
  ACCESSES: 64,
  WORD_BYTES: 4,
}

export function getCacheSize(epoc: number) {
  const mr = new MR()
  let sz =
    (exports.params.CACHE_BYTES_INIT as number) +
    (exports.params.CACHE_BYTES_GROWTH as number) * epoc
  sz -= exports.params.HASH_BYTES
  while (!mr.test(new BN(sz / exports.params.HASH_BYTES))) {
    sz -= 2 * exports.params.HASH_BYTES
  }
  return sz
}

export function getFullSize(epoc: number) {
  const mr = new MR()
  let sz =
    (exports.params.DATASET_BYTES_INIT as number) +
    (exports.params.DATASET_BYTES_GROWTH as number) * epoc
  sz -= exports.params.MIX_BYTES
  while (!mr.test(new BN(sz / exports.params.MIX_BYTES))) {
    sz -= 2 * exports.params.MIX_BYTES
  }
  return sz
}

export function getEpoc(blockNumber: number) {
  return Math.floor(blockNumber / exports.params.EPOCH_LENGTH)
}

/**
 * Generates a seed give the end epoc and optional the begining epoc and the
 * begining epoc seed
 * @method getSeed
 * @param seed Buffer
 * @param begin Number
 * @param end Number
 */
export function getSeed(seed: Buffer, begin: number, end: number) {
  for (let i = begin; i < end; i++) {
    seed = keccak256(seed)
  }
  return seed
}

export function fnv(x: number, y: number) {
  return ((((x * 0x01000000) | 0) + ((x * 0x193) | 0)) ^ y) >>> 0
}

export function fnvBuffer(a: Buffer, b: Buffer) {
  const r = Buffer.alloc(a.length)
  for (let i = 0; i < a.length; i = i + 4) {
    r.writeUInt32LE(fnv(a.readUInt32LE(i), b.readUInt32LE(i)), i)
  }
  return r
}

export function bufReverse(a: Buffer) {
  const length = a.length
  const b = Buffer.alloc(length)
  for (let i = 0; i < length; i++) {
    b[i] = a[length - i - 1]
  }
  return b
}
