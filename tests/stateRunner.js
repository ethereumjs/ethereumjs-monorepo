const async = require('async')
const VM = require('../index.js')
const Bloom = require('../lib/bloom.js')
const testUtil = require('./util')
const Trie = require('merkle-patricia-tree/secure')

module.exports = function runStateTest (options, testData, t, cb) {
  var sstream = false
  var state = new Trie()
  var block, vm, result // ,hrstart

  async.series([
    function (done) {
      vm = new VM(state)
      testUtil.setupPreConditions(state, testData, done)
    },
    function (done) {
      var tx = testUtil.makeTx(testData.transaction)
      block = testUtil.makeBlockFromEnv(testData.env)
      if (options.vmtrace) {
        sstream = testUtil.enableVMtracing(vm, options.vmtrace)
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
      // var hrend = process.hrtime(hrstart)
      if (sstream) {
        sstream.push(null)
      }

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
