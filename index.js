/**
 * NOTES
 * block details are child block hash, parent block hash, isUncle, isProcessed, and total difficulty
 * block details are stored to key  'detail'+<blockhash>
 * meta.rawHead is the the head of the chain with the most POW
 * meta.head is the head of the chain that has had its state root verifed
 */
const async = require('async')
const Block = require('ethereumjs-block')
const utils = require('ethereumjs-util')
const Ethash = require('ethashjs')
const rlp = utils.rlp

var Blockchain = module.exports = function (db, validate) {
  this.db = db
  this.ethash = new Ethash(db)
  this.validate = validate === undefined ? true : validate
  this._initDone = false
  this._pendingSaves = []
  this._pendingGets = []
  this._init()
}

/**
 * Fetches the meta info about the blockchain from the db. Meta info contains
 * the hash of the head block and the hash of the genisis block
 * @method _init
 */
Blockchain.prototype._init = function () {
  var self = this

  function onHeadFound() {
    self._initDone = true
      //run the pending save operations
    async.eachSeries(self._pendingSaves, function (ops, cb) {
      self._addBlock(ops[0], function () {
        ops[1]()
        cb()
      })
    }, function () {
      delete self._pendingSaves
    })

    //run the pending getHead
    self._pendingGets.forEach(function (cb) {
      self.getHead(cb)
    })
  }

  this.db.get('meta', {
      valueEncoding: 'json'
    },
    function (err, meta) {
      if (!err && meta) {
        self.meta = meta
      } else {
        self.meta = {
          heads: {}
        }
      }
      onHeadFound()
    })
}

/**
 * Returns that head block
 * @method getHead
 * @param cb Function the callback
 */
Blockchain.prototype.getHead = function (name, cb) {
  if (typeof name === 'function') {
    cb = name
    name = 'vm'
  }

  if (!this._initDone)
    this._pendingGets.push(arguments)
  else {
    //if the head is not found return the rawHead
    var hash = this.meta.heads[name] || this.meta.rawHead
    this.getBlock(hash, cb)
  }
}

/**
 * Adds a block to the blockchain
 * @method addBlock
 * @param {object} block -the block to be added to the block chain
 * @param {function} cb - a callback function
 */
Blockchain.prototype.addBlock = function (block, cb) {
  if (!this._initDone)
    this._pendingSaves.push([block, cb])
  else
    this._addBlock(block, cb)
}

Blockchain.prototype._addBlock = function (block, cb) {
  var self = this
  var blockHash = block.hash().toString('hex')
  var parentDetails
  var dbOps = []

  if (block.constructor !== Block)
    block = new Block(block)

  async.series([
    function verify(cb2) {
      block.validate(self, function (err) {
        console.log(err);
        cb2(err)
      })
    },
    function verifyPOW(cb2) {
      if (!self.validate)
        return cb2()

      self.ethash.verifyPOW(block, function (valid) {
        if (valid)
          cb2()
        else {
          cb2('invalid POW')
        }
      })
    },
    //look up the parent meta info
    function parentInfo(cb2) {
      //if genesis block
      if (block.isGenesis())
        return cb2()

      self.getDetails(block.header.parentHash, function (err, pd) {
        parentDetails = pd
        if (!err && pd)
          cb2(null, pd)
        else
          cb2('parent hash not found')
      })
    },
    function rebuildInfo(cb2) {

      //calculate the total difficulty for this block
      var td = utils.bufferToInt(block.header.difficulty)
        //add this block as a child to the parent's block details
      if (parentDetails)
        td += parentDetails.td

      //store the block details
      var blockDetails = {
        parent: block.header.parentHash.toString('hex'),
        td: td,
        number: utils.bufferToInt(block.header.number),
        child: null,
        genesis: block.isGenesis()
      }
      dbOps.push({
        type: 'put',
        key: 'detail' + blockHash,
        valueEncoding: 'json',
        value: blockDetails
      })
      //store the block
      dbOps.push({
        type: 'put',
        key: blockHash,
        valueEncoding: 'binary',
        value: block.serialize()
      })
      //store the head block if this block has a bigger difficulty
      //than the prevous block
      if (td > self.meta.td || !self.meta.rawHead) {
        blockDetails.inChain = true
        self.meta.rawHead = blockHash
        self.meta.height = utils.bufferToInt(block.header.number)
        self.meta.td = td

        //save meta
        dbOps.push({
          type: 'put',
          key: 'meta',
          valueEncoding: 'json',
          value: self.meta
        })

        if (!block.isGenesis()) {
          //save parent details
          parentDetails.child = blockHash
          dbOps.push({
            type: 'put',
            key: 'detail' + block.header.parentHash.toString('hex'),
            valueEncoding: 'json',
            value: parentDetails
          })

          if (!parentDetails.genesis) {
            self._rebuildBlockchain(parentDetails.parent, block.header.parent, dbOps, cb2())
          } else {
            cb2()
          }
        } else {
          self.meta.genesis = blockHash
          cb2()
        }
      } else {
        cb2()
      }
    },
    function save(cb2) {
      self.db.batch(dbOps, cb2)
    }
  ], cb)
}

