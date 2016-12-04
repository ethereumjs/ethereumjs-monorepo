'use strict'

/**
 * NOTES
 * block details are child block hash, parent block hash, isUncle, isProcessed, and total difficulty
 * block details are stored to key  'detail:'+<blockhash>
 * meta.rawHead is the the head of the chain with the most POW
 * meta.head is the head of the chain that has had its state root verifed
 */
const async = require('async')
const Stoplight = require('flow-stoplight')
const semaphore = require('semaphore')
const levelup = require('levelup')
const memdown = require('memdown')
const Block = require('ethereumjs-block')
const ethUtil = require('ethereumjs-util')
const Ethash = require('ethashjs')
const BN = ethUtil.BN
const rlp = ethUtil.rlp

module.exports = Blockchain

function Blockchain(db, validate) {
  const self = this
  // TODO: SET LOCK
  // defaults
  self.db = db ? db : levelup('', { db: memdown })
  self.validate = (validate === undefined ? true : validate)
  self.ethash = self.validate ? new Ethash(db) : null
  self.meta = null
  self._initDone = false
  self._putSemaphore = semaphore(1)
  self._initLock = new Stoplight()
  self._init(function(err){
    if (err) throw err
    self._initLock.go()
  })
}

/**
 * Fetches the meta info about the blockchain from the db. Meta info contains
 * the hash of the head block and the hash of the genisis block
 * @method _init
 */
Blockchain.prototype._init = function (cb) {
  const self = this

  self.db.get('meta', {
    valueEncoding: 'json'
  }, onHeadFound)

  function onHeadFound (err, meta) {
    // look up failure
    if (err || !meta) {
      // generate default meta + genesis
      self.meta = {
        heads: {},
        td: new BN(),
      }
      self._setCanonicalGenesisBlock(cb)
      return
    }
    // look up success
    self.meta = meta
    self.meta.td = new BN(meta.td)
    cb()
  }
}

/**
 * Sets the default genesis block
 * @method _setCanonicalGenesisBlock
 */
