'use strict'

const async = require('async')
const Stoplight = require('flow-stoplight')
const semaphore = require('semaphore')
const level = require('level-mem')
const Block = require('ethereumjs-block')
const Common = require('ethereumjs-common').default
const ethUtil = require('ethereumjs-util')
const Ethash = require('ethashjs')
const Buffer = require('safe-buffer').Buffer
const LRU = require('lru-cache')
const BN = ethUtil.BN
const rlp = ethUtil.rlp

// geth compatible db keys
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

module.exports = Blockchain

function Blockchain (opts) {
  opts = opts || {}
  const self = this

  if (opts.common) {
    if (opts.chain) {
      throw new Error('Instantiation with both opts.common and opts.chain parameter not allowed!')
    }
    this._common = opts.common
  } else {
    let chain = opts.chain ? opts.chain : 'mainnet'
    let hardfork = opts.hardfork ? opts.hardfork : null
    this._common = new Common(chain, hardfork)
  }

  // backwards compatibilty with older constructor interfaces
  if (opts.constructor.name === 'LevelUP') {
    opts = { db: opts }
  }
  self.db = opts.db || opts.blockDb

  // defaults
  self.db = self.db ? self.db : level()
  self.validate = (opts.validate === undefined ? true : opts.validate)
  self.ethash = self.validate ? new Ethash(self.db) : null
  self._heads = {}
  self._genesis = null
  self._headHeader = null
  self._headBlock = null
  self._cache = {
    td: new Cache({ max: 1024 }),
    header: new Cache({ max: 512 }),
    body: new Cache({ max: 256 }),
    numberToHash: new Cache({ max: 2048 }),
    hashToNumber: new Cache({ max: 2048 })
  }
  self._initDone = false
  self._putSemaphore = semaphore(1)
  self._initLock = new Stoplight()
  self._init(function (err) {
    if (err) throw err
    self._initLock.go()
  })
}

/**
 * Define meta getter for backwards compatibilty
 */
Blockchain.prototype = {
  get meta () {
    return {
      rawHead: this._headHeader,
      heads: this._heads,
      genesis: this._genesis
    }
  }
}

/**
 * Fetches the meta info about the blockchain from the db. Meta info contains
 * hashes of the headerchain head, blockchain head, genesis block and iterator
 * heads.
 * @method _init
 */
Blockchain.prototype._init = function (cb) {
  const self = this

  async.waterfall([
    (cb) => self._numberToHash(new BN(0), cb),
    getHeads
  ], (err) => {
    if (err) {
      // if genesis block doesn't exist, create one
      return self._setCanonicalGenesisBlock((err) => {
        if (err) return cb(err)
        self._heads = {}
        self._headHeader = self._genesis
        self._headBlock = self._genesis
        cb()
      })
    }
    cb()
  })

  function getHeads (genesisHash, cb) {
    self._genesis = genesisHash
    async.series([
      // load verified iterator heads
      (cb) => self.db.get('heads', {
        keyEncoding: 'binary',
        valueEncoding: 'json'
      }, (err, heads) => {
        if (err) heads = {}
        Object.keys(heads).map(key => { heads[key] = Buffer.from(heads[key]) })
        self._heads = heads
        cb()
      }),
      // load headerchain head
      (cb) => self.db.get(headHeaderKey, {
        keyEncoding: 'binary',
        valueEncoding: 'binary'
      }, (err, hash) => {
        self._headHeader = err ? genesisHash : hash
        cb()
      }),
      // load blockchain head
      (cb) => self.db.get(headBlockKey, {
        keyEncoding: 'binary',
        valueEncoding: 'binary'
      }, (err, hash) => {
        self._headBlock = err ? genesisHash : hash
        cb()
      })
    ], cb)
  }
}

/**
 * Sets the default genesis block
 * @method _setCanonicalGenesisBlock
 */
Blockchain.prototype._setCanonicalGenesisBlock = function (cb) {
  const self = this
  var genesisBlock = new Block(null, {common: self._common})
  genesisBlock.setGenesisParams()
  self._putBlockOrHeader(genesisBlock, cb, true)
}

/**
 * Puts the genesis block in the database
 * @method putGenesis
 */
Blockchain.prototype.putGenesis = function (genesis, cb) {
  const self = this
  self.putBlock(genesis, cb, true)
}

