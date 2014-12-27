var Trie = require('../index.js'),
  async = require('async'),
  rlp = require('rlp'),
  Sha3 = require('sha3'),
  assert = require('assert'),
  jsonTests = require('ethereum-tests').trieTests;

describe('simple save and retrive', function () {
  var trie = new Trie();

  it('should not crash if given a non-existant root', function (done) {
    var root = new Buffer('3f4399b08efe68945c1cf90ffe85bbe3ce978959da753f9e649f034015b8817d', 'hex');
    var trie11 = new Trie(null, root);

    trie11.get('test', function (err, value) {
      assert.equal(value, null);
      done();
    });
  });

  it('save a value', function (done) {
    trie.put('test', 'one', function () {
      done();
    });
  });

  it('should get a value', function (done) {
    trie.get('test', function (err, value) {
      assert.equal(value.toString(), 'one');
      done();
    });
  });

  it('should update a value', function (done) {
    trie.put('test', 'two', function () {
      trie.get('test', function (err, value) {
        assert.equal(value.toString(), 'two');
        done();
      });
    });
  });


  it('should delete a value', function (done) {
    trie.del('test', function (stack) {
      trie.get('test', function (err, value) {
        console.log(value);
        done();
      });
    });
  });

  it('should recreate a value', function (done) {
    trie.put('test', 'one', function () {
      done();
    });
  });

  it('should get updated a value', function (done) {
    trie.get('test', function (err, value) {
      assert.equal(value.toString(), 'one');
      done();
    });
  });

  it('should create a branch here', function (done) {
    trie.put('doge', 'coin', function () {
      assert.equal('de8a34a8c1d558682eae1528b47523a483dd8685d6db14b291451a66066bf0fc', trie.root.toString('hex'));
      done();
    });
  });

  it('should get a value that is in a branch', function (done) {
    trie.get('doge', function (err, value) {
      assert.equal(value.toString(), 'coin');
      done();
    });
  });

  it('should delete from a branch', function (done) {
    trie.del('doge', function (err, stack) {
      trie.get('doge', function (err, value) {
        assert.equal(value, null);
        done();
      });
    });
  });

});

describe('storing longer values', function () {
  var trie2 = new Trie();

  var longString = 'this will be a really really really long value';
  var longStringRoot = 'b173e2db29e79c78963cff5196f8a983fbe0171388972106b114ef7f5c24dfa3';

  it('should store a longer string', function (done) {
    trie2.put('done', longString, function (err, value) {
      trie2.put('doge', 'coin', function (err, value) {
        assert.equal(longStringRoot, trie2.root.toString('hex'));
        done();
      });
    });
  });

  it('should retreive a longer value', function (done) {
    trie2.get('done', function (err, value) {
      assert.equal(value.toString(), longString);
      done();
    });
  });

  it('should when being modiefied delete the old value', function (done) {
    trie2.put('done', 'test', function () {
      done();
    });
  });

});

describe('testing Extentions and branches', function () {
  var trie3 = new Trie();

  it('should store a value', function (done) {
    trie3.put('doge', 'coin', function () {
      done();
    });
  });

  it('should create extention to store this value', function (done) {
    trie3.put('do', 'verb', function () {
      assert.equal('f803dfcb7e8f1afd45e88eedb4699a7138d6c07b71243d9ae9bff720c99925f9', trie3.root.toString('hex'));
      done();
    });
  });

  it('should store this value under the extention ', function (done) {
    trie3.put('done', 'finished', function () {
      assert.equal('409cff4d820b394ed3fb1cd4497bdd19ffa68d30ae34157337a7043c94a3e8cb', trie3.root.toString('hex'));
      done();
    });
  });

});

describe('testing Extentions and branches - reverse', function () {
  var trie3 = new Trie();

  it('should create extention to store this value', function (done) {
    trie3.put('do', 'verb', function () {
      done();
    });
  });

  it('should store a value', function (done) {
    trie3.put('doge', 'coin', function () {
      done();
    });
  });


  it('should store this value under the extention ', function (done) {
    trie3.put('done', 'finished', function () {
      assert.equal('409cff4d820b394ed3fb1cd4497bdd19ffa68d30ae34157337a7043c94a3e8cb', trie3.root.toString('hex'));
      done();
    });
  });

});

