var async = require('async'),
  BN = require('bn.js'),
  VM = require('../lib/vm'),
  Account = require('../lib/account.js'),
  testUtil = require('./util'),
  blockchain = require('./fakeBlockChain.js'),
  Trie = require('../index.js').Trie,
  fs = require('fs');

module.exports = function runStateTest(testData, options, cb) {

  var t = options.t;
  var sstream = false;
  var state = new Trie();
  var results;
  var account;

  async.series([
    function(done) {
      var acctData = testData.pre[testData.exec.address];
      account = new Account();
      account.nonce = testUtil.format(acctData.nonce);
      account.balance = testUtil.format(acctData.balance);
      testUtil.setupPreConditions(state, testData, done);
    },
    function(done){
      state.get(new Buffer(testData.exec.address, 'hex'), function(err, data){
        var a = new Account(data);
        account.stateRoot = a.stateRoot;
        done();
      });
    },
    function(done) {
      var block = testUtil.makeBlockFromEnv( testData.env);
      var vm = new VM(state, blockchain);
      var runCodeData = testUtil.makeRunCodeData(testData.exec, account, block);

      if (options.vmtrace) {
        sstream = testUtil.enableVMtracing(vm, options.vmtrace);
      }

      vm.runCode(runCodeData, function(err, r) {
        if (r) {
          results = r;
        }
        done();
      });
    },
    function(done) {
      if (sstream) sstream.end();

      if (testData.out && testData.out.slice(2)) {
        t.equal(results.returnValue.toString('hex'), testData.out.slice(2), 'valid return value');
      }

      if (testData.log && testData.logs.length !== 0) {
        testUtil.verifyLogs(results.logs, testData, t);
      }

      if(testData.gas && !results.exceptionErr){
        t.equal(results.gas.toString(), new BN(testUtil.format(testData.gas)).toString() , 'valid gas usage');
      }else{
        //OOG
        t.equal(results.gasUsed.toString(),  new BN(testUtil.format(testData.exec.gas)).toString(), 'valid gas usage');
      }

      done();
    }
  ], cb);
};