/**
 * Returns the specified iterator head.
 * @method getHead
 * @param name name of the head (default: 'vm')
 * @param cb Function the callback
 */
Blockchain.prototype.getHead = function (name, cb) {
  const self = this

  // handle optional args
  if (typeof name === 'function') {
    cb = name
    name = 'vm'
  }

  // ensure init completed
  self._initLock.await(function runGetHead () {
    // if the head is not found return the headHeader
    var hash = self._heads[name] || self._headBlock
    if (!hash) {
      return cb(new Error('No head found.'))
    }
    self.getBlock(hash, cb)
  })
}

/**
 * Returns the latest header in the canonical chain.
 * @method getLatestHeader
 * @param cb Function the callback
 */
Blockchain.prototype.getLatestHeader = function (cb) {
  const self = this

  // ensure init completed
  self._initLock.await(function runGetLatestHeader () {
    self.getBlock(self._headHeader, (err, block) => {
      if (err) return cb(err)
      cb(null, block.header)
    })
  })
}

/**
 * Returns the latest full block in the canonical chain.
 * @method getLatestBlock
 * @param cb Function the callback
 */
Blockchain.prototype.getLatestBlock = function (cb) {
  const self = this

  // ensure init completed
  self._initLock.await(function runGetLatestBlock () {
    self.getBlock(self._headBlock, cb)
  })
}

/**
 * Adds many blocks to the blockchain
 * @method putBlocks
 * @param {array} blocks - the blocks to be added to the blockchain
 * @param {function} cb - a callback function
 */

Blockchain.prototype.putBlocks = function (blocks, cb) {
  const self = this
  async.eachSeries(blocks, function (block, done) {
    self.putBlock(block, done)
  }, cb)
}

/**
 * Adds a block to the blockchain
 * @method putBlock
 * @param {object} block -the block to be added to the block chain
 * @param {function} cb - a callback function
 * @param {function} isGenesis - a flag for indicating if the block is the genesis block
 */
Blockchain.prototype.putBlock = function (block, cb, isGenesis) {
  const self = this

  // make sure init has completed
  self._initLock.await(() => {
    // perform put with mutex dance
    lockUnlock(function (done) {
      self._putBlockOrHeader(block, done, isGenesis)
    }, cb)
  })

  // lock, call fn, unlock
  function lockUnlock (fn, cb) {
    // take lock
    self._putSemaphore.take(function () {
      // call fn
      fn(function () {
        // leave lock
        self._putSemaphore.leave()
        // exit
        cb.apply(null, arguments)
      })
    })
  }
}

/**
 * Adds many headers to the blockchain
 * @method putHeaders
 * @param {array} headers - the headers to be added to the blockchain
 * @param {function} cb - a callback function
 */

Blockchain.prototype.putHeaders = function (headers, cb) {
  const self = this
  async.eachSeries(headers, function (header, done) {
    self.putHeader(header, done)
  }, cb)
}

/**
 * Adds a header to the blockchain
 * @method putHeader
 * @param {object} header -the header to be added to the block chain
 * @param {function} cb - a callback function
 */
Blockchain.prototype.putHeader = function (header, cb) {
  const self = this

  // make sure init has completed
  self._initLock.await(() => {
    // perform put with mutex dance
    lockUnlock(function (done) {
      self._putBlockOrHeader(header, done)
    }, cb)
  })

  // lock, call fn, unlock
  function lockUnlock (fn, cb) {
    // take lock
    self._putSemaphore.take(function () {
      // call fn
      fn(function () {
        // leave lock
        self._putSemaphore.leave()
        // exit
        cb.apply(null, arguments)
      })
    })
  }
}

