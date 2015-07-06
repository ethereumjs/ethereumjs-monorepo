var Trie = require('../index.js')
var async = require('async')
var rlp = require('rlp')
var assert = require('assert')
var jsonTests = require('ethereum-tests').trieTests
var ethUtil = require('ethereumjs-util')

describe('offical tests', function () {
  var testNames
  var  trie

  before(function () {
    testNames = Object.keys(jsonTests.trietest)
    trie = new Trie()
  })

  it('pass all tests', function (done) {
    async.eachSeries(testNames, function (i, done) {
      var inputs = jsonTests.trietest[i].in
      var expect = jsonTests.trietest[i].root

      async.eachSeries(inputs, function (input, done) {
      
        for(i = 0; i < 2; i++){
          if(input[i] && input[i].slice(0,2) === '0x'){
            input[i] = new Buffer(input[i].slice(2), 'hex')
          }
        }

        trie.put(input[0], input[1], function () {
          done()
        })
      }, function () {

        assert.equal('0x' + trie.root.toString('hex'), expect)
        trie = new Trie()
        done()
      })

    }, function () {
      done()
    })
  })
})

describe('offical tests any order', function () {
  var testNames,
    trie

  before(function () {
    testNames = Object.keys(jsonTests.trieanyorder)
    trie = new Trie()
  })

  it('pass all tests', function (done) {
    async.eachSeries(testNames, function (i, done) {
      var test = jsonTests.trieanyorder[i]
      var keys = Object.keys(test.in)

      async.eachSeries(keys, function (key, done) {
        
        var val = test.in[key]     

        if(key.slice(0,2) === '0x'){
          key = new Buffer(key.slice(2), 'hex')
        }

        if(val && val.slice(0,2) === '0x'){
          val = new Buffer(val.slice(2), 'hex')
        }

        trie.put(key, val, function () {
          done()
        })
      }, function () {
        assert.equal('0x' + trie.root.toString('hex'), test.root)
        trie = new Trie()
        done()
      })

    }, function () {
      done()
    })
  })
})
