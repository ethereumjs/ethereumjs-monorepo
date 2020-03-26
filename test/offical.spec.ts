import * as tape from 'tape'
import * as async from 'async'
const Trie = require('../dist/index').CheckpointTrie

tape('offical tests', function (t) {
  const jsonTests = require('./fixtures/trietest.json').tests
  const testNames = Object.keys(jsonTests)
  let trie = new Trie()
  async.eachSeries(
    testNames,
    function (i, done) {
      let inputs = jsonTests[i].in
      let expect = jsonTests[i].root

      async.eachSeries(
        inputs,
        function (input: any, done) {
          for (let i = 0; i < 2; i++) {
            if (input[i] && input[i].slice(0, 2) === '0x') {
              input[i] = Buffer.from(input[i].slice(2), 'hex')
            } else if (input[i] && typeof input[i] === 'string') {
              input[i] = Buffer.from(input[i])
            }
          }

          trie.put(Buffer.from(input[0]), input[1], function () {
            done()
          })
        },
        function () {
          t.equal('0x' + trie.root.toString('hex'), expect)
          trie = new Trie()
          done()
        },
      )
    },
    t.end,
  )
})

tape('offical tests any order', function (t) {
  const jsonTests = require('./fixtures/trieanyorder.json').tests
  var testNames = Object.keys(jsonTests)
  var trie = new Trie()
  async.eachSeries(
    testNames,
    function (i, done) {
      var test = jsonTests[i]
      var keys = Object.keys(test.in)

      async.eachSeries(
        keys,
        function (key: any, done) {
          var val = test.in[key]

          if (key.slice(0, 2) === '0x') {
            key = Buffer.from(key.slice(2), 'hex')
          }

          if (val && val.slice(0, 2) === '0x') {
            val = Buffer.from(val.slice(2), 'hex')
          }

          trie.put(Buffer.from(key), Buffer.from(val), function () {
            done()
          })
        },
        function () {
          t.equal('0x' + trie.root.toString('hex'), test.root)
          trie = new Trie()
          done()
        },
      )
    },
    t.end,
  )
})