Blockchain.prototype._putBlockOrHeader = function (item, cb, isGenesis) {
  const self = this
  var isHeader = item instanceof Block.Header
  var block = isHeader ? new Block([item.raw, [], []], {common: item._common}) : item
  var header = block.header
  var hash = block.hash()
  var number = new BN(header.number)
  var td = new BN(header.difficulty)
  var currentTd = { header: null, block: null }
  var dbOps = []

  if (block.constructor !== Block) {
    block = new Block(block, {common: self._common})
  }

  if (block._common.chainId() !== self._common.chainId()) {
    return cb(new Error('Chain mismatch while trying to put block or header'))
  }

  async.series([
    verify,
    verifyPOW,
    getCurrentTd,
    getBlockTd,
    rebuildInfo,
    (cb) => self._batchDbOps(dbOps.concat(self._saveHeadOps()), cb)
  ], cb)

  function verify (next) {
    if (!self.validate) return next()

    if (!isGenesis && block.isGenesis()) {
      return next(new Error('already have genesis set'))
    }

    block.validate(self, next)
  }

  function verifyPOW (next) {
    if (!self.validate) return next()

    self.ethash.verifyPOW(block, function (valid) {
      next(valid ? null : new Error('invalid POW'))
    })
  }

  function getCurrentTd (next) {
    if (isGenesis) {
      currentTd.header = new BN(0)
      currentTd.block = new BN(0)
      return next()
    }
    async.parallel([
      (cb) => self._getTd(self._headHeader, (err, td) => {
        currentTd.header = td
        cb(err)
      }),
      (cb) => self._getTd(self._headBlock, (err, td) => {
        currentTd.block = td
        cb(err)
      })
    ], next)
  }

  function getBlockTd (next) {
    // calculate the total difficulty of the new block
    if (isGenesis) {
      return next()
    }

    self._getTd(header.parentHash, number.subn(1), (err, parentTd) => {
      if (err) return next(err)
      td.iadd(parentTd)
      next()
    })
  }

  function rebuildInfo (next) {
    // save block and total difficulty to the database
    var key = tdKey(number, hash)
    var value = rlp.encode(td)
    dbOps.push({
      type: 'put',
      key: key,
      keyEncoding: 'binary',
      valueEncoding: 'binary',
      value: value
    })
    self._cache.td.set(key, value)

    // save header
    key = headerKey(number, hash)
    value = rlp.encode(header.raw)
    dbOps.push({
      type: 'put',
      key: key,
      keyEncoding: 'binary',
      valueEncoding: 'binary',
      value: value
    })
    self._cache.header.set(key, value)

    // store body if it exists
    if (isGenesis || block.transactions.length || block.uncleHeaders.length) {
      var body = block.serialize(false).slice(1)
      key = bodyKey(number, hash)
      value = rlp.encode(body)
      dbOps.push({
        type: 'put',
        key: key,
        keyEncoding: 'binary',
        valueEncoding: 'binary',
        value: value
      })
      self._cache.body.set(key, value)
    }

    // if total difficulty is higher than current, add it to canonical chain
    if (block.isGenesis() || td.gt(currentTd.header)) {
      self._headHeader = hash
      if (!isHeader) {
        self._headBlock = hash
      }
      if (block.isGenesis()) {
        self._genesis = hash
      }

      // delete higher number assignments and overwrite stale canonical chain
      async.parallel([
        (cb) => self._deleteStaleAssignments(number.addn(1), hash, dbOps, cb),
        (cb) => self._rebuildCanonical(header, dbOps, cb)
      ], next)
    } else {
      if (td.gt(currentTd.block) && !isHeader) {
        self._headBlock = hash
      }
      // save hash to number lookup info even if rebuild not needed
      key = hashToNumberKey(hash)
      value = bufBE8(number)
      dbOps.push({
        type: 'put',
        key: key,
        keyEncoding: 'binary',
        valueEncoding: 'binary',
        value: value
      })
      self._cache.hashToNumber.set(key, value)
      next()
    }
  }
}

/**
 *Gets a block by its hash
 * @method getBlock
 * @param {Buffer|Number|BN} hash - the sha256 hash of the rlp encoding of the block
 * @param {Function} cb - the callback function
 */
Blockchain.prototype.getBlock = function (blockTag, cb) {
  const self = this

  // ensure init completed
  self._initLock.await(function runGetBlock () {
    self._getBlock(blockTag, cb)
  })
}