describe('testing deletions cases', function () {
  var trie3 = new Trie();

  it('should delete from a branch->branch-branch', function (done) {
    async.parallel([
      async.apply(trie3.put.bind(trie3), new Buffer([11, 11, 11]), 'first'),
      async.apply(trie3.put.bind(trie3), new Buffer([12, 22, 22]), 'create the first branch'),
      async.apply(trie3.put.bind(trie3), new Buffer([12, 34, 44]), 'create the last branch')
    ], function () {
      trie3.del(new Buffer([12, 22, 22]), function () {
        trie3.get(new Buffer([12, 22, 22]), function (err, val) {
          assert.equal(null, val);

          trie3 = new Trie();
          done();
        });
      });
    });
  });

  it('should delete from a branch->branch-extention', function (done) {
    async.parallel([
      async.apply(trie3.put.bind(trie3), new Buffer([11, 11, 11]), 'first'),
      async.apply(trie3.put.bind(trie3), new Buffer([12, 22, 22]), 'create the first branch'),
      async.apply(trie3.put.bind(trie3), new Buffer([12, 33, 33]), 'create the middle branch'),
      async.apply(trie3.put.bind(trie3), new Buffer([12, 33, 44]), 'create the last branch')
    ], function () {
      trie3.del(new Buffer([12, 22, 22]), function () {
        trie3.get(new Buffer([12, 22, 22]), function (err, val) {
          assert.equal(null, val);
          done();
        });
      });
    });
  });

  it('should delete from a extention->branch-extention', function (done) {
    trie3.put(new Buffer([11, 11, 11]), 'first', function () {
      //create the top branch
      trie3.put(new Buffer([12, 22, 22]), 'create the first branch', function () {
        //crete the middle branch
        trie3.put(new Buffer([12, 33, 33]), 'create the middle branch', function () {
          trie3.put(new Buffer([12, 33, 44]), 'create the last branch', function () {
            //delete the middle branch
            trie3.del(new Buffer([11, 11, 11]), function () {
              trie3.get(new Buffer([11, 11, 11]), function (err, val) {
                assert.equal(null, val);
                done();
              });
            });
          });
        });
      });
    });
  });

  it('should delete from a extention->branch-branch', function (done) {
    trie3.put(new Buffer([11, 11, 11]), 'first', function () {
      //create the top branch
      trie3.put(new Buffer([12, 22, 22]), 'create the first branch', function () {
        //crete the middle branch
        trie3.put(new Buffer([12, 33, 33]), 'create the middle branch', function () {
          trie3.put(new Buffer([12, 34, 44]), 'create the last branch', function () {
            //delete the middle branch
            trie3.del(new Buffer([11, 11, 11]), function () {
              trie3.get(new Buffer([11, 11, 11]), function (err, val) {
                assert.equal(null, val);
                done();
              });
            });
          });
        });
      });
    });
  });
});

describe('testing checkpoints', function () {

  var trie,
    preRoot,
    postRoot;

  before(function (done) {
    trie = new Trie();
    trie.put('do', 'verb', function () {
      trie.put('doge', 'coin', function () {
        preRoot = trie.root.toString('hex');
        done();
      });
    });
  });

  it('should create a checkpoint', function (done) {
    trie.checkpoint();
    done();
  });

  it('should save to the cache', function (done) {
    trie.put('test', 'something', function () {
      trie.put('love', 'emotion', function () {
        postRoot = trie.root.toString('hex');
        done();
      });
    });
  });

  it('should revert to the orginal root', function (done) {
    assert(trie.isCheckpoint === true);
    trie.revert(function(){
      assert(trie.root.toString('hex') === preRoot);
      assert(trie.isCheckpoint === false);
      done();
    });
  });

  it('should commit a checkpoint', function (done) {
    trie.checkpoint();
    trie.put('test', 'something', function () {
      trie.put('love', 'emotion', function () {
        trie.commit(function () {
          assert(trie.isCheckpoint === false);
          assert(trie.root.toString('hex') === postRoot);
          done();
        });
      });
    });
  });

  it('should commit a nested checkpoint', function (done) {
    trie.checkpoint();
    var root;
    trie.put('test', 'something else', function () {
      root = trie.root;
      trie.checkpoint();
      trie.put('the feels', 'emotion', function () {
        trie.revert();
        trie.commit(function () {
          assert(trie.isCheckpoint === false);
          assert(trie.root.toString('hex') === root.toString('hex'));
          done();
        });
      });
    });
  });
});