/**
 *Gets a block by its hash
 * @method getBlock
 * @param {String|Buffer|Number} hash - the sha256 hash of the rlp encoding of the block
 * @param {Function} cb - the callback function
 */
Blockchain.prototype.getBlock = function (hash, cb) {
  var block

  this.db.get(hash.toString('hex'), {
    valueEncoding: 'binary'
  }, function (err, value) {
    if (err)
      return cb(err)

    //if blockhash
    if (value.length === 32) {
      self.db.get(hash, function (err, block) {
        if (err)
          return cb(err)

        block = new Block(rlp.decode(value))
        cb(err, block)
      })
    } else {
      block = new Block(rlp.decode(value))
      cb(err, block)
    }
  })
}

/**
 * fetches blocks from the db
 * @method getBlocks
 * @param {Array.<Buffer>} hashes
 * @param {Function} cb
 * @return {Array.<Block>}
 */
Blockchain.prototype.getBlocks = function (hashes, cb) {
  var self = this
  async.mapSeries(hashes, function (hash, done) {
    self.getBlock(hash, done)
  }, cb)
}

/**
 * Gets a block by its hash
 * @method getBlockInfo
 * @param {String} hash - the sha256 hash of the rlp encoding of the block
 * @param {Function} cb - the callback function
 */