Blockchain.prototype._getBlock = function (blockTag, cb) {
  const self = this

  // determine BlockTag type
  if (Number.isInteger(blockTag)) {
    blockTag = new BN(blockTag)
  }
  async.waterfall([
    (cb) => {
      if (Buffer.isBuffer(blockTag)) {
        self._hashToNumber(blockTag, (err, number) => {
          if (err) return cb(err)
          cb(null, blockTag, number)
        })
      } else if (BN.isBN(blockTag)) {
        self._numberToHash(blockTag, (err, hash) => {
          if (err) return cb(err)
          cb(null, hash, blockTag)
        })
      } else {
        cb(new Error('Unknown blockTag type'))
      }
    },
    lookupByHashAndNumber
  ], cb)

  function lookupByHashAndNumber (hash, number, cb) {
    async.parallel({
      header: (cb) => {
        self._getHeader(hash, number, (err, header) => {
          if (err) return cb(err)
          cb(null, header.raw)
        })
      },
      body: (cb) => {
        self._getBody(hash, number, (err, body) => {
          if (err) return cb(null, [[], []])
          cb(null, body)
        })
      }
    }, (err, parts) => {
      if (err) return cb(err)
      cb(null, new Block([parts.header].concat(parts.body), {common: self._common}))
    })
  }
}

/**
 * Looks up many blocks relative to blockId
 * @method getBlocks
 * @param {Buffer|Number} blockId - the block's hash or number
 * @param {Number} skip - number of blocks to skip
 * @param {Bool} reverse - fetch blocks in reverse
 * @param {Function} cb - the callback function
 */
Blockchain.prototype.getBlocks = function (blockId, maxBlocks, skip, reverse, cb) {
  const self = this
  var blocks = []
  var i = -1

  function nextBlock (blockId) {
    self.getBlock(blockId, function (err, block) {
      i++

      if (err) {
        if (err.notFound) {
          return cb(null, blocks)
        } else {
          return cb(err)
        }
      }

      var nextBlockNumber = new BN(block.header.number).addn(reverse ? -1 : 1)

      if (i !== 0 && skip && i % (skip + 1) !== 0) {
        return nextBlock(nextBlockNumber)
      }

      blocks.push(block)

      if (blocks.length === maxBlocks) {
        return cb(null, blocks)
      }

      nextBlock(nextBlockNumber)
    })
  }

  nextBlock(blockId)
}

/**
 * Gets block details by its hash (This is DEPRECATED and returns an empty object)
 * @method getDetails
 * @param {String} hash - the sha256 hash of the rlp encoding of the block
 * @param {Function} cb - the callback function
 */
Blockchain.prototype.getDetails = function (hash, cb) {
  cb(null, {})
}

/**
 * Given an ordered array, returns to the callback an array of hashes that are
 * not in the blockchain yet
 * @method selectNeededHashes
 * @param {Array} hashes
 * @param {function} cb the callback
 */
Blockchain.prototype.selectNeededHashes = function (hashes, cb) {
  const self = this
  var max, mid, min

  max = hashes.length - 1
  mid = min = 0

  async.whilst(function test () {
    return max >= min
  },
  function iterate (cb2) {
    self._hashToNumber(hashes[mid], (err, number) => {
      if (!err && number) {
        min = mid + 1
      } else {
        max = mid - 1
      }

      mid = Math.floor((min + max) / 2)
      cb2()
    })
  },
  function onDone (err) {
    if (err) return cb(err)
    cb(null, hashes.slice(min))
  })
}

Blockchain.prototype._saveHeadOps = function () {
  return [{
    type: 'put',
    key: 'heads',
    keyEncoding: 'binary',
    valueEncoding: 'json',
    value: this._heads
  }, {
    type: 'put',
    key: headHeaderKey,
    keyEncoding: 'binary',
    valueEncoding: 'binary',
    value: this._headHeader
  }, {
    type: 'put',
    key: headBlockKey,
    keyEncoding: 'binary',
    valueEncoding: 'binary',
    value: this._headBlock
  }]
}

Blockchain.prototype._saveHeads = function (cb) {
  this._batchDbOps(this._saveHeadOps(), cb)
}

// delete canonical number assignments for specified number and above
Blockchain.prototype._deleteStaleAssignments = function (number, headHash, ops, cb) {
  const self = this
  var key = numberToHashKey(number)

  self._numberToHash(number, (err, hash) => {
    if (err) return cb()
    ops.push({
      type: 'del',
      key: key,
      keyEncoding: 'binary'
    })
    self._cache.numberToHash.del(key)

    // reset stale iterator heads to current canonical head
    Object.keys(self._heads).forEach(function (name) {
      if (self._heads[name].equals(hash)) {
        self._heads[name] = headHash
      }
    })
    // reset stale headBlock to current canonical
    if (self._headBlock.equals(hash)) {
      self._headBlock = headHash
    }

    self._deleteStaleAssignments(number.addn(1), headHash, ops, cb)
  })
}