describe('a complex insert and delete', function(){

  it('should  insert lots of stuff and delete it', function(done){
  
    var trie = new Trie();
    var hashes = [
      "04110d816c380812a427968ece99b1c963dfbce6",
      "095e7baea6a6c7c4c2dfeb977efac326af552d87",
      "0a517d755cebbf66312b30fff713666a9cb917e0",
      "24dd378f51adc67a50e339e8031fe9bd4aafab36",
      "293f982d000532a7861ab122bdc4bbfd26bf9030",
      "2cf5732f017b0cf1b1f13a1478e10239716bf6b5",
      "31c640b92c21a1f1465c91070b4b3b4d6854195f",
      "37f998764813b136ddf5a754f34063fd03065e36",
      "37fa399a749c121f8a15ce77e3d9f9bec8020d7a",
      "4f36659fa632310b6ec438dea4085b522a2dd077",
      "62c01474f089b07dae603491675dc5b5748f7049",
      "729af7294be595a0efd7d891c9e51f89c07950c7",
      "83e3e5a16d3b696a0314b30b2534804dd5e11197",
      "8703df2417e0d7c59d063caa9583cb10a4d20532",
      "8dffcd74e5b5923512916c6a64b502689cfa65e1",
      "95a4d7cccb5204733874fa87285a176fe1e9e240",
      "99b2fcba8120bedd048fe79f5262a6690ed38c39",
      "a4202b8b8afd5354e3e40a219bdc17f6001bf2cf",
      "a94f5374fce5edbc8e2a8697c15331677e6ebf0b",
      "a9647f4a0a14042d91dc33c0328030a7157c93ae",
      "aa6cffe5185732689c18f37a7f86170cb7304c2a",
      "aae4a2e3c51c04606dcb3723456e58f3ed214f45",
      "c37a43e940dfb5baf581a0b82b351d48305fc885",
      "d2571607e241ecf590ed94b12d87c94babe36db6",
      "f735071cbee190d76b704ce68384fc21e389fbe7"
    ];

    var toDel = [
      "04110d816c380812a427968ece99b1c963dfbce6",
      "095e7baea6a6c7c4c2dfeb977efac326af552d87",
      "0a517d755cebbf66312b30fff713666a9cb917e0",
      "24dd378f51adc67a50e339e8031fe9bd4aafab36",
      "293f982d000532a7861ab122bdc4bbfd26bf9030",
      "2cf5732f017b0cf1b1f13a1478e10239716bf6b5",
      "31c640b92c21a1f1465c91070b4b3b4d6854195f",
      "37f998764813b136ddf5a754f34063fd03065e36",
      "37fa399a749c121f8a15ce77e3d9f9bec8020d7a",
      "4f36659fa632310b6ec438dea4085b522a2dd077",
      "62c01474f089b07dae603491675dc5b5748f7049",
      "729af7294be595a0efd7d891c9e51f89c07950c7",
      "83e3e5a16d3b696a0314b30b2534804dd5e11197",
      "8703df2417e0d7c59d063caa9583cb10a4d20532",
      "8dffcd74e5b5923512916c6a64b502689cfa65e1",
      "95a4d7cccb5204733874fa87285a176fe1e9e240",
      "99b2fcba8120bedd048fe79f5262a6690ed38c39",
      "a4202b8b8afd5354e3e40a219bdc17f6001bf2cf",
      "a94f5374fce5edbc8e2a8697c15331677e6ebf0b",
      "a9647f4a0a14042d91dc33c0328030a7157c93ae",
      "aa6cffe5185732689c18f37a7f86170cb7304c2a",
      "aae4a2e3c51c04606dcb3723456e58f3ed214f45",
      "c37a43e940dfb5baf581a0b82b351d48305fc885",
      "d2571607e241ecf590ed94b12d87c94babe36db6",
      "f735071cbee190d76b704ce68384fc21e389fbe7"
    ];

    var dkey = "e8d8f6e0ec5eef45097350408016116f5e199f0f307be1bfae57e434cc2df12e";

    async.eachSeries(hashes, function(hash, done2) {
      trie.put(new Buffer(hash, 'hex'), 'something', done2);

    }, function() {

      async.eachSeries(toDel, function(hash, done2) {
        trie.del(new Buffer(hash, 'hex'), done2);
      }, function(){
        assert(trie.root.toString('hex') === trie.EMPTY_TRIE_ROOT.toString('hex')) 
        done();
      });
    });
  });

});

