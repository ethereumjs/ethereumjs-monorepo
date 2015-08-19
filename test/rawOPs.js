var Trie = require('../index.js')
var assert = require('assert')
var crypto = require('crypto')

describe('put & get raw functions', function(){
  var trie = new Trie()
  var key =  crypto.randomBytes(32)
  var val =  crypto.randomBytes(32)

  it('putRaw', function(done){
    trie.putRaw(key, val, done)
  })

  it('getRaw', function(done){
    trie.getRaw(key, function(err, rVal){
      assert(val.toString('hex') === rVal.toString('hex'))
      done()
    })
  })

  it('should checkpoint and get the rawVal', function(done){
    trie.checkpoint()
    trie.getRaw(key, function(err, rVal){
      assert(val.toString('hex') === rVal.toString('hex'))
      done()
    })
  })

  var key2 =  crypto.randomBytes(32)
  var val2 =  crypto.randomBytes(32)
  it('should store while in a checkpoint', function(done){
    trie.putRaw(key2, val2, done)
  })

  it('should retrieve from a checkpoint', function(done){
    trie.getRaw(key2, function(err, rVal){
      assert(val2.toString('hex') === rVal.toString('hex'))
      done()
    })
  })

  it('should not retiev after revert', function(done){
    trie.revert(done)
  })

  it('should delete raw', function(done){
    trie.delRaw(val2, done)
  })

  it('should not get val after delete ', function(done){
    trie.getRaw(val2, function(err, val){
      assert(!val)
      done()
    })
  })

  var key3 =  crypto.randomBytes(32)
  var val3 =  crypto.randomBytes(32)

  it('test commit behavoir', function(done){
    trie.checkpoint()
    trie.putRaw(key3, val3, function(){
      trie.commit(function(){
        trie.getRaw(key3, function(err, val){
          assert(val.toString('hex') === val3.toString('hex'))
          done()
        })
      })
    })
  })
})

