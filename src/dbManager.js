const BN = require('bn.js')
const level = require('level-mem')
const rlp = require('rlp')
const Block = require('ethereumjs-block')
const Cache = require('./cache')
const {
  headsKey,
  headHeaderKey,
  headBlockKey,
  hashToNumberKey,
  numberToHashKey,
  tdKey,
  bodyKey,
  headerKey
} = require('./util')

/**
 * Abstraction over db to facilitate storing/fetching blockchain-related
 * data, such as blocks and headers, indices, and the head block.
 */
module.exports = class DBManager {
  constructor (db, common) {
    this._db = db
    this._common = common
    this._cache = {
      td: new Cache({ max: 1024 }),
      header: new Cache({ max: 512 }),
      body: new Cache({ max: 256 }),
      numberToHash: new Cache({ max: 2048 }),
      hashToNumber: new Cache({ max: 2048 })
    }
  }

  /**
   * Fetches iterator heads from the db.
   * @returns Promise
   */
  getHeads () {
    return this.get(headsKey, { valueEncoding: 'json' })
  }

  /**
   * Fetches header of the head block.
   * @returns Promise
   */
  getHeadHeader () {
    return this.get(headHeaderKey)
  }

  /**
   * Fetches head block.
   * @returns Promise
   */
  getHeadBlock () {
    return this.get(headBlockKey)
  }

  /**
   * Fetches a block (header and body), given a block tag
   * which can be either its hash or its number.
   * @param {Buffer|BN|number} blockTag - Hash or number of the block
   * @returns Promise
   */
  async getBlock (blockTag) {
    // determine BlockTag type
    if (Number.isInteger(blockTag)) {
      blockTag = new BN(blockTag)
    }

    let number
    let hash
    if (Buffer.isBuffer(blockTag)) {
      hash = blockTag
      number = await this.hashToNumber(blockTag)
    } else if (BN.isBN(blockTag)) {
      number = blockTag
      hash = await this.numberToHash(blockTag)
    } else {
      throw new Error('Unknown blockTag type')
    }

    const header = (await this.getHeader(hash, number)).raw
    let body
    try {
      body = await this.getBody(hash, number)
    } catch (e) {
      body = [[], []]
    }

    return new Block([header].concat(body), {common: this._common})
  }

  /**
   * Fetches body of a block given its hash and number.
   * @param {Buffer} hash
   * @param {BN} number
   * @returns Promise
   */
  async getBody (hash, number) {
    const key = bodyKey(number, hash)
    return rlp.decode(await this.get(key, { cache: 'body' }))
  }

  /**
   * Fetches header of a block given its hash and number.
   * @param {Buffer} hash
   * @param {BN} number
   * @returns Promise
   */
  async getHeader (hash, number) {
    const key = headerKey(number, hash)
    let encodedHeader = await this.get(key, { cache: 'header' })
    return new Block.Header(rlp.decode(encodedHeader), { common: this._common })
  }

  /**
   * Fetches total difficulty for a block given its hash and number.
   * @param {Buffer} hash
   * @param {BN} number
   * @returns Promise
   */
  async getTd (hash, number) {
    const key = tdKey(number, hash)
    const td = await this.get(key, { cache: 'td' })
    return new BN(rlp.decode(td))
  }

  /**
   * Performs a block hash to block number lookup.
   * @param {Buffer} hash
   * @returns Promise
   */
  async hashToNumber (hash) {
    const key = hashToNumberKey(hash)
    return new BN(await this.get(key, { cache: 'hashToNumber' }))
  }

  /**
   * Performs a block number to block hash lookup.
   * @param {BN} number
   * @returns Promise
   */
  async numberToHash (number) {
    if (number.ltn(0)) {
      throw new level.errors.NotFoundError()
    }

    const key = numberToHashKey(number)
    return this.get(key, { cache: 'numberToHash' })
  }

  /**
   * Fetches a key from the db. If `opts.cache` is specified
   * it first tries to load from cache, and on cache miss will
   * try to put the fetched item on cache afterwards.
   * @param {Buffer} key
   * @param {Object} opts - Options and their default values are:
   * - {string} [keyEncoding='binary']
   * - {string} [valueEncodingr='binary']
   * - {string} [cache=undefined] name of cache to use
   * @returns Promise
   */
  async get (key, opts = {}) {
    const dbOpts = {
      keyEncoding: opts.keyEncoding || 'binary',
      valueEncoding: opts.valueEncoding || 'binary'
    }

    if (opts.cache) {
      if (!this._cache[opts.cache]) {
        throw new Error(`Invalid cache: ${opts.cache}`)
      }

      let value = this._cache[opts.cache].get(key)
      if (!value) {
        value = await this._db.get(key, dbOpts)
        this._cache[opts.cache].set(key, value)
      }

      return value
    }

    return this._db.get(key, dbOpts)
  }

  /**
   * Performs a batch operation on db.
   * @param {Array} ops
   * @returns Promise
   */
  batch (ops) {
    return this._db.batch(ops)
  }
}