describe('it should create the genesis state root from ethereum', function () {

  var trie4 = new Trie(),
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
  var rlpAccount = rlp.encode(account);
  cppRlp = 'f85e9a010000000000000000000000000000000000000000000000000080a00000000000000000000000000000000000000000000000000000000000000000a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';

  var genesisStateRoot = '2f4399b08efe68945c1cf90ffe85bbe3ce978959da753f9e649f034015b8817d';
  assert.equal(cppRlp, rlpAccount.toString('hex'));
  //console.log(rlpAccount.toString('hex'));

  it('shall match the root given unto us by the Master Coder Gav', function (done) {
    trie4.put(g, rlpAccount, function () {
      trie4.put(j, rlpAccount, function () {
        trie4.put(v, rlpAccount, function () {
          trie4.put(a, rlpAccount, function () {
            assert.equal(trie4.root.toString('hex'), genesisStateRoot);
            done();
          });
        });
      });
    });
  });
});

describe('offical tests', function () {
  var testNames,
    trie;

  before(function () {
    testNames = Object.keys(jsonTests.trietest);
    trie = new Trie();
  });

  it('pass all tests', function (done) {
    async.eachSeries(testNames, function (i, done) {
      console.log(i);
      var inputs = jsonTests.trietest[i].in;
      var expect = jsonTests.trietest[i].root;

      async.eachSeries(inputs, function (input, done) {
      
        for(i = 0; i < 2; i++){
          if(input[i] && input[i].slice(0,2) === '0x'){
            input[i] = new Buffer(input[i].slice(2), 'hex');
          }
        }

        trie.put(input[0], input[1], function () {
          done();
        });
      }, function () {

        assert.equal('0x' + trie.root.toString('hex'), expect);
        trie = new Trie();
        done();
      });

    }, function () {
      done();
    });
  });
});

describe('offical tests any order', function () {
  var testNames,
    trie;

  before(function () {
    testNames = Object.keys(jsonTests.trieanyorder);
    trie = new Trie();
  });

  it('pass all tests', function (done) {
    async.eachSeries(testNames, function (i, done) {
      console.log(i);
      var test = jsonTests.trieanyorder[i];
      var keys = Object.keys(test.in);

      async.eachSeries(keys, function (key, done) {
        
        var val = test.in[key];     

        if(key.slice(0,2) === '0x'){
          key = new Buffer(key.slice(2), 'hex');
        }

        if(val && val.slice(0,2) === '0x'){
          val = new Buffer(val.slice(2), 'hex');
        }

        trie.put(key, val, function () {
          done();
        });
      }, function () {
        assert.equal('0x' + trie.root.toString('hex'), test.root);
        trie = new Trie();
        done();
      });

    }, function () {
      done();
    });
  });
});
