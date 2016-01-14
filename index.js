const ethUtil = require('ethereumjs-util')
const rlp = require('rlp')

var Account = module.exports = function (data) {
  // Define Properties
  var fields = [{
    name: 'nonce',
    default: new Buffer([])
  }, {
    name: 'balance',
    default: new Buffer([])
  }, {
    name: 'stateRoot',
    length: 32,
    default: ethUtil.SHA3_RLP
  }, {
    name: 'codeHash',
    length: 32,
    default: ethUtil.SHA3_NULL
  }]

  ethUtil.defineProperties(this, fields, data)
}

Account.prototype.serialize = function () {
  return rlp.encode(this.raw)
}

Account.prototype.isContract = function () {
  return this.codeHash.toString('hex') !== ethUtil.SHA3_NULL_S
}

Account.prototype.getCode = function (state, cb) {
  if (!this.isContract()) {
    cb(null, new Buffer([]))
    return
  }

  state.getRaw(this.codeHash, function (err, val) {
    var compiled = val[0] === 1
    val = val.slice(1)
    cb(err, val, compiled)
  })
}

Account.prototype.setCode = function (trie, code, compiled, cb) {
  var self = this

  if (arguments.length === 3) {
    cb = compiled
    compiled = false
  }

  // store code for a new contract
  if (!compiled) {
    this.codeHash = ethUtil.sha3(code)
  }

  // set the compile flag
  code = Buffer.concat([new Buffer([compiled]), code])

  if (this.codeHash.toString('hex') === ethUtil.SHA3_NULL_S) {
    cb(null, new Buffer([]))
    return
  }

  trie.putRaw(this.codeHash, code, function (err) {
    cb(err, self.codeHash)
  })
}

Account.prototype.getStorage = function (trie, key, cb) {
  var t = trie.copy()
  t.root = this.stateRoot
  t.get(key, cb)
}

Account.prototype.setStorage = function (trie, key, val, cb) {
  var self = this
  var t = trie.copy()
  t.root = self.stateRoot
  t.put(key, val, function (err) {
    if (err) return cb()
    self.stateRoot = t.root
    cb()
  })
}

Account.prototype.isEmpty = function () {
  return this.balance.toString('hex') === '' &&
  this.nonce.toString('hex') === '' &&
  this.stateRoot.toString('hex') === ethUtil.SHA3_RLP_S &&
  this.codeHash.toString('hex') === ethUtil.SHA3_NULL_S
}
