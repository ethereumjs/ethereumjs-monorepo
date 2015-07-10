const Tree = require('functional-red-black-tree')
const Account = require('../account.js')
const async = require('async')

var Cache = module.exports = function(trie) {
  this._cache = Tree()
  this._checkpoints = []
  this._deletes = []
  this._trie = trie
}

Cache.prototype.put = function(key, val, fromTrie) {

  // console.log('put:' + key.toString('hex') + ' ' + val.balance.toString('hex'))
  var modified = fromTrie ? false : true 
  key = key.toString('hex')
  val = val.serialize()
  var it = this._cache.find(key)
  // console.log('inserting: ' + val.toString('hex') )
  if(it.node)
    this._cache = it.update({val: val, modified: modified})
  else
    this._cache = this._cache.insert(key, {val: val, modified: modified})
 }

Cache.prototype.get = function(key){
  key = key.toString('hex')

  var it = this._cache.find(key)
  if(it.node)
    return new Account(it.value.val)
  else
    return new Account()
}

Cache.prototype.getOrLoad = function(key, cb){
  var self = this

  if(!key)
    return cb()

  key = key.toString('hex')

  var it = this._cache.find(key)
  if(it.node){
    var val = new Account(it.value.val)
    var raw = val && val.isEmpty() ? null : val.raw
    cb(null, val, raw)
  }else{
    this._trie.get(new Buffer(key, 'hex'), function(err, raw){
      var account = new Account(raw)
      self._cache = self._cache.insert(key, {val: account.serialize(), modified: false})
      cb(err, account, raw)
    })
  }
}

Cache.prototype.flush = function(cb){
  var it = this._cache.begin
  var self  = this
  var next = true

  async.whilst(function(){
    return next
  }, function(done){
    if(it.value.modified){
      self._trie.put(new Buffer(it.key, 'hex'), it.value.val, function(){
        next = it.hasNext
        it.next()
        done()
      })
    }else{
      next = it.hasNext
      it.next()
      done()
    }
  }, function(){
    //delete the deletes
    
    self._trie.get(new Buffer('aaaf5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'), function(err, account){
      async.eachSeries(self._deletes, function(address, done){
        self._trie.del(address, done)
      }, function(){
        self._deletes = []
        cb()
      })

    })
  })
}

Cache.prototype.checkpoint = function(){
  this._checkpoints.push(this._cache)
}

Cache.prototype.revert = function(){
  this._cache = this._checkpoints.pop(this._cache)
}

Cache.prototype.commit = function(){
  this._checkpoints.pop()
}

Cache.prototype.del = function(key){
  this._deletes.push(key)
  key = key.toString('hex')
  this._cache = this._cache.remove(key)
}
