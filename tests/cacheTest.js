const tape = require('tape')
const VM = require('../')
var async = require('async')
var Account = require('ethereumjs-account')
var Transaction = require('ethereumjs-tx')
var Trie = require('merkle-patricia-tree')
var ethUtil = require('ethereumjs-util')

tape('test the cache api', function (t) {
  t.test('should have the correct value in the cache ', function (st) {
    var account1 = {
      address: new Buffer('cd2a3d9f938e13cd947ec05abc7fe734df8dd826', 'hex'),
      key: ethUtil.sha3('cow')
    }

    /*
    contract Contract2 {
        uint i
        function Contract2() {
            i = 1
        }
    }
    */
    var account2 = {
      address: new Buffer('985509582b2c38010bfaa3c8d2be60022d3d00da', 'hex'),
      code: new Buffer('60606040525b60016000600050819055505b600a80601e6000396000f30060606040526008565b00', 'hex')
    }

    /*
    contract Contract {
        function test(uint i) returns (uint) {
            return i
        }
    }
    */
    var account3 = {
      code: new Buffer('6060604052606a8060116000396000f30060606040526000357c01000000000000000000000000000000000000000000000000000000009004806329e99f07146037576035565b005b6046600480359060200150605c565b6040518082815260200191505060405180910390f35b60008190506065565b91905056', 'hex')
    }

    var vm = new VM(new Trie())

    async.series([
      createAccount,
      runCode,
      runTx,
      function (cb) {
        vm.trie.get(account2.address, function (err, val) {
          t.assert(!err)
          var a = new Account(val)
          a.getCode(vm.trie, function (err, v) {
            t.assert(!err)
            t.assert(v.toString('hex') === '60606040526008565b00')
            cb()
          })
        })
      }
    ], function (err) {
      t.assert(!err)
      st.end()
    })

    function createAccount (cb) {
      var account = new Account()
      account.balance = '0xf00000000000000001'
      vm.trie.put(new Buffer(account1.address, 'hex'), account.serialize(), cb)
    }

    function runCode (cb) {
      var account = new Account()

      vm.runCode({
        code: account2.code,
        data: account2.code,
        account: account,
        gasLimit: 3141592,
        address: account2.address,
        caller: account1.address
      }, function (err, result) {
        if (err) return cb(err)
        account.setCode(vm.trie, result.return, function (err) {
          if (err) cb(err)
          else vm.trie.put(account2.address, account.serialize(), cb)
        })
      })
    }

    function runTx (cb) {
      var tx = new Transaction({
        gasLimit: 3141592,
        gasPrice: 1,
        data: account3.code
      })
      tx.sign(account1.key)
      vm.runTx({
        tx: tx
      }, cb)
    }
  })
})
