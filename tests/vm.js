const async = require('async'),
  rlp = require('rlp'),
  VM = require('../lib/vm'),
  Account = require('../lib/account.js'),
  utils = require('ethereumjs-util'),
  Tx = require('../lib/transaction.js'),
  assert = require('assert'),
  levelup = require('levelup'),
  Trie = require('merkle-patricia-tree'),
  testUtils = require('./testUtils'),
  vmTests = require('./fixtures/vmTests.json');

var stateDB = levelup('', {
    db: require('memdown')
  }),
  state = new Trie(stateDB);

describe.skip('[VM]: Basic functions', function() {

  it('setup the trie', function(done) {
    var test = vmTests.txTest;
    var account = new Account(test.preFromAccount);
    state.put(new Buffer(test.from, 'hex'), account.serialize(), done);
  });

  it('it should run a transaction', function(done) {
    var test = vmTests.txTest;
    var vm = new VM(state);

    vm.runTx(new Tx(test.tx), function(err, results) {
      assert(results.gasUsed.toNumber() === test.gasUsed, 'invalid gasUsed amount');
      assert(results.fromAccount.raw[0].toString('hex') === test.postFromAccount[0], 'invalid nonce on from account');
      assert(results.fromAccount.raw[1].toString('hex') === test.postFromAccount[1], 'invalid balance on from account');
      assert(results.toAccount.raw[1].toString('hex') === test.postToAccount[1], 'invalid balance on to account');
      done(err);
    });
  });
});