Blockchain.prototype.getDetails = function (hash, cb) {
  this.db.get('detail' + hash.toString('hex'), {
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
  this.db.put('detail' + hash.toString('hex'), val, {
    valueEncoding: 'json'
  }, cb)
}

Blockchain.prototype.iterator = function (func, name, cb) {

  var self = this
  var blockhash = this.meta['head' + name] || this.meta.genesis
  var lastBlock

  this.getDetails(blockhash, function (err, d) {
    blockhash = d.child
    async.whilst(function () {
      return blockhash
    }, run, function (err) {
      self._saveMeta(cb)
    })
  })

  function run(cb2) {
    var details, block
    self.meta.heads[name] = blockhash
    async.series([
      function getDetails(cb3) {
        self.getDetails(blockhash, function (err, d) {
          details = d
          cb3(err)
        })
      },
      function getBlock(cb3) {
        self.getBlock(blockhash, function (err, b) {
          block = b
          cb3(err)
        })
      },
      function runFunc(cb3) {
        var reorg = lastBlock ? lastBlock.hash().toString('hex') !== block.head.parentHash.toString('hex') : false
        lastBlock = block
        func(block, reorg, cb3)
      },
      function saveDetails(cb3) {
        details[name] = true
        self.putDetails(blockhash, details, cb3)
      }
    ], function (err) {
      if (!err)
        blockhash = details.child
      else
        blockhash = false
      cb2(err)
    })
  }
}

/**
 * Given an ordered array, returns to the callback an array of hashes that are
 * not in the blockchain yet
 * @method selectNeededHashes
 * @param {Array} hashes
 * @param {function} cb the callback
 */
Blockchain.prototype.selectNeededHashes = function (hashes, cb) {
  var max, mid, min
  var self = this

  max = hashes.length - 1
  mid = min = 0

  async.whilst(function () {
      return max >= min
    },
    function (cb2) {
      self.getBlockInfo(hashes[mid], function (err, hash) {
        if (!err && hash)
          min = mid + 1
        else
          max = mid - 1

        mid = Math.floor((min + max) / 2)
        cb2()
      })
    },
    function (err) {
      cb(err, hashes.slice(min))
    })
}

Blockchain.prototype._saveMeta = function (cb) {
  this.db.put('meta', this.meta, {
    keyEncoding: 'json'
  }, cb)
}

// builds the chain double link list from the head to the tail.
// TODO wrap in a semiphore
Blockchain.prototype._rebuildBlockchain = function (hash, childHash, ops, cb) {
  var self = this
  var details, staleDetails, staleHash, last

  async.series([

    function getDetails(done) {
      self.getDetails(hash.toString('hex'), function (err, d) {
        details = d

        for (head in meta.heads) {
          if (!details[head]) {
            self.meta.heads[head] = detials.parent
          }
        }

        if (details.child) {
          details.staleChildren.push(details.child)
        }

        details.child = childHash
        if (details.inChain)
        //short circut async
          return done('complete')

        details.inChain = true

        cb(err)
      })
    },
    function loadNumberIndex(done) {
      self.db.get(details.number, {
        valueEncoding: 'binary'
      }, function (err, blockHash) {
        staleHash = blockHash
        cb(err)
      })
    },
    function loadStaleDetails(done) {
      self.getDetails(staleHash, function (err, d) {
        staleDetails = d
        staleDetails.inChain = false
        done(err)
      })
    }
  ], function (err) {
    ops.push({
      type: 'put',
      key: hash,
      value: details,
      valueEncoding: 'json'
    })

    if (err)
      return cb(null, ops)
    else {
      ops.push({
        type: 'put',
        key: details.number,
        value: hash
      })
      ops.push({
        type: 'put',
        key: hash,
        value: staleDetails,
        valueEncoding: 'json'
      })
      self._rebuildBlockchain(details.parentHash, hash, ops, cb)
    }
  })
}

//todo add SEMIPHORE; the semiphore 
//also this doesn't reset the heads
Blockchain.prototype.delBlock = function (blockhash, cb) {
  var self = this
  var dbOps = []
  var resetHeads = []

  if (!Buffer.isBuffer(blockhash))
    blockhash = blockhash.hash()

  async.series([
    function buildDBops(cb2) {
      self._delBlock(blockhash, dbOps, resetHeads, cb2)
    },
    function getLastDeletesDetils(cb2) {
      self.getDetails(blockhash.toString('hex'), function (err, details) {
        if (details.inChain)
          self.meta.rawHead = details.parent

        resetHeads.forEach(function(head){
          self.meta.heads[head] = details.parent
        })
        cb2()
      })
    },
    function runDB(cb2) {
      self.db.batch(dbOps, cb2)
    }
  ], cb)
}

Blockchain.prototype._delBlock = function (blockhash, dbOps, resetHeads, cb) {
  var self = this
  var details


  dbOps.push({
    type: 'del',
    key: 'detail' + blockhash.toString('hex')
  })

  //delete the block
  dbOps.push({
    type: 'del',
    key: blockhash.toString('hex')
  })

  async.series([
    function getDetails(cb2) {
      self.getDetails(blockhash, function (err, d) {
        for (head in self.meta.heads) {
          if (blockhash.toString('hex') === self.meta.heads[head]) {
            resetHeads.push(head)
          }
        }
        details = d
        cb2()
      })
    },
    function removeChild(cb2) {
      if (details.child)
        self.removeBlock(details.child, cb2, resetHeads, dbOps)
      else
        cb2()
    },
    function removeStaleChildern(cb2) {
      if (details.staleChildren) {
        async.each(details.staleChildern, function (child, cb3) {
          self._removeBlock(child, dbOps, resetHeads, cb3)
        }, cb2)
      } else {
        cb2()
      }
    },
  ], cb)
}
