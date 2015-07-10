require('es6-shim')
const async = require('async')
const BN = require('bn.js')
const Account = require('../account')
const Trie = require('merkle-patricia-tree/secure.js')
const util = require('util')
const ethUtil = require('ethereumjs-util')
const EventEmitter = require('events').EventEmitter
const fs = require('fs')
const path = require('path')
const Cache = require('./cache.js')
const JSONStream = require('JSONStream')
const rlp = require('rlp')
const common = require('ethereum-common')

module.exports = VM

/**
 * @constructor
 */
function VM(trie, blockchain) {
  if(!trie.db)
    trie = new Trie(trie)

  this._storageTries = []
  this.blockchain = blockchain
  this.trie = trie
  this.cache = new Cache(trie)
}

util.inherits(VM, EventEmitter)

VM.prototype.runCode = require('./runCode.js')
VM.prototype.runJIT = require('./runJit.js')
VM.prototype.runBlock = require('./runBlock.js')
VM.prototype.runTx = require('./runTx.js')
VM.prototype.runCall = require('./runCall.js')

VM.prototype.copy = function() {
  var trie = this.trie.copy()
  var vm = new VM(trie, this.blockchain)
  return vm
}

VM.prototype.generateCanonicalGenesis = function(cb){
  this.generateGenesis(common.allotments, cb)
}

VM.prototype.generateGenesis = function(initState, cb) {
  var self = this
  var addresses = Object.keys(initState)
  async.eachSeries(addresses, function(address, done) {
    var account = new Account()
    account.balance = new Buffer((new BN(initState[address])).toArray())
    self.trie.put(new Buffer(address, 'hex'), account.serialize(), done)
  }, cb)
}

/**
 * Loads precomiled contracts into the state
 */
VM.prototype.loadPrecompiled = function(address, src, cb) {
  this.trie.db.put(address, src , cb)
}

VM.prototype.loadAllPrecompiled = function(cb) {

  var self = this
  var dir = path.join(__dirname, '../../precompiled/')
  var reg = new RegExp(/^\d+$/)

  fs.readdir(dir, function(err, files) {
    async.forEachSeries(files, function(file, cb2) {
      if (reg.test(file[0])) {
        fs.readFile(dir + file, function(err, data){
          var address = ethUtil.pad(new Buffer(file.split('-')[0], 'hex'), 20)
          self.loadPrecompiled(address, data, cb2)
        })
      } else {
        cb2()
      }
    }, cb)
  })
}

VM.prototype.populateCache = function(accounts, cb){

  var self = this

  //shim till async supports iterators
  var accountArr = []
  accounts.forEach(function(val) {
    if (val) accountArr.push(val)
  })

  async.eachSeries(accountArr, function(acnt, done) {
    acnt = new Buffer(acnt, 'hex')
    self.trie.get(acnt, function(err, val) {
      val = new Account(val)
      self.cache.put(acnt, val, true)
      done()
    })
  }, cb)
}

VM.prototype.logReadStream = function(){
  
  var stringify = JSONStream.stringify()
  var step = 0

  this.onStep = function(info, done) {

    var logObj = {
      step : step,
      pc: new BN(info.pc).toString(),
      depth: info.depth,
      opcode: info.opcode,
      gas: info.gasLeft.toString(),
      memory: (new Buffer(info.memory)).toString('hex'),
      storage: [],
      address: info.address.toString('hex')
    }

    step++

    logObj.stack = info.stack.map(function(item) {
      return ethUtil.pad(item, 32).toString('hex')
    })

    var stream = info.storageTrie.createReadStream()

    stream.on('data', function(data) {
      logObj.storage.push([ethUtil.unpad(data.key).toString('hex'), rlp.decode(data.value).toString('hex')])
    })

    stream.on('end', function() {
      stringify.write(logObj)
      done()
      // console.log('---------'+ logObj.opcode +' \n')
      // dumpState(vm.trie, done )
    })
  }

  return stringify
}
