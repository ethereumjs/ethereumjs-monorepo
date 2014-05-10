var Trie = require('../index.js'),
  rlp = require('rlp'),
  levelup = require('levelup'),
  bignum = require('bignum'),
  Sha3 = require('sha3'),
  assert = require('assert');


var db1 = levelup('./testdb');
var trie = new Trie(db1);

trie.put('test', 'one', function () {
  trie.get('test', function (err, value) {
    assert.equal(value.toString(), 'one');
    trie.put('test', 'one', function () {
      trie.put('doge', 'coin', function () {
        assert.equal('de8a34a8c1d558682eae1528b47523a483dd8685d6db14b291451a66066bf0fc', trie.root);
        trie.get('test', function (err, value) {
          assert.equal(value.toString(), 'one');
        });

        trie.get('doge', function (err, value) {
          assert.equal(value.toString(), 'coin');
        });

      });
    });


  });
});

var db2 = levelup('./testdb2');
var trie2 = new Trie(db2);
trie2.put('doge', 'coin coin coin coin coin',function(err, value){
  assert.equal('8914f02a8ddbd1302def848cf1064f13cafa9bf7c223ec4f7ba3d62824977293', trie2.root.toString('hex'));
  trie2.get('doge',function(err, value){
    assert.equal(value,'coin coin coin coin coin');
  });

});


var db3 = levelup('./testdb3');
var trie3 = new Trie(db3);
trie3.put('doge', 'coin', function(){
  trie3.put('do', 'verb', function(){
    assert.equal('f803dfcb7e8f1afd45e88eedb4699a7138d6c07b71243d9ae9bff720c99925f9',trie3.root);
    console.log('done3');
    trie3.put('done', 'finished', function(){
    
      assert.equal('409cff4d820b394ed3fb1cd4497bdd19ffa68d30ae34157337a7043c94a3e8cb',trie3.root);
      console.log('done4');
    });
  });
});

var db4 = levelup('./testdb4');
var trie4 = new Trie(db4);
var g = new Buffer('8a40bfaa73256b60764c1bf40675a99083efb075', 'hex');
var j = new Buffer('e6716f9544a56c530d868e4bfbacb172315bdead', 'hex');
var v = new Buffer('1e12515ce3e0f817a4ddef9ca55788a1d66bd2df', 'hex');
var a = new Buffer('1a26338f0d905e295fccb71fa9ea849ffa12aaf4', 'hex');
var hash = new Sha3.SHA3Hash(256);
var stateRoot = new Buffer(32);
stateRoot.fill(0);
var startAmount = ((bignum(1)).shiftLeft(200)).toBuffer();
var account = [startAmount, 0,stateRoot ,new Buffer(hash.digest('hex'), 'hex') ];
rlpAccount = rlp.encode(account);
cppRlp = 'f85e9a010000000000000000000000000000000000000000000000000080a00000000000000000000000000000000000000000000000000000000000000000a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';

assert.equal(cppRlp, rlpAccount.toString('hex'));
//console.log(rlpAccount.toString('hex'));

trie4.put( g, rlpAccount, function(){
  trie4.put(j, rlpAccount , function(){
    trie4.put(v, rlpAccount, function(){
      trie4.put(a, rlpAccount, function(){
        console.log(trie4.root);
      
      });
    });
  });
});