// overwrite stale canonical number assignments
Blockchain.prototype._rebuildCanonical = function (header, ops, cb) {
  const self = this
  const hash = header.hash()
  const number = new BN(header.number)

  function saveLookups (hash, number) {
    var key = numberToHashKey(number)
    var value
    ops.push({
      type: 'put',
      key: key,
      keyEncoding: 'binary',
      valueEncoding: 'binary',
      value: hash
    })
    self._cache.numberToHash.set(key, hash)

    key = hashToNumberKey(hash)
    value = bufBE8(number)
    ops.push({
      type: 'put',
      key: key,
      keyEncoding: 'binary',
      valueEncoding: 'binary',
      value: value
    })
    self._cache.hashToNumber.set(key, value)
  }

  // handle genesis block
  if (number.cmpn(0) === 0) {
    saveLookups(hash, number)
    return cb()
  }

  self._numberToHash(number, (err, staleHash) => {
    if (err) staleHash = null
    if (!staleHash || !hash.equals(staleHash)) {
      saveLookups(hash, number)

      // flag stale head for reset
      Object.keys(self._heads).forEach(function (name) {
        if (staleHash && self._heads[name].equals(staleHash)) {
          self._staleHeads = self._staleHeads || []
          self._staleHeads.push(name)
        }
      })
      // flag stale headBlock for reset
      if (staleHash && self._headBlock.equals(staleHash)) {
        self._staleHeadBlock = true
      }

      self._getHeader(header.parentHash, number.subn(1), (err, header) => {
        if (err) {
          delete self._staleHeads
          return cb(err)
        }
        self._rebuildCanonical(header, ops, cb)
      })
    } else {
      // set stale heads to last previously valid canonical block
      (self._staleHeads || []).forEach(function (name) {
        self._heads[name] = hash
      })
      delete self._staleHeads
      // set stale headBlock to last previously valid canonical block
      if (self._staleHeadBlock) {
        self._headBlock = hash
        delete self._staleHeadBlock
      }
      cb()
    }
  })
}

/**
 * Deletes a block from the blockchain. All child blocks in the chain are deleted
 * and any encountered heads are set to the parent block
 * @method delBlock
 * @param {Buffer} blockHash -the hash of the block to be deleted
 * @param {function} cb - a callback function
 */
Blockchain.prototype.delBlock = function (blockHash, cb) {
  const self = this

  // make sure init has completed
  self._initLock.await(() => {
    // perform put with mutex dance
    lockUnlock(function (done) {
      self._delBlock(blockHash, done)
    }, cb)
  })

  // lock, call fn, unlock
  function lockUnlock (fn, cb) {
    // take lock
    self._putSemaphore.take(function () {
      // call fn
      fn(function () {
        // leave lock
        self._putSemaphore.leave()
        // exit
        cb.apply(null, arguments)
      })
    })
  }
}

Blockchain.prototype._delBlock = function (blockHash, cb) {
  const self = this
  var dbOps = []
  var blockHeader = null
  var blockNumber = null
  var parentHash = null
  var inCanonical = null

  if (!Buffer.isBuffer(blockHash)) {
    blockHash = blockHash.hash()
  }

  async.series([
    getHeader,
    checkCanonical,
    buildDBops,
    deleteStaleAssignments,
    (cb) => self._batchDbOps(dbOps, cb)
  ], cb)

  function getHeader (cb2) {
    self._getHeader(blockHash, (err, header) => {
      if (err) return cb2(err)
      blockHeader = header
      blockNumber = new BN(blockHeader.number)
      parentHash = blockHeader.parentHash
      cb2()
    })
  }

  // check if block is in the canonical chain
  function checkCanonical (cb2) {
    self._numberToHash(blockNumber, (err, hash) => {
      inCanonical = !err && hash.equals(blockHash)
      cb2()
    })
  }

  // delete the block, and if block is in the canonical chain, delete all
  // children as well
  function buildDBops (cb2) {
    self._delChild(blockHash, blockNumber, inCanonical ? parentHash : null, dbOps, cb2)
  }

  // delete all number to hash mappings for deleted block number and above
  function deleteStaleAssignments (cb2) {
    if (inCanonical) {
      self._deleteStaleAssignments(blockNumber, parentHash, dbOps, cb2)
    } else {
      cb2()
    }
  }
}

