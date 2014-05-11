var Trie = require('../index.js'),
  rlp = require('rlp'),
  levelup = require('levelup'),
  Sha3 = require('sha3'),
  assert = require('assert');

describe('simple save and retrive', function() {

  var db1 = levelup('./testdb');
  var trie = new Trie(db1);

  it("save a value", function(done) {

    trie.put('test', 'one', function() {
      done();
    });
  });

  it("should get a value", function(done) {

    trie.get('test', function(err, value) {
      assert.equal(value.toString(), 'one');
      done();
    });
  });

  it("should update a value", function(done) {
    trie.put('test', 'one', function() {
      done();
    });
  });

  it("should get updated a value", function(done) {
    trie.get('test', function(err, value) {
      done();
      assert.equal(value.toString(), 'one');
    });
  });

  it("should create a branch here", function(done) {

    trie.put('doge', 'coin', function() {
      assert.equal('de8a34a8c1d558682eae1528b47523a483dd8685d6db14b291451a66066bf0fc', trie.root);
      done();

    });
  });

  it("should get a value that is in a branch", function(done) {
    trie.get('doge', function(err, value) {
      assert.equal(value.toString(), 'coin');
      done();
    });
  });

});

describe("storing longer values", function() {
  var db2 = levelup('./testdb2');
  var trie2 = new Trie(db2);

  it("should store a longer string", function(done) {
    trie2.put('doge', 'coin coin coin coin coin', function(err, value) {
      assert.equal('8914f02a8ddbd1302def848cf1064f13cafa9bf7c223ec4f7ba3d62824977293', trie2.root.toString('hex'));
      done();
    });
  });

  it("should retreive a longer value", function(done) {
    trie2.get('doge', function(err, value) {
      assert.equal(value, 'coin coin coin coin coin');
      done();
    });
  });

});

describe("testing Extentions", function() {
  var db3 = levelup('./testdb3');
  var trie3 = new Trie(db3);

  it("should store a value", function(done) {
    trie3.put('doge', 'coin', function() {
      done();
    });
  });

  it("should create extention to store this value", function(done) {
    trie3.put('do', 'verb', function() {
      assert.equal('f803dfcb7e8f1afd45e88eedb4699a7138d6c07b71243d9ae9bff720c99925f9', trie3.root);
      done();
    });
  });

  it('should store this value under the extention ', function(done) {
    trie3.put('done', 'finished', function() {
      assert.equal('409cff4d820b394ed3fb1cd4497bdd19ffa68d30ae34157337a7043c94a3e8cb', trie3.root);
      done();
    });
  });

});

describe("it should create the genesis state root from ethereum", function() {

  var db4 = levelup('./testdb4'),
    trie4 = new Trie(db4),
    g = new Buffer('8a40bfaa73256b60764c1bf40675a99083efb075', 'hex'),
    j = new Buffer('e6716f9544a56c530d868e4bfbacb172315bdead', 'hex'),
    v = new Buffer('1e12515ce3e0f817a4ddef9ca55788a1d66bd2df', 'hex'),
    a = new Buffer('1a26338f0d905e295fccb71fa9ea849ffa12aaf4', 'hex'),
    hash = new Sha3.SHA3Hash(256),
    stateRoot = new Buffer(32);

  stateRoot.fill(0);
  var startAmount = new Buffer(26);
  startAmount.fill(0);
  startAmount[0] = 1;
  var account = [startAmount, 0, stateRoot, new Buffer(hash.digest('hex'), 'hex')];
  rlpAccount = rlp.encode(account);
  cppRlp = 'f85e9a010000000000000000000000000000000000000000000000000080a00000000000000000000000000000000000000000000000000000000000000000a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';

  var genesisStateRoot = "2f4399b08efe68945c1cf90ffe85bbe3ce978959da753f9e649f034015b8817d";
  assert.equal(cppRlp, rlpAccount.toString('hex'));
  //console.log(rlpAccount.toString('hex'));

  it("shall match the root given unto us by the Master Coder Gav", function(done) {
    trie4.put(g, rlpAccount, function() {
      trie4.put(j, rlpAccount, function() {
        trie4.put(v, rlpAccount, function() {
          trie4.put(a, rlpAccount, function() {
            assert.equal(trie4.root, genesisStateRoot);
            done();
          });
        });
      });
    });
  });
});
