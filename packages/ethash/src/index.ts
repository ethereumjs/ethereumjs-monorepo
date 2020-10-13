import {
  BN,
  keccak,
  keccak256,
  rlphash,
  zeros,
  bufferToInt,
  TWO_POW256
} from 'ethereumjs-util'
import {
  params,
  fnv,
  fnvBuffer,
  bufReverse,
  getEpoc,
  getCacheSize,
  getFullSize,
  getSeed
} from './util'
import type { LevelUp } from 'levelup'
import type { Block, BlockHeader } from '@ethereumjs/block'
const xor = require('buffer-xor')

export default class Ethash {
  dbOpts: Object
  cacheDB?: LevelUp
  cache: Buffer[]
  epoc?: number
  fullSize?: number
  cacheSize?: number
  seed?: Buffer

  constructor(cacheDB?: LevelUp) {
    this.dbOpts = {
      valueEncoding: 'json'
    }
    this.cacheDB = cacheDB
    this.cache = []
  }

  mkcache(cacheSize: number, seed: Buffer) {
    // console.log('generating cache')
    // console.log('size: ' + cacheSize)
    // console.log('seed: ' + seed.toString('hex'))
    const n = Math.floor(cacheSize / params.HASH_BYTES)
    const o = [keccak(seed, 512)]

    let i
    for (i = 1; i < n; i++) {
      o.push(keccak(o[o.length - 1], 512))
    }

    for (let _ = 0; _ < params.CACHE_ROUNDS; _++) {
      for (i = 0; i < n; i++) {
        const v = o[i].readUInt32LE(0) % n
        o[i] = keccak(xor(o[(i - 1 + n) % n], o[v]), 512)
      }
    }

    this.cache = o
    return this.cache
  }

  calcDatasetItem(i: number): Buffer {
    const n = this.cache.length
    const r = Math.floor(params.HASH_BYTES / params.WORD_BYTES)
    let mix = Buffer.from(this.cache[i % n])
    mix.writeInt32LE(mix.readUInt32LE(0) ^ i, 0)
    mix = keccak(mix, 512)
    for (let j = 0; j < params.DATASET_PARENTS; j++) {
      const cacheIndex = fnv(i ^ j, mix.readUInt32LE((j % r) * 4))
      mix = fnvBuffer(mix, this.cache[cacheIndex % n])
    }
    return keccak(mix, 512)
  }

  run(val: Buffer, nonce: Buffer, fullSize?: number) {
    if (!fullSize && this.fullSize) {
      fullSize = this.fullSize
    }
    if (!fullSize) {
      throw new Error('fullSize needed')
    }
    const n = Math.floor(fullSize / params.HASH_BYTES)
    const w = Math.floor(params.MIX_BYTES / params.WORD_BYTES)
    const s = keccak(Buffer.concat([val, bufReverse(nonce)]), 512)
    const mixhashes = Math.floor(params.MIX_BYTES / params.HASH_BYTES)
    let mix = Buffer.concat(Array(mixhashes).fill(s))

    let i
    for (i = 0; i < params.ACCESSES; i++) {
      const p =
        (fnv(i ^ s.readUInt32LE(0), mix.readUInt32LE((i % w) * 4)) %
          Math.floor(n / mixhashes)) *
        mixhashes
      let newdata = []
      for (let j = 0; j < mixhashes; j++) {
        newdata.push(this.calcDatasetItem(p + j))
      }
      mix = fnvBuffer(mix, Buffer.concat(newdata))
    }

    const cmix = Buffer.alloc(mix.length / 4)
    for (i = 0; i < mix.length / 4; i = i + 4) {
      const a = fnv(mix.readUInt32LE(i * 4), mix.readUInt32LE((i + 1) * 4))
      const b = fnv(a, mix.readUInt32LE((i + 2) * 4))
      const c = fnv(b, mix.readUInt32LE((i + 3) * 4))
      cmix.writeUInt32LE(c, i)
    }

    return {
      mix: cmix,
      hash: keccak256(Buffer.concat([s, cmix]))
    }
  }

  cacheHash() {
    return keccak256(Buffer.concat(this.cache))
  }

  headerHash(rawHeader: Buffer[]) {
    return rlphash(rawHeader.slice(0, -2))
  }

  /**
   * Loads the seed and cache given a block number.
   */
  async loadEpoc(number: number) {
    const epoc = getEpoc(number)

    if (this.epoc === epoc) {
      return
    }

    this.epoc = epoc

    if (!this.cacheDB) {
      throw new Error('cacheDB needed')
    }

    // gives the seed the first epoc found
    const findLastSeed = async (epoc: number): Promise<[Buffer, number]> => {
      if (epoc === 0) {
        return [zeros(32), 0]
      }
      let data
      try {
        data = await this.cacheDB!.get(epoc, this.dbOpts)
      } catch (error) {
        if (error.type !== 'NotFoundError') {
          throw error
        }
      }
      if (data) {
        return [data.seed, epoc]
      } else {
        return findLastSeed(epoc - 1)
      }
    }

    let data
    try {
      data = await this.cacheDB!.get(epoc, this.dbOpts)
    } catch (error) {
      if (error.type !== 'NotFoundError') {
        throw error
      }
    }

    if (!data) {
      this.cacheSize = getCacheSize(epoc)
      this.fullSize = getFullSize(epoc)

      const [seed, foundEpoc] = await findLastSeed(epoc)
      this.seed = getSeed(seed, foundEpoc, epoc)
      const cache = this.mkcache(this.cacheSize!, this.seed!)
      // store the generated cache
      await this.cacheDB!.put(
        epoc,
        {
          cacheSize: this.cacheSize,
          fullSize: this.fullSize,
          seed: this.seed,
          cache: cache
        },
        this.dbOpts
      )
    } else {
      // Object.assign(this, data)
      this.cache = data.cache.map((a: Buffer) => {
        return Buffer.from(a)
      })
      this.cacheSize = data.cacheSize
      this.fullSize = data.fullSize
      this.seed = Buffer.from(data.seed)
    }
  }

  async _verifyPOW(header: BlockHeader) {
    const headerHash = this.headerHash(header.raw())
    const { number, difficulty, mixHash, nonce } = header

    await this.loadEpoc(number.toNumber())
    const a = this.run(headerHash, nonce)
    const result = new BN(a.hash)

    return a.mix.equals(mixHash) && TWO_POW256.div(difficulty).cmp(result) === 1
  }

  async verifyPOW(block: Block) {
    // don't validate genesis blocks
    if (block.header.isGenesis()) {
      return true
    }

    const valid = await this._verifyPOW(block.header)
    if (!valid) {
      return false
    }

    for (let index = 0; index < block.uncleHeaders.length; index++) {
      const valid = await this._verifyPOW(block.uncleHeaders[index])
      if (!valid) {
        return false
      }
    }

    return true
  }
}
