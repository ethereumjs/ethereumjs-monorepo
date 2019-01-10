const Trie = require('../src/index.js')
const async = require('async')
const tape = require('tape')

tape('offical tests', function (t) {
  const jsonTests = require('./fixture/trietest.json').tests
  const testNames = Object.keys(jsonTests)
  let trie = new Trie()
  async.eachSeries(testNames, function (i, done) {
    let inputs = jsonTests[i].in
    let expect = jsonTests[i].root

    async.eachSeries(inputs, function (input, done) {
      for (i = 0; i < 2; i++) {
        if (input[i] && input[i].slice(0, 2) === '0x') {
          input[i] = new Buffer(input[i].slice(2), 'hex')
        }
      }

      trie.put(new Buffer(input[0]), input[1], function () {
        done()
      })
    }, function () {
      t.equal('0x' + trie.root.toString('hex'), expect)
      trie = new Trie()
      done()
    })
  }, t.end)
})

tape('offical tests any order', function (t) {
  const jsonTests = require('./fixture/trieanyorder.json').tests
  var testNames = Object.keys(jsonTests)
  var trie = new Trie()
  async.eachSeries(testNames, function (i, done) {
    var test = jsonTests[i]
    var keys = Object.keys(test.in)

    async.eachSeries(keys, function (key, done) {
      var val = test.in[key]

      if (key.slice(0, 2) === '0x') {
        key = new Buffer(key.slice(2), 'hex')
      }

      if (val && val.slice(0, 2) === '0x') {
        val = new Buffer(val.slice(2), 'hex')
      }

      trie.put(new Buffer(key), new Buffer(val), function () {
        done()
      })
    }, function () {
      t.equal('0x' + trie.root.toString('hex'), test.root)
      trie = new Trie()
      done()
    })
  }, t.end)
})
