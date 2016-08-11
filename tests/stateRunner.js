const async = require('async')
const VM = require('../index.js')
const Bloom = require('../lib/bloom.js')
const testUtil = require('./util')
const Trie = require('merkle-patricia-tree/secure')

module.exports = function runStateTest (options, testData, t, cb) {
  const state = new Trie()
  let block, vm, result

  async.series([
    function (done) {
      vm = new VM({state: state})
      testUtil.setupPreConditions(state, testData, done)
    },
    function (done) {
      var tx = testUtil.makeTx(testData.transaction)
      block = testUtil.makeBlockFromEnv(testData.env)
      if (!block.isHomestead() && !testData.homestead) {
        tx._homestead = false
      } else {
        block.isHomestead = function () {
          return true
        }
      }

      if (tx.validate()) {
        vm.runTx({
          tx: tx,
          block: block
        }, function (err, r) {
          err = null
          result = r
          done()
        })
      } else {
        done()
      }
    },
    function (done) {
      t.equal(state.root.toString('hex'), testData.postStateRoot, 'the state roots should match')

      if (testData.logs.length !== 0) {
        var bloom = new Bloom()
        testData.logs.forEach(function (l) {
          bloom.or(new Bloom(new Buffer(l.bloom, 'hex')))
        })
        t.equal(bloom.bitvector.toString('hex'), result.bloom.bitvector.toString('hex'), 'the bloom should be correct')
      }

      if (state.root.toString('hex') !== testData.postStateRoot.toString('hex')) {
        testUtil.verifyPostConditions(state, testData.post, t, done)
      } else {
        done()
      }
    }
  ], cb)
}