Blockchain.prototype._setCanonicalGenesisBlock = function (cb) {
  const self = this
  var genesisBlock = new Block()
  genesisBlock.setGenesisParams()
  self._putBlock(genesisBlock, cb, true)
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
 * Returns that head block
 * @method getHead
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
  self._initLock.await(function runGetHead(){
    // if the head is not found return the rawHead
    var hash = self.meta.heads[name] || self.meta.rawHead
    if (!hash) {
      return cb(new Error('No head found.'))
    }
    self.getBlock(new Buffer(hash, 'hex'), cb)
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
  
  // perform put with mutex dance
  lockUnlock(function(done){
    self._putBlock(block, done, isGenesis)
  }, cb)

  // lock, call fn, unlock
  function lockUnlock(fn, cb){
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

Blockchain.prototype._putBlock = function (block, cb, isGenesis) {
  const self = this
  var blockHash = block.hash().toString('hex')
  var parentDetails
  var dbOps = []

  if (block.constructor !== Block) {
    block = new Block(block)
  }

  async.series([
    verify,
    verifyPOW,
    lookupParentBlock,
    rebuildInfo,
    save,
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

  // look up the parent meta info
  function lookupParentBlock (next) {
    // if genesis block
    if (isGenesis) return next()

    self.getDetails(block.header.parentHash, function (err, _parentDetails) {
      parentDetails = _parentDetails
      if (!err && parentDetails) {
        next()
      } else {
        let parentHash = ethUtil.bufferToHex(block.header.parentHash.toString('hex'))
        next(new Error(`parent hash not found: ${parentHash}`))
      }
    })
  }

  function rebuildInfo (next) {
    // calculate the total difficulty for this block
    var totalDifficulty = new BN(ethUtil.bufferToInt(block.header.difficulty))
    // add this block as a child to the parent's block details
    if (!isGenesis) {
      totalDifficulty.iadd(new BN(parentDetails.td))
      parentDetails.staleChildren.push(blockHash)
    }

    // store the block details
    var blockDetails = {
      parent: block.header.parentHash.toString('hex'),
      td: totalDifficulty.toString(),
      number: ethUtil.bufferToInt(block.header.number),
      child: null,
      staleChildren: [],
      genesis: block.isGenesis()
    }

    dbOps.push({
      type: 'put',
      key: 'detail:' + blockHash.toString('hex'),
      valueEncoding: 'json',
      value: blockDetails,
    })
    // store the block
    dbOps.push({
      type: 'put',
      key: blockHash,
      valueEncoding: 'binary',
      value: block.serialize(),
    })

    // need to update totalDifficulty
    if (block.isGenesis() || totalDifficulty.cmp(self.meta.td) === 1) {
      blockDetails.inChain = true
      self.meta.rawHead = blockHash
      self.meta.height = ethUtil.bufferToInt(block.header.number)
      self.meta.td = totalDifficulty

      // blockNumber as decimal string
      const blockNumber = parseInt(block.header.number.toString('hex') || '00', 16).toString()

      // index by number
      dbOps.push({
        type: 'put',
        key: blockNumber,
        valueEncoding: 'binary',
        value: new Buffer(blockHash, 'hex'),
      })

      // save meta
      dbOps.push({
        type: 'put',
        key: 'meta',
        valueEncoding: 'json',
        value: self.meta,
      })

      if (block.isGenesis()) {
        self.meta.genesis = blockHash
        next()
      } else {
        self._rebuildBlockchain(blockHash, block.header.parentHash, parentDetails, dbOps, next)        
      }
    } else {
      dbOps.push({
        type: 'put',
        key: 'detail:' + block.header.parentHash.toString('hex'),
        valueEncoding: 'json',
        value: parentDetails,
      })
      next()
    }
  }
  
  function save (next) {
    self.db.batch(dbOps, next)
  }

}

/**
 *Gets a block by its hash
 * @method getBlock
 * @param {String|Buffer|Number} hash - the sha256 hash of the rlp encoding of the block
 * @param {Function} cb - the callback function
 */
Blockchain.prototype.getBlock = function (hash, cb) {
  const self = this
  var block

  if (!Number.isInteger(hash)) {
    hash = ethUtil.toBuffer(hash).toString('hex')
  }

  self.db.get(hash, {
    valueEncoding: 'binary'
  }, function (err, value) {
    if (err) {
      return cb(err)
    }

    // if blockhash
    if (value.length === 32) {
      self.db.get(hash, {
        valueEncoding: 'binary'
      }, function (err, blockHash) {
        if (err) return cb(err)
        self.getBlock(blockHash, cb)
      })
    } else {
      block = new Block(rlp.decode(value))
      cb(err, block)
    }
  })
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
        return cb(null, blocks)
      }

      var nextBlockNumber = ethUtil.bufferToInt(block.header.number) + (reverse ? -1 : 1)

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
 * Gets a block by its hash
 * @method getBlockInfo
 * @param {String} hash - the sha256 hash of the rlp encoding of the block
 * @param {Function} cb - the callback function
 */
Blockchain.prototype.getDetails = function (hash, cb) {
  const self = this
  self.db.get('detail:' + hash.toString('hex'), {
    valueEncoding: 'json'
  }, cb)
}

/**
 * Gets a block by its hash
 * @method getBlockInfo
 * @param {String} hash - the sha256 hash of the rlp encoding of the block
 * @param {Function} cb - the callback function
 */
Blockchain.prototype.putDetails = function (hash, val, cb) {
  const self = this
  self.db.put('detail:' + hash.toString('hex'), val, {
    valueEncoding: 'json'
  }, cb)
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

  async.whilst(function () {
    return max >= min
  },
    function (cb2) {
      self.getBlockInfo(hashes[mid], function (err, hash) {
        if (!err && hash) {
          min = mid + 1
        } else {
          max = mid - 1
        }

        mid = Math.floor((min + max) / 2)
        cb2()
      })
    },
    function (err) {
      cb(err, hashes.slice(min))
    })
}

Blockchain.prototype._saveMeta = function (cb) {
  const self = this
  self.db.put('meta', self.meta, {
    keyEncoding: 'json'
  }, cb)
}

// builds the chain double link list from the head to the tail.
Blockchain.prototype._rebuildBlockchain = function (hash, parentHash, parentDetails, ops, cb) {
  const self = this
  var ppDetails, staleHash

  parentHash = parentHash.toString('hex')

  var i = parentDetails.staleChildren.indexOf(hash)
  if (i !== -1) {
    parentDetails.staleChildren.splice(i, 1)
  }

  if (parentDetails.child && parentDetails.child !== hash) {
    parentDetails.staleChildren.push(parentDetails.child)
  }

  parentDetails.child = hash

  ops.push({
    type: 'put',
    key: 'detail:' + parentHash.toString('hex'),
    valueEncoding: 'json',
    value: parentDetails
  })

  // 结束
  if (parentDetails.inChain) {
    cb()
    return
  }

  parentDetails.inChain = true

  async.series([
    loadNumberIndex,
    loadStaleDetails,
    getNextDetails
  ], function (err) {
    if (err) return cb(err)
    self._rebuildBlockchain(parentHash, parentDetails.parent, ppDetails, ops, cb)
  })

  function loadNumberIndex (done) {
    self.db.get(parentDetails.number, {
      valueEncoding: 'binary'
    }, function (err, _staleHash) {
      if (err) return done(err)
      staleHash = _staleHash
      done()
    })
  }

  function loadStaleDetails (done) {
    if (!staleHash) {
      done()
      return
    }

    self.getDetails(staleHash, function (err, staleDetails) {
      if (err) return done(err)

      staleDetails.inChain = false

      // reindex the block number
      ops.push({
        type: 'put',
        valueEncoding: 'binary',
        key: staleDetails.number,
        value: new Buffer(parentHash, 'hex')
      })
      ops.push({
        type: 'put',
        key: 'detail:' + staleHash.toString('hex'),
        value: staleDetails,
        valueEncoding: 'json'
      })
      done()
    })
  }

  function getNextDetails (done) {
    self.getDetails(parentDetails.parent, function (err, d) {
      if (err) return done(err)
      ppDetails = d
      done()
    })
  }
}

// todo add SEMIPHORE; the semiphore
// also this doesn't reset the heads
Blockchain.prototype.delBlock = function (blockhash, cb) {
  const self = this
  var dbOps = []
  var resetHeads = []

  if (!Buffer.isBuffer(blockhash)) {
    blockhash = blockhash.hash()
  }

  function buildDBops (cb2) {
    self._delBlock(blockhash, dbOps, resetHeads, cb2)
  }

  function getLastDeletesDetils (cb2) {
    self.getDetails(blockhash.toString('hex'), function (err, details) {
      if (details.inChain) {
        self.meta.rawHead = details.parent
      }

      resetHeads.forEach(function (head) {
        self.meta.heads[head] = details.parent
      })
      cb2(err)
    })
  }

  function runDB (cb2) {
    self.db.batch(dbOps, cb2)
  }

  async.series([
    buildDBops,
    getLastDeletesDetils,
    runDB
  ], cb)
}

Blockchain.prototype._delBlock = function (blockhash, dbOps, resetHeads, cb) {
  const self = this
  var details

  dbOps.push({
    type: 'del',
    key: 'detail:' + blockhash.toString('hex')
  })

  // delete the block
  dbOps.push({
    type: 'del',
    key: blockhash.toString('hex')
  })

  async.series([
    getDetails,
    removeChild,
    removeStaleChildren
  ], cb)

  function getDetails (cb2) {
    self.getDetails(blockhash, function (err, d) {
      for (var head in self.meta.heads) {
        if (blockhash.toString('hex') === self.meta.heads[head]) {
          resetHeads.push(head)
        }
      }
      details = d
      cb2(err)
    })
  }

  function removeChild (cb2) {
    if (details.child) {
      self._delBlock(details.child, dbOps, resetHeads, cb2)
    } else {
      cb2()
    }
  }

  function removeStaleChildren (cb2) {
    if (details.staleChildren) {
      async.each(details.staleChildern, function (child, cb3) {
        self._delBlock(child, dbOps, resetHeads, cb3)
      }, function (err) {
        cb2(err, details)
      })
    } else {
      cb2(null, details)
    }
  }
}

Blockchain.prototype.iterator = function (name, onBlock, cb) {
  const self = this
  // ensure init completed
  self._initLock.await(function(){
    self._iterator(name, onBlock, cb)
  })
}

Blockchain.prototype._iterator = function (name, func, cb) {
  const self = this
  var blockhash = self.meta.heads[name] || self.meta.genesis
  var lastBlock

  if (!blockhash) {
    return cb()
  }

  self.getDetails(blockhash, function (err, d) {
    if (err) cb(err)

    blockhash = d.child
    async.whilst(function () {
      return blockhash
    }, run, function () {
      self._saveMeta(cb)
    })
  })

  function run (cb2) {
    var details, block

    async.series([
      getDetails,
      getBlock,
      runFunc,
      saveDetails
    ], function (err) {
      if (!err) {
        blockhash = details.child
      } else {
        blockhash = false
      }
      cb2(err)
    })

    function getDetails (cb3) {
      self.getDetails(blockhash, function (err, d) {
        details = d
        if (d) {
          self.meta.heads[name] = blockhash
        }
        cb3(err)
      })
    }

    function getBlock (cb3) {
      self.getBlock(new Buffer(blockhash, 'hex'), function (err, b) {
        block = b
        cb3(err)
      })
    }

    function runFunc (cb3) {
      var reorg = lastBlock ? lastBlock.hash().toString('hex') !== block.header.parentHash.toString('hex') : false
      lastBlock = block
      func(block, reorg, cb3)
    }

    function saveDetails (cb3) {
      details[name] = true
      // self.putDetails(blockhash, details, cb3)
      var dbops = [{
        key: 'detail:' + blockhash.toString('hex'),
        value: details,
        valueEncoding: 'json'
      }, {
        type: 'put',
        key: 'meta',
        valueEncoding: 'json',
        value: self.meta
      }]

      self.db.batch(dbops, cb3)
    }
  }
}