Blockchain.prototype._delChild = function (hash, number, headHash, ops, cb) {
  const self = this

  // delete header, body, hash to number mapping and td
  ops.push({
    type: 'del',
    key: headerKey(number, hash),
    keyEncoding: 'binary'
  })
  self._cache.header.del(headerKey(number, hash))

  ops.push({
    type: 'del',
    key: bodyKey(number, hash),
    keyEncoding: 'binary'
  })
  self._cache.body.del(bodyKey(number, hash))

  ops.push({
    type: 'del',
    key: hashToNumberKey(hash),
    keyEncoding: 'binary'
  })
  self._cache.hashToNumber.del(hashToNumberKey(hash))

  ops.push({
    type: 'del',
    key: tdKey(number, hash),
    keyEncoding: 'binary'
  })
  self._cache.td.del(tdKey(number, hash))

  if (!headHash) {
    return cb()
  }

  if (hash.equals(self._headHeader)) {
    self._headHeader = headHash
  }

  if (hash.equals(self._headBlock)) {
    self._headBlock = headHash
  }

  self._getCanonicalHeader(number.addn(1), (err, childHeader) => {
    if (err) return cb()
    self._delChild(childHeader.hash(), new BN(childHeader.number), headHash, ops, cb)
  })
}

/**
 * Iterates through blocks starting at the specified iterator head and calls
 * the onBlock function on each block. The current location of an iterator head
 * can be retrieved using the `getHead()`` method
 * @method iterator
 * @param {String} name - the name of the iterator head
 * @param {function} onBlock - function called on each block with params (block, reorg, cb)
 * @param {function} cb - a callback function
 */
Blockchain.prototype.iterator = function (name, onBlock, cb) {
  const self = this
  // ensure init completed
  self._initLock.await(function () {
    self._iterator(name, onBlock, cb)
  })
}

Blockchain.prototype._iterator = function (name, func, cb) {
  const self = this
  var blockHash = self._heads[name] || self._genesis
  var blockNumber
  var lastBlock

  if (!blockHash) {
    return cb()
  }

  self._hashToNumber(blockHash, (err, number) => {
    if (err) return cb(err)
    blockNumber = number.addn(1)
    async.whilst(
      () => blockNumber,
      run,
      (err) => err ? cb(err) : self._saveHeads(cb)
    )
  })

  function run (cb2) {
    var block

    async.series([
      getBlock,
      runFunc
    ], function (err) {
      if (!err) {
        blockNumber.iaddn(1)
      } else {
        blockNumber = false
        // No more blocks, return
        if (err.type === 'NotFoundError') {
          return cb2()
        }
      }
      cb2(err)
    })

    function getBlock (cb3) {
      self.getBlock(blockNumber, function (err, b) {
        block = b
        if (block) {
          self._heads[name] = block.hash()
        }
        cb3(err)
      })
    }

    function runFunc (cb3) {
      var reorg = lastBlock ? lastBlock.hash().equals(block.header.parentHash) : false
      lastBlock = block
      func(block, reorg, cb3)
    }
  }
}

/**
 * Executes multiple db operations in a single batch call
 * @method _batchDbOps
 */
Blockchain.prototype._batchDbOps = function (dbOps, cb) {
  this.db.batch(dbOps, cb)
}

/**
 * Performs a block hash to block number lookup
 * @method _hashToNumber
 */
Blockchain.prototype._hashToNumber = function (hash, cb) {
  const self = this

  var key = hashToNumberKey(hash)
  var number = self._cache.hashToNumber.get(key)
  if (number) {
    return cb(null, new BN(number))
  }
  self.db.get(key, {
    keyEncoding: 'binary',
    valueEncoding: 'binary'
  }, (err, number) => {
    if (err) return cb(err)
    self._cache.hashToNumber.set(key, number)
    cb(null, new BN(number))
  })
}

/**
 * Performs a block number to block hash lookup
 * @method _numberToHash
 */
