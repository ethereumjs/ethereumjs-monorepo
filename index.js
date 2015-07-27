/**
 * NOTES
 * block details are child block hash, parent block hash, isUncle, isProcessed, and total difficulty
 * block details are stored to key  'detail'+<blockhash>
 */
const async = require('async')
const rlp = require('rlp')
const Block = require('./block.js')
const utils = require('ethereumjs-util')
const Ethash = require('./ethash')

var Blockchain = module.exports = function(db, validate) {
  this.db = db
  this.ethash = new Ethash(db)
  this.validate = validate
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
Blockchain.prototype._init = function() {
  var self = this

  function onHeadFound() {
    self._initDone = true
      //run the pending save operations
    async.eachSeries(self._pendingSaves, function(ops, cb) {
      self._addBlock(ops[0], function() {
        ops[1]()
        cb()
      })
    }, function() {
      delete self._pendingSaves
    })

    //run the pending getHead
    self._pendingGets.forEach(function(cb) {
      self.getHead(cb)
    })
  }

  this.db.get('meta', {
      valueEncoding: 'json'
    },
    function(err, meta) {
      if (!err && meta) {
        self.meta = meta
        self.db.get(meta.head, {
          valueEncoding: 'binary'
        }, function(err, head) {
          if (head)
            self.head = new Block(rlp.decode(head))
          onHeadFound()
        })
      } else {
        self.meta = {}
        onHeadFound()
      }
    })
}

/**
 * Returns that head block
 * @method getHead
 * @param cb Function the callback
 */
Blockchain.prototype.getHead = function(cb) {
  if (!this._initDone)
    this._pendingGets.push(cb)
  else
    cb(null, this.head)
}

/**
 * Adds a block to the blockchain
 * @method addBlock
 * @param {object} block -the block to be added to the block chain
 * @param {function} cb - a callback function
 */
Blockchain.prototype.addBlock = function(block, cb) {
  if (!this._initDone)
    this._pendingSaves.push([block, cb])
  else
    this._addBlock(block, cb)
}

Blockchain.prototype._addBlock = function(block, cb) {
  var self = this
  var blockHash = block.hash().toString('hex')
  var parentDetails

  if (block.constructor !== Block)
    block = new Block(block)

  if (!self.head)
    this.meta.genesis = blockHash

  async.series([
    //look up the parent meta info
    function parentInfo(cb2) {
      //if genesis block
      if (block.isGenisis())
        return cb2()

      self.getDetails(block.header.parentHash, function(err, pd) {
        parentDetails = pd
        if (!err && pd)
          cb2(null, pd)
        else
          cb2('parent hash not found')
      })
    },
    //update and store the details
    function storeParentDetails(cb2) {
      var dbOps = []
      //store the block
      dbOps.push({
        type: 'put',
        key: blockHash,
        valueEncoding: 'binary',
        value: block.serialize()
      })
      //calculate the total difficulty for this block
      var td = utils.bufferToInt(block.header.difficulty)
      //add this block as a child to the parent's block details
      if (parentDetails)
        td += parentDetails.td

      //store the block details
      var blockDetails = {
        type: 'put',
        key: 'detail' + blockHash,
        valueEncoding: 'json',
        value: {
          parent: block.header.parentHash.toString('hex'),
          td: td,
          number: utils.bufferToInt(block.header.number),
          child: null
        }
      }
      dbOps.push(blockDetails)

      //store the head block if this block has a bigger difficulty
      //than the prevous block
      if (td > self.meta.td || !self.head) {
        if (parentDetails) {
          parentDetails.child = blockHash

          //save parent details
          dbOps.push({
            type: 'put',
            key: 'detail' + block.header.parentHash.toString('hex'),
            valueEncoding: 'json',
            value: parentDetails
          })
        }

        self.meta.head = blockHash
        self.meta.height = utils.bufferToInt(block.header.number)
        self.meta.td = td

        //update meta
        dbOps.push({
          type: 'put',
          key: 'meta',
          valueEncoding: 'json',
          value: self.meta
        })

        if (self.head)
          self.parentHead = self.head

        self.head = block
      }
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
Blockchain.prototype.getBlock = function(hash, cb) {
  var block

  this.db.get(hash.toString('hex'), {
    valueEncoding: 'binary'
  }, function(err, value) {
    if (err)
      return cb(err)

    //if blockhash
    if(value.length === 32){
      self.db.get(hash, function(err, block) {
        if (err)
          return cb(err)
        
        block = new Block(rlp.decode(value))
        cb(err, block)
      })
    }else{
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
Blockchain.prototype.getBlocks = function(hashes, cb) {
  var self = this
  async.mapSeries(hashes, function(hash, done) {
    self.getBlock(hash, done)
  }, cb)
}

/**
 * Gets a block by its hash
 * @method getBlockInfo
 * @param {String} hash - the sha256 hash of the rlp encoding of the block
 * @param {Function} cb - the callback function
 */
Blockchain.prototype.getDetails = function(hash, cb) {
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
Blockchain.prototype.putDetails = function(hash, val, cb) {
  this.db.put('detail' + hash.toString('hex'), val, {
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
Blockchain.prototype.selectNeededHashes = function(hashes, cb) {
  var max, mid, min
  var self = this

  max = hashes.length - 1
  mid = min = 0

  async.whilst(function() {
      return max >= min
    },
    function(cb2) {
      self.getBlockInfo(hashes[mid], function(err, hash) {
        if (!err && hash)
          min = mid + 1
        else
          max = mid - 1

        mid = Math.floor((min + max) / 2)
        cb2()
      })
    },
    function(err) {
      cb(err, hashes.slice(min))
    })
}


// builds the chain double link list.
// TODO: eleminate wierd side effects 
Blockchain.prototype._buildBlockChain = function(hash, childHash, cb) {
  var self = this
  var details, staleDetails, staleHash, last

  async.series([
    function getDetails(done) {
      self.getDetails(hash.toString('hex'), function(err, d) {
        details = d
        if (details.isProcessed)
        //reset block mined if we mined past a fork
          self.meta.lastProcessed = hash

        if (details.child === childHash)
        //short circut async
          return done('complete')

        details.child = childHash
        cb(err)
      })
    },
    function loadNumberIndex(done) {
      self.db.get(details.number, {
        valueEncoding: 'binary'
      }, function(err, blockHash) {
        staleHash = blockHash
        cb(err)
      })
    },
    function saveNumberIndex(done) {
      self.db.put(details.number, hash, done)
    },
    function saveDetails(done) {
      self.setDetails(hash, details, {
        valueEncoding: 'json'
      }, done.bind(this, null, details))
    },
    function loadStaleDetails(done) {
      self.getDetails(staleHash, function(err, d) {
        staleDetails = d
        staleDetails.child = null
        done(err)
      })
    },
    function saveStaleDetails(done) {
      self.setDetails(staleHash, staleDetails, done)
    },
  ], function(err) {
    if (err === 'complete')
      return cb(null)
    else if (err)
      return cb(err)

    self._buildUnprocessedBlockChain(details.parentHash, hash, cb)
  })
}

//TODO mover these functions to an overlay
//startNumber is the next block Number to processes
Blockchain.prototype.setProcessed = function(hash, cb) {
  var self = this
  this.getDetails(hash, function(err, details) {
    //only update the details if the processed block is actully on the main chain
    var dbOps = []
    if(hash.toString('hex') === self.header.hash().toString('hex') || details.child){
      self.meta.lastProcessed = block.hash().toString('hex')
      dbOps.push({
        type: 'put',
        key: 'meta',
        valueEncoding: 'json',
        value: self.meta
      })
    }

    details.isProcessed = true
    dbOps.push({
      type: 'put',
      key: 'detail' + hash.toString('hex'),
      valueEncoding: 'json',
      value: details
    })

    self.db.batch(dbOps, cb)
  })
}

Blockchain.prototype.setLastProcessedBlock = function(block, cb) {
  this.meta.lastProcessed = block.hash().toString('hex')
  this.db.put('meta', {
    valueEncoding: 'json'
  }, this.meta, cb)
}

