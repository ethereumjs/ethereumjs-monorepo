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
const BN = utils.BN
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
    //run the pending save operations
    async.whilst(function(){
      return self._pendingSaves.length
    },function (cb) {
      var op = self._pendingSaves.pop()
      self._addBlock(op[0], function () {
        op[1]()
        cb()
      })
    }, function () {
      delete self._pendingSaves
      self._initDone = true

      //run the pending getHead
      self._pendingGets.forEach(function (args) {
        self.getHead.apply(self, args)
      })
    })
  }

  this.db.get('meta', {
      valueEncoding: 'json'
    },
    function (err, meta) {
      if (!err && meta) {
        self.meta = meta
        self.meta.td = new BN(self.meta.td)
      } else {
        self.meta = {
          heads: {},
          td: new BN()
        }
        self._generateGenesis()
      }
      onHeadFound()
    })
}

Blockchain.prototype._generateGenesis = function () {
  var genesisBlock = new Block()
  genesisBlock.setGenesisParams()
  this.putBlock(genesisBlock, function () {})
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
Blockchain.prototype.putBlock = function (block, cb) {
  if (!this._initDone)
    this._pendingSaves.push([block, cb])
  else
    this._addBlock(block, cb)
}

Blockchain.prototype.putBlocks = function(blocks, cb){
  self = this
  async.eachSeries(blocks, function(block, done){
    self.putBlock(block, function(err){
      done()
    }) 
  }, cb)
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
      if (!self.validate)
        return cb2()

      block.validate(self, cb2)
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
        else {
          cb2('parent hash not found')
        }
      })
    },
    function rebuildInfo(cb2) {

      //calculate the total difficulty for this block
      var td = new BN(utils.bufferToInt(block.header.difficulty))
        //add this block as a child to the parent's block details
      if (!block.isGenesis()) {
        td.iadd(new BN(parentDetails.td))
        parentDetails.staleChildren.push(blockHash)
      }

      //store the block details
      var blockDetails = {
        parent: block.header.parentHash.toString('hex'),
        td: td.toString(),
        number: utils.bufferToInt(block.header.number),
        child: null,
        staleChildren: [],
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

      if (td.cmp(self.meta.td) === 1 || block.isGenesis()) {
        blockDetails.inChain = true
        self.meta.rawHead = blockHash
        self.meta.height = utils.bufferToInt(block.header.number)
        self.meta.td = td

        //index by number
        dbOps.push({
          type: 'put',
          key: parseInt(block.header.number.toString('hex'), 16).toString(),
          value: blockHash,
        })

        //save meta
        dbOps.push({
          type: 'put',
          key: 'meta',
          valueEncoding: 'json',
          value: self.meta
        })

        if (!block.isGenesis()) {
          self._rebuildBlockchain(blockHash, block.header.parentHash, parentDetails, dbOps, cb2)
        } else {
          self.meta.genesis = blockHash
          cb2()
        }
      } else {
        dbOps.push({
          type: 'put',
          key: 'detail' + block.header.parentHash.toString('hex'),
          valueEncoding: 'json',
          value: parentDetails
        })
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

    async.series([

      function getDetails(cb3) {
        self.getDetails(blockhash, function (err, d) {
          details = d
          if (d) {
            self.meta.heads[name] = blockhash
          }
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
        var reorg = lastBlock ? lastBlock.hash().toString('hex') !== block.header.parentHash.toString('hex') : false
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
Blockchain.prototype._rebuildBlockchain = function (hash, parentHash, parentDetails, ops, cb) {
  var self = this
  var ppDetails, staleHash

  parentHash = parentHash.toString('hex')
  parentDetails.child = hash

  ops.push({
    type: 'put',
    key: 'detail' + parentHash,
    valueEncoding: 'json',
    value: parentDetails
  })

  var i = parentDetails.staleChildren.indexOf(hash)
  if (i != -1) {
    parentDetails.staleChildren.splice(i, 1);
  }

  if (parentDetails.child && parentDetails.child !== hash) {
    parentDetails.staleChildren.push(details.child)
  }

  parentDetails.child = hash
  if (parentDetails.inChain)
    return cb()

  console.log('paraent not in chain');
  parentDetails.inChain = true

  async.series([
    function loadNumberIndex(done) {
      self.db.get(parentDetails.number, function (err, s) {
        staleHash = s.toString('hex')
        done()
      })
    },
    function loadStaleDetails(done) {
      if (!staleHash)
        return done()

      self.getDetails(staleHash, function (err, staleDetails) {
        staleDetails.inChain = false

        ops.push({
          type: 'put',
          key: staleDetails.number,
          value: hash
        })
        ops.push({
          type: 'put',
          key: 'detail' + staleHash,
          value: staleDetails,
          valueEncoding: 'json'
        })
        done(err)
      })
    },
    function getNextDetails(done) {
      self.getDetails(parentDetails.parent, function (err, d) {
        ppDetails = d
        done(err)
      })
    }
  ], function (err) {
    self._rebuildBlockchain(parentHash, parentDetails.parent, ppDetails, ops, cb)
  })
}

//todo add SEMIPHORE; the semiphore 
//also this doesn't reset the heads
Blockchain.prototype.delBlock = function (blockhash, cb) {
  var self = this
  var dbOps = []
  var resetHeads = []
  var detials

  if (!Buffer.isBuffer(blockhash))
    blockhash = blockhash.hash()

  async.series([

    function buildDBops(cb2) {
      self._delBlock(blockhash, dbOps, resetHeads, function (err, d) {
        detials = d
        cb2(err)
      })
    },
    function getLastDeletesDetils(cb2) {
      self.getDetails(blockhash.toString('hex'), function (err, details) {
        if (details.inChain)
          self.meta.rawHead = details.parent

        resetHeads.forEach(function (head) {
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
        self._delBlock(details.child, dbOps, resetHeads, cb2)
      else
        cb2()
    },
    function removeStaleChildern(cb2) {
      if (details.staleChildren) {
        async.each(details.staleChildern, function (child, cb3) {
          self._delBlock(child, dbOps, resetHeads, cb3)
        }, function (err) {
          cb2(err, details)
        })
      } else {
        cb2(null, details)
      }
    },
  ], cb)
}