Blockchain.prototype._numberToHash = function (number, cb) {
  const self = this

  if (number.ltn(0)) {
    return cb(new level.errors.NotFoundError())
  }
  var key = numberToHashKey(number)
  var hash = self._cache.numberToHash.get(key)
  if (hash) {
    return cb(null, hash)
  }
  self.db.get(key, {
    keyEncoding: 'binary',
    valueEncoding: 'binary'
  }, (err, hash) => {
    if (err) return cb(err)
    self._cache.numberToHash.set(key, hash)
    cb(null, hash)
  })
}

/**
 * Helper function to lookup a block by either hash only or a hash and number pair
 * @method _lookupByHashNumber
 */
Blockchain.prototype._lookupByHashNumber = function (hash, number, cb, next) {
  if (typeof number === 'function') {
    cb = number
    return this._hashToNumber(hash, (err, number) => {
      if (err) return next(err, hash, null, cb)
      next(null, hash, number, cb)
    })
  }
  next(null, hash, number, cb)
}

/**
 * Gets a header by hash and number. Header can exist outside the canonical chain
 * @method _getHeader
 */
Blockchain.prototype._getHeader = function (hash, number, cb) {
  const self = this

  self._lookupByHashNumber(hash, number, cb, (err, hash, number, cb) => {
    if (err) return cb(err)
    var key = headerKey(number, hash)
    var encodedHeader = self._cache.header.get(key)
    if (encodedHeader) {
      return cb(null, new Block.Header(rlp.decode(encodedHeader), {common: self._common}))
    }
    self.db.get(key, {
      keyEncoding: 'binary',
      valueEncoding: 'binary'
    }, (err, encodedHeader) => {
      if (err) return cb(err)
      self._cache.header.set(key, encodedHeader)
      cb(null, new Block.Header(rlp.decode(encodedHeader), {common: self._common}))
    })
  })
}

/**
 * Gets a header by number. Header must be in the canonical chain
 * @method _getCanonicalHeader
 */
Blockchain.prototype._getCanonicalHeader = function (number, cb) {
  const self = this

  self._numberToHash(number, (err, hash) => {
    if (err) return cb(err)
    self._getHeader(hash, number, cb)
  })
}

/**
 * Gets a block body by hash and number
 * @method _getBody
 */
Blockchain.prototype._getBody = function (hash, number, cb) {
  const self = this

  self._lookupByHashNumber(hash, number, cb, (err, hash, number, cb) => {
    if (err) return cb(err)
    var key = bodyKey(number, hash)
    var encodedBody = self._cache.body.get(key)
    if (encodedBody) {
      return cb(null, rlp.decode(encodedBody))
    }
    self.db.get(key, {
      keyEncoding: 'binary',
      valueEncoding: 'binary'
    }, (err, encodedBody) => {
      if (err) return cb(err)
      self._cache.body.set(key, encodedBody)
      cb(null, rlp.decode(encodedBody))
    })
  })
}

/**
 * Gets total difficulty for a block specified by hash and number
 * @method _getTd
 */
Blockchain.prototype._getTd = function (hash, number, cb) {
  const self = this

  self._lookupByHashNumber(hash, number, cb, (err, hash, number, cb) => {
    if (err) return cb(err)
    var key = tdKey(number, hash)
    var td = self._cache.td.get(key)
    if (td) {
      return cb(null, new BN(rlp.decode(td)))
    }
    self.db.get(key, {
      keyEncoding: 'binary',
      valueEncoding: 'binary'
    }, (err, td) => {
      if (err) return cb(err)
      self._cache.td.set(key, td)
      cb(null, new BN(rlp.decode(td)))
    })
  })
}

// Simple LRU Cache that allows for keys of type Buffer
function Cache (opts) {
  this._cache = new LRU(opts)
}

Cache.prototype.set = function (key, value) {
  if (key instanceof Buffer) {
    key = key.toString('hex')
  }
  this._cache.set(key, value)
}

Cache.prototype.get = function (key) {
  if (key instanceof Buffer) {
    key = key.toString('hex')
  }
  return this._cache.get(key)
}

Cache.prototype.del = function (key) {
  if (key instanceof Buffer) {
    key = key.toString('hex')
  }
  this._cache.del(key)
}
