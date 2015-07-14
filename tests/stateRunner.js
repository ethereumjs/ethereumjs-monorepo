const async = require('async')
const BN = require('bn.js')
const VM = require('../index.js')
const Account = require('ethereumjs-account')
const Bloom = require('../lib/bloom.js')
const testUtil = require('./util')
const utils = require('ethereumjs-util')
const Trie = require('merkle-patricia-tree/secure')

module.exports = function runStateTest(testData, options, cb) {

  var t = options.t
  var sstream = false
  var state = new Trie()
  var errored = false
  var block
  var hrstart
  var vm
  var result

  async.series([
    function(done) {
      testUtil.setupPreConditions(state, testData, done)
    },
    function(done) {
      vm = new VM(state)
      vm.loadAllPrecompiled(done)
    },
    function(done) {

      var tx = testUtil.makeTx(testData.transaction)
      block = testUtil.makeBlockFromEnv(testData.env)
      if (options.vmtrace)
        sstream = testUtil.enableVMtracing(vm, options.vmtrace)

      hrstart = process.hrtime()

      if (new BN(block.header.gasLimit).cmp(new BN(tx.gasLimit)) === -1)
        return done('tx has a higher gas limit than the block')

      if (tx.validate()) {
        vm.runTx({
          tx: tx,
          block: block,
        }, function(err, r) {
          result = r
          errored = true

          done()
        })
      } else {
        errored = true
        done()
      }
    },
    function(done) {
      var hrend = process.hrtime(hrstart)
      if (sstream) sstream.end()
      t.equal(state.root.toString('hex'), testData.postStateRoot, 'the state roots should match')

      if (testData.logs.length !== 0) {
        var bloom = new Bloom()
        testData.logs.forEach(function(l) {
          bloom.or(new Bloom(new Buffer(l.bloom, 'hex')))
        })
        t.equal(bloom.bitvector.toString('hex'), result.bloom.bitvector.toString('hex'), 'the bloom should be correct')
      }

      testUtil.verifyPostConditions(state, testData.post, t, done)
    }
  ], cb)
}