describe('[VM]: Extensions', function() {
  // from CallToReturn1
  var env = {
    'currentCoinbase': '2adc25665018aa1fe0e6bc666dac8fc2697ff9ba',
    'currentDifficulty': '256',
    'currentGasLimit': '10000000',
    'currentNumber': '0',
    'currentTimestamp': '1',
    'previousHash': '5e20a0453cecd065ea59c37ac63e079ee08998b6045136a8ce6635c7912ec0b6'
  };

  var exec = {
    'address': '0f572e5295c57f15886f9b263e2f6d2d6c7b5ec6',
    'caller': 'cd1722f3947def4cf144679da39c4c32bdc35681',
    'code': '0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6000547faaffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffaa6020546002600060406000601773945304eb96065b2a98b57a48a06ae28d285a71b5620f4240f1600057',
    'data': '0x',
    'gas': '10000000000000',
    'gasPrice': '100000000000000',
    'origin': 'cd1722f3947def4cf144679da39c4c32bdc35681',
    'value': '100000'
  };

  it('SHA256 at address 2', function(done) {
    state = new Trie();

    var vm = new VM(state);

    var block = testUtils.makeBlockFromEnv(env);

    // gas is 0x64 (100), the minimum needed
    // TODO fix gas to x64
    var theCode = '0x60016000526020600060206000601360026064f1600051600055';
    var expSha256Of32bitsWith1 = 'ec4916dd28fc4c10d78e287ca5d9cc51ee1ae73cbfde08c6b37324cbfaac8bc5';

    var account = new Account();
    account.nonce = testUtils.fromDecimal('0');
    account.balance = testUtils.fromDecimal('1000000000000000000');
    account.codeHash = testUtils.toCodeHash(theCode);

    var runCodeData = testUtils.makeRunCodeData(exec, account, block);
    runCodeData.code = new Buffer(theCode.slice(2), 'hex'); // slice off 0x

    vm.runCode(runCodeData, function(err, results) {
      assert(!err);
      state.root = results.account.stateRoot.toString('hex');
      state.get(utils.zeros(32), function(err, data) { // check storage at 0
        assert(!err);
        assert.strictEqual(rlp.decode(data).toString('hex'), expSha256Of32bitsWith1);
        assert.strictEqual(rlp.decode(data).length, 32);
        done();
      });
    });
  });

  it('SHA256 - OOG', function(done) {

    state = new Trie();

    var vm = new VM(state);

    var block = testUtils.makeBlockFromEnv(env);

    // gas is 0x63 (99), one less than the minimum needed
    var theCode = '0x60016000526020600060206000601360026063f1600051600055';
    var expSha256Of32bitsWith1 = 'ec4916dd28fc4c10d78e287ca5d9cc51ee1ae73cbfde08c6b37324cbfaac8bc5';

    var account = new Account();
    account.nonce = testUtils.fromDecimal('0');
    account.balance = testUtils.fromDecimal('1000000000000000000');
    account.codeHash = testUtils.toCodeHash(theCode);

    var runCodeData = testUtils.makeRunCodeData(exec, account, block);
    runCodeData.code = new Buffer(theCode.slice(2), 'hex'); // slice off 0x

    vm.runCode(runCodeData, function(err, results) {
      assert(!err);
      state.root = results.account.stateRoot.toString('hex');
      state.get(utils.zeros(32), function(err, data) { // check storage at 0
        assert(!err);
        assert.notStrictEqual(rlp.decode(data).toString('hex'), expSha256Of32bitsWith1);
        assert.strictEqual(rlp.decode(data).toString('hex'), '01');
        done();
      });
    });
  });

  it('RIPEMD160 at address 3', function(done) {

    state = new Trie();

    var vm = new VM(state);

    var block = testUtils.makeBlockFromEnv(env);

    // gas is 0x64 (100), the minimum needed
    var theCode = '0x60016000526020600060206000601360036064f1600051600055';
    var expRipeOf32bitsWith1 = 'ae387fcfeb723c3f5964509af111cf5a67f30661';

    var account = new Account();
    account.nonce = testUtils.fromDecimal('0');
    account.balance = testUtils.fromDecimal('1000000000000000000');
    account.codeHash = testUtils.toCodeHash(theCode);

    var runCodeData = testUtils.makeRunCodeData(exec, account, block);
    runCodeData.code = new Buffer(theCode.slice(2), 'hex'); // slice off 0x

    vm.runCode(runCodeData, function(err, results) {
      assert(!err);
      state.root = results.account.stateRoot.toString('hex');
      state.get(utils.zeros(32), function(err, data) { // check storage at 0
        assert(!err);
        assert.strictEqual(rlp.decode(data).toString('hex'), expRipeOf32bitsWith1);
        // TODO: should verify 32 bytes
        // assert.strictEqual(rlp.decode(data).length, 32);
        done();
      });
    });
  });

  it('ECRECOVER at address 1', function(done) {

    state = new Trie();

    var vm = new VM(state);

    var block = testUtils.makeBlockFromEnv(env);

    // gas is 0x01f4 (500), the minimum needed
    var theCode = '0x7f148c127f88ab9e15752c8f541f86f187c6831c666ece5706613a2ab271d95f15600052' // mstore msgHash x0
      + '7f000000000000000000000000000000000000000000000000000000000000001c602052' // mstore v x20
      + '7fdb3ecbe6f6a47e1cc25fece0292770b554d87c10a21c66f16d91fb9605e10300604052' // mstore r x40
      + '7f0c8c3f3112c365dd8c6a21d6fc5fa151c30e3a188754dcf7457f106a491a071f606052' // mstore s 60
      + '6020600060806000601360016101f4f1600051600055'; // push 0, call mload and then sstore x0
    var expAddress = 'a15e77198f5c70da99d6c4477fa9f7f215e0cbfa';
    var expBalance = '19'; // 0x13

    var account = new Account();
    account.nonce = testUtils.fromDecimal('0');
    account.balance = testUtils.fromDecimal('1000000000000000000');
    account.codeHash = testUtils.toCodeHash(theCode);

    var runCodeData = testUtils.makeRunCodeData(exec, account, block);
    runCodeData.code = new Buffer(theCode.slice(2), 'hex'); // slice off 0x

    /*
>>> priv = sha256('priv')
'3b9aa142fefa44aab83ab1c0909f6929fd53656b895ec2fc0e47d412ea62ba54'
>>> privtopub(priv)
'0424cb2aad569903db22cbd05cb8b633a93cb5d3ce5687906d34b478d36e148fc218cb0ba14ae6fd49caa5245dcf357750bbab4c6e1b84ec078a604daaadcb7586'
>>> utils.privtoaddr(priv)
'a15e77198f5c70da99d6c4477fa9f7f215e0cbfa'
>>> sha256('msghash')
'148c127f88ab9e15752c8f541f86f187c6831c666ece5706613a2ab271d95f15'

> priv = new Buffer('3b9aa142fefa44aab83ab1c0909f6929fd53656b895ec2fc0e47d412ea62ba54','hex')
<Buffer 3b 9a a1 42 fe fa 44 aa b8 3a b1 c0 90 9f 69 29 fd 53 65 6b 89 5e c2 fc 0e 47 d4 12 ea 62 ba 54>
> msghash = new Buffer('148c127f88ab9e15752c8f541f86f187c6831c666ece5706613a2ab271d95f15', 'hex')
<Buffer 14 8c 12 7f 88 ab 9e 15 75 2c 8f 54 1f 86 f1 87 c6 83 1c 66 6e ce 57 06 61 3a 2a b2 71 d9 5f 15>
> ecdsa.signCompact(priv, msghash)
{ recoveryId: 1,
  signature: <SlowBuffer db 3e cb e6 f6 a4 7e 1c c2 5f ec e0 29 27 70 b5 54 d8 7c 10 a2 1c 66 f1 6d 91 fb 96 05 e1 03 00 0c 8c 3f 31 12 c3 65 dd 8c 6a 21 d6 fc 5f a1 51 c3 0e 3a ...>,
  r: <Buffer db 3e cb e6 f6 a4 7e 1c c2 5f ec e0 29 27 70 b5 54 d8 7c 10 a2 1c 66 f1 6d 91 fb 96 05 e1 03 00>,
  s: <Buffer 0c 8c 3f 31 12 c3 65 dd 8c 6a 21 d6 fc 5f a1 51 c3 0e 3a 18 87 54 dc f7 45 7f 10 6a 49 1a 07 1f> }
> sig = ecdsa.signCompact(priv, msghash)
{ recoveryId: 1,
  signature: <SlowBuffer db 3e cb e6 f6 a4 7e 1c c2 5f ec e0 29 27 70 b5 54 d8 7c 10 a2 1c 66 f1 6d 91 fb 96 05 e1 03 00 0c 8c 3f 31 12 c3 65 dd 8c 6a 21 d6 fc 5f a1 51 c3 0e 3a ...>,
  r: <Buffer db 3e cb e6 f6 a4 7e 1c c2 5f ec e0 29 27 70 b5 54 d8 7c 10 a2 1c 66 f1 6d 91 fb 96 05 e1 03 00>,
  s: <Buffer 0c 8c 3f 31 12 c3 65 dd 8c 6a 21 d6 fc 5f a1 51 c3 0e 3a 18 87 54 dc f7 45 7f 10 6a 49 1a 07 1f> }
> sig.r.toString('hex')
'db3ecbe6f6a47e1cc25fece0292770b554d87c10a21c66f16d91fb9605e10300'
> sig.s.toString('hex')
'0c8c3f3112c365dd8c6a21d6fc5fa151c30e3a188754dcf7457f106a491a071f'
> sig.signature.toString('hex')
'db3ecbe6f6a47e1cc25fece0292770b554d87c10a21c66f16d91fb9605e103000c8c3f3112c365dd8c6a21d6fc5fa151c30e3a188754dcf7457f106a491a071f'
v is recoveryId + 27
    */

    vm.runCode(runCodeData, function(err, results) {
      assert(!err);

      async.series([
        function(cb) {
          var addrOne = utils.pad(new Buffer([1]), 20);
          state.get(addrOne, function(err, raw) {
            assert(!err);
            account = new Account(raw);
            assert.strictEqual(testUtils.toDecimal(account.balance), expBalance);
            cb();
          });
        },
        function() {
          state.root = results.account.stateRoot.toString('hex');
          state.get(utils.zeros(32), function(err, data) { // check storage at 0
            assert(!err);
            assert.strictEqual(rlp.decode(data).toString('hex'), expAddress);
            // TODO: should verify 32 bytes
            // assert.strictEqual(rlp.decode(data).length, 32);
            done();
          });
        }
      ]);
    });
  });

  it('ECRECOVER - OOG', function(done) {

    state = new Trie();

    var vm = new VM(state);

    var block = testUtils.makeBlockFromEnv(env);

    // gas is 0x01f3 (499), one less than the minimum needed
    var theCode = '0x7f148c127f88ab9e15752c8f541f86f187c6831c666ece5706613a2ab271d95f15600052' // mstore msgHash x0
      + '7f000000000000000000000000000000000000000000000000000000000000001c602052' // mstore v x20
      + '7fdb3ecbe6f6a47e1cc25fece0292770b554d87c10a21c66f16d91fb9605e10300604052' // mstore r x40
      + '7f0c8c3f3112c365dd8c6a21d6fc5fa151c30e3a188754dcf7457f106a491a071f606052' // mstore s 60
      + '6020600060806000601360016101f3f1600051600055'; // call mload and then sstore x0
    var msgHash = '148c127f88ab9e15752c8f541f86f187c6831c666ece5706613a2ab271d95f15';
    var expAddress = 'a15e77198f5c70da99d6c4477fa9f7f215e0cbfa';

    var account = new Account();
    account.nonce = testUtils.fromDecimal('0');
    account.balance = testUtils.fromDecimal('1000000000000000000');
    account.codeHash = testUtils.toCodeHash(theCode);

    var runCodeData = testUtils.makeRunCodeData(exec, account, block);
    runCodeData.code = new Buffer(theCode.slice(2), 'hex'); // slice off 0x

    vm.runCode(runCodeData, function(err, results) {
      assert(!err);
      state.root = results.account.stateRoot.toString('hex');
      state.get(utils.zeros(32), function(err, data) { // check storage at 0
        assert(!err);
        assert.notStrictEqual(rlp.decode(data).toString('hex'), expAddress);
        assert.strictEqual(rlp.decode(data).toString('hex'), msgHash);
        done();
      });
    });
  });
});
