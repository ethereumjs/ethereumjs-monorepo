require('es6-shim')
const ethUtil = require('ethereumjs-util')
const BN = require('bn.js')
const rlp = require('rlp')
const Trie = require('merkle-patricia-tree')
const async = require('async')
const utils = require('ethereumjs-util')
const BlockHeader = require('./blockHeader')
const Tx = require('ethereumjs-tx')

/**
 * Represents a block
 * @constructor
 * @param {Array} data raw data, deserialized
 */
var Block = module.exports = function(data) {

  this.transactions = []
  this.uncleHeaders = []
  this._inBlockChain = false
  this.txTrie = new Trie()

  Object.defineProperty(this, 'raw', {
    get: function() {
      return this.serialize(false)
    }
  })

  var rawTransactions
  var rawUncleHeaders

  //defaults
  if (!data)
    data = [[], [], []]

  if (Buffer.isBuffer(data))
    data = rlp.decode(data)

  if (Array.isArray(data)) {
    this.header = new BlockHeader(data[0])
    rawTransactions = data[1]
    rawUncleHeaders = data[2]
  } else {
    this.header = new BlockHeader(data.header)
    rawTransactions = data.transactions
    rawUncleHeaders = data.uncleHeaders
  }

  //parse uncle headers
  for (var i = 0; i < rawUncleHeaders.length; i++) 
    this.uncleHeaders.push(new BlockHeader(rawUncleHeaders[i]))

  //parse transactions
  for (i = 0; i < rawTransactions.length; i++) 
    this.transactions.push(new Tx(rawTransactions[i]))
};

/**
 * Produces a hash the RLP of the block
 * @method hash
 */
Block.prototype.hash = function() {
  return this.header.hash()
}

/**
 * Determines if a given block is the genesis block
 * @method isGenisis
 * @return Boolean
 */
Block.prototype.isGenisis = function(){
  return this.header.number.toString('hex') === ''
}

/**
 * Produces a serialization of the block.
 * @method serialize
 * @param {Boolean} rlpEncode whether to rlp encode the block or not
 */
Block.prototype.serialize = function(rlpEncode) {
  var raw = [this.header.raw, [],
    []
  ]

  //rlpEnode defaults to true
  if (typeof rlpEncode === 'undefined')
    rlpEncode = true

  this.transactions.forEach(function(tx) {
    raw[1].push(tx.raw)
  })

  this.uncleHeaders.forEach(function(uncle) {
    raw[2].push(uncle.raw)
  })

  return rlpEncode ? rlp.encode(raw) : raw
}

/**
 * Generate transaction trie. The tx trie must be generated before the block can
 * be validated
 * @method genTxTrie
 * @param {Function} cb
 */
Block.prototype.genTxTrie = function(cb) {
  var i = 0,
    self = this

  async.eachSeries(this.transactions, function(tx, done) {
    self.txTrie.put(rlp.encode(i), tx.serialize(), done)
    i++
  }, cb)
}

/**
 * Validates the transaction trie
 * @method validateTransactionTrie
 * @return {Boolean}
 */
Block.prototype.validateTransactionsTrie = function() {
  var txT = this.header.transactionsTrie.toString('hex')
  if (this.transactions.length)
    return txT === this.txTrie.root.toString('hex')
  else
    return txT === utils.SHA3_RLP
}

/**
 * Validates the transactions
 * @method validateTransactions
 * @return {Boolean}
 */
Block.prototype.validateTransactions = function() {
  var validTxs = true
  this.transactions.forEach(function(tx) {
    validTxs &= tx.validate()
  })
  return validTxs
}

/**
 * Validates the block
 * @method validate
 * @param {BlockChain} blockChain the blockchain that this block wants to be part of
 * @param {Function} cb the callback which is given a `String` if the block is not valid
 */
Block.prototype.validate = function(blockChain, cb) {
  var self = this

  async.parallel([
    //validate uncles
    self.validateUncles.bind(self, blockChain),
    //validate block
    self.header.validate.bind(self.header, blockChain),
    //generate the transaction trie
    self.genTxTrie.bind(self)
  ], function(err) {

    if(!err){
      if(!self.validateTransactionsTrie())
        err  = 'invalid transaction true'

      if(!self.validateTransactions())
        err = 'invalid transaction'

      if(!self.validateUnclesHash())
        err = 'invild uncle hash'
    } 

    if(!err)
      self.parentBlock = self.header.parentBlock

    cb(err)
  })
}

Block.prototype.validateUnclesHash = function(){
  var raw = []
  this.uncleHeaders.forEach(function(uncle) {
     raw.push(uncle.raw)
  })

  raw = rlp.encode(raw)
  return ethUtil.sha3(raw).toString('hex') === this.header.uncleHash.toString('hex')
}

Block.prototype.validateUncles = function(blockChain, cb) {

  var self = this

  if(self.uncleHeaders.length > 2)
    return cb('too many uncle headers')

  var uncleHashes = self.uncleHeaders.map(function(header){
    return header.hash().toString('hex')
  })

  if(!((new Set(uncleHashes)).size === uncleHashes.length))
    return cb('dublicate unlces')

  async.each(self.uncleHeaders, function(uncle, cb2) {
    var height = new BN(self.header.number)
    async.parallel([
      uncle.validate.bind(uncle, blockChain, height),
      //check to make sure the uncle is not already in the blockchain
      function(cb3) {
        blockChain.getDetails(uncle.hash(), function(err, blockInfo) {
          //TODO: remove uncles from BC
          if (blockInfo && blockInfo.isUncle) {
            cb3(err || 'uncle already included')
          } else {
            cb3()
          }
        })
      }
    ], cb2)
  }, cb)
}

/**
 * Converts the block toJSON
 * @method toJSON
 * @param {Bool} array whether to create a object or an array
 */
Block.prototype.toJSON = function(labeled) {
  if (labeled) {
    var obj = {
      header: this.header.toJSON(true),
      transactions: [],
      uncleHeaders: []
    }

    this.transactions.forEach(function(tx) {
      obj.transactions.push(tx.toJSON(labeled))
    })

    this.uncleHeaders.forEach(function(uh) {
      obj.uncleHeaders.push(uh.toJSON())
    })

    return obj

  } else {
    return utils.baToJSON(this.raw)
  }
}
