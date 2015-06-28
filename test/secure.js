const Trie = require('../secure.js')
const async = require('async')
const rlp = require('rlp')
const assert = require('assert')
const jsonTests = require('ethereum-tests').trieTests.trietest_secureTrie
const ethUtil = require('ethereumjs-util')

var trie = new Trie()

describe('secure tests', function() {
  it('empty values', function(done) {
    async.eachSeries(jsonTests.emptyValues.in, function(row, cb) {
      trie.put(row[0], row[1], cb)
    }, function(){
      assert('0x' + trie.root.toString('hex') === jsonTests.emptyValues.root)
      done()
    })
  })

  it('branchingTests', function(done) {
    trie = new Trie()
    async.eachSeries(jsonTests.branchingTests.in, function(row, cb) {
      trie.put(row[0], row[1], cb)
    }, function(){
      assert('0x' + trie.root.toString('hex') === jsonTests.branchingTests.root)
      done()
    })
  })

  it('jeff', function(done) {
    async.eachSeries(jsonTests.jeff.in, function(row, cb) {
      
      var val = row[1]
      if(val)
        val = new Buffer(row[1].slice(2), 'hex')

      trie.put(new Buffer(row[0].slice(2), 'hex'), val, cb)
    }, function(){
      assert('0x' + trie.root.toString('hex') === jsonTests.jeff.root)
      done()
    })
  })
})
