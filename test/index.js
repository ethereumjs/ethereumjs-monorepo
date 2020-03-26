import * as tape from 'tape'
import * as async from 'async'
import * as rlp from 'rlp'
import * as ethUtil from 'ethereumjs-util'
const Trie = require('../dist/index').CheckpointTrie
import { CheckpointTrie } from '../dist/checkpointTrie'

tape('simple save and retrive', function (tester) {
  var it = tester.test

  it('should not crash if given a non-existant root', function (t) {
    var root = Buffer.from(
      '3f4399b08efe68945c1cf90ffe85bbe3ce978959da753f9e649f034015b8817d',
      'hex',
    )
    var trie = new Trie(null, root) as CheckpointTrie

    trie.get(Buffer.from('test'), function (err, value) {
      t.equal(value, null)
      t.notEqual(err, null)
      t.end()
    })
  })

  var trie = new Trie() as CheckpointTrie

  it('save a value', function (t) {
    trie.put(Buffer.from('test'), Buffer.from('one'), t.end)
  })

  it('should get a value', function (t) {
    trie.get(Buffer.from('test'), function (err, value) {
      t.equal(value!.toString(), 'one')
      t.end(err)
    })
  })

  it('should update a value', function (t) {
    trie.put(Buffer.from('test'), Buffer.from('two'), function () {
      trie.get(Buffer.from('test'), function (err, value) {
        t.equal(value!.toString(), 'two')
        t.end(err)
      })
    })
  })

  it('should delete a value', function (t) {
    trie.del(Buffer.from('test'), function (err) {
      trie.get(Buffer.from('test'), function (err, value) {
        t.notok(value)
        t.end(err)
      })
    })
  })

  it('should recreate a value', function (t) {
    trie.put(Buffer.from('test'), Buffer.from('one'), t.end)
  })

  it('should get updated a value', function (t) {
    trie.get(Buffer.from('test'), function (err, value) {
      t.equal(value!.toString(), 'one')
      t.end(err)
    })
  })

  it('should create a branch here', function (t) {
    trie.put(Buffer.from('doge'), Buffer.from('coin'), function () {
      t.equal(
        'de8a34a8c1d558682eae1528b47523a483dd8685d6db14b291451a66066bf0fc',
        trie.root.toString('hex'),
      )
      t.end()
    })
  })

  it('should get a value that is in a branch', function (t) {
    trie.get(Buffer.from('doge'), function (err, value) {
      t.equal(value!.toString(), 'coin')
      t.end(err)
    })
  })

  it('should delete from a branch', function (t) {
    trie.del(Buffer.from('doge'), function (err1) {
      trie.get(Buffer.from('doge'), function (err2, value) {
        t.equal(value, null)
        t.end(err1 || err2)
      })
    })
  })
})

tape('storing longer values', function (tester) {
  var it = tester.test
  var trie = new Trie() as CheckpointTrie
  var longString = 'this will be a really really really long value'
  var longStringRoot = 'b173e2db29e79c78963cff5196f8a983fbe0171388972106b114ef7f5c24dfa3'

  it('should store a longer string', function (t) {
    trie.put(Buffer.from('done'), Buffer.from(longString), function (err1) {
      trie.put(Buffer.from('doge'), Buffer.from('coin'), function (err2) {
        t.equal(longStringRoot, trie.root.toString('hex'))
        t.end(err1 || err2)
      })
    })
  })

  it('should retreive a longer value', function (t) {
    trie.get(Buffer.from('done'), function (err, value) {
      t.equal(value!.toString(), longString)
      t.end(err)
    })
  })

  it('should when being modiefied delete the old value', function (t) {
    trie.put(Buffer.from('done'), Buffer.from('test'), t.end)
  })
})

tape('testing Extentions and branches', function (tester) {
  var trie = new Trie() as CheckpointTrie
  var it = tester.test

  it('should store a value', function (t) {
    trie.put(Buffer.from('doge'), Buffer.from('coin'), t.end)
  })

  it('should create extention to store this value', function (t) {
    trie.put(Buffer.from('do'), Buffer.from('verb'), function () {
      t.equal(
        'f803dfcb7e8f1afd45e88eedb4699a7138d6c07b71243d9ae9bff720c99925f9',
        trie.root.toString('hex'),
      )
      t.end()
    })
  })

  it('should store this value under the extention ', function (t) {
    trie.put(Buffer.from('done'), Buffer.from('finished'), function () {
      t.equal(
        '409cff4d820b394ed3fb1cd4497bdd19ffa68d30ae34157337a7043c94a3e8cb',
        trie.root.toString('hex'),
      )
      t.end()
    })
  })
})

tape('testing Extentions and branches - reverse', function (tester) {
  var it = tester.test
  var trie = new Trie() as CheckpointTrie

  it('should create extention to store this value', function (t) {
    trie.put(Buffer.from('do'), Buffer.from('verb'), t.end)
  })

  it('should store a value', function (t) {
    trie.put(Buffer.from('doge'), Buffer.from('coin'), t.end)
  })

  it('should store this value under the extention ', function (t) {
    trie.put(Buffer.from('done'), Buffer.from('finished'), function () {
      t.equal(
        '409cff4d820b394ed3fb1cd4497bdd19ffa68d30ae34157337a7043c94a3e8cb',
        trie.root.toString('hex'),
      )
      t.end()
    })
  })
})

tape('testing deletions cases', function (tester) {
  var it = tester.test
  var trie = new Trie() as CheckpointTrie

  it('should delete from a branch->branch-branch', function (t) {
    async.parallel(
      [
        async.apply(trie.put.bind(trie), Buffer.from([11, 11, 11]), Buffer.from('first')),
        async.apply(
          trie.put.bind(trie),
          Buffer.from([12, 22, 22]),
          Buffer.from('create the first branch'),
        ),
        async.apply(
          trie.put.bind(trie),
          Buffer.from([12, 34, 44]),
          Buffer.from('create the last branch'),
        ),
      ],
      function () {
        trie.del(Buffer.from([12, 22, 22]), function () {
          trie.get(Buffer.from([12, 22, 22]), function (err, val) {
            t.equal(null, val)
            trie = new Trie() as CheckpointTrie
            t.end(err)
          })
        })
      },
    )
  })

  it('should delete from a branch->branch-extention', function (t) {
    async.parallel(
      [
        async.apply(trie.put.bind(trie), Buffer.from([11, 11, 11]), Buffer.from('first')),
        async.apply(
          trie.put.bind(trie),
          Buffer.from([12, 22, 22]),
          Buffer.from('create the first branch'),
        ),
        async.apply(
          trie.put.bind(trie),
          Buffer.from([12, 33, 33]),
          Buffer.from('create the middle branch'),
        ),
        async.apply(
          trie.put.bind(trie),
          Buffer.from([12, 33, 44]),
          Buffer.from('create the last branch'),
        ),
      ],
      function () {
        trie.del(Buffer.from([12, 22, 22]), function () {
          trie.get(Buffer.from([12, 22, 22]), function (err, val) {
            t.equal(null, val)
            t.end(err)
          })
        })
      },
    )
  })

  it('should delete from a extention->branch-extention', function (t) {
    trie.put(Buffer.from([11, 11, 11]), Buffer.from('first'), function () {
      // create the top branch
      trie.put(Buffer.from([12, 22, 22]), Buffer.from('create the first branch'), function () {
        // crete the middle branch
        trie.put(Buffer.from([12, 33, 33]), Buffer.from('create the middle branch'), function () {
          trie.put(Buffer.from([12, 33, 44]), Buffer.from('create the last branch'), function () {
            // delete the middle branch
            trie.del(Buffer.from([11, 11, 11]), function () {
              trie.get(Buffer.from([11, 11, 11]), function (err, val) {
                t.equal(null, val)
                t.end(err)
              })
            })
          })
        })
      })
    })
  })

  it('should delete from a extention->branch-branch', function (t) {
    trie.put(Buffer.from([11, 11, 11]), Buffer.from('first'), function () {
      // create the top branch
      trie.put(Buffer.from([12, 22, 22]), Buffer.from('create the first branch'), function () {
        // crete the middle branch
        trie.put(Buffer.from([12, 33, 33]), Buffer.from('create the middle branch'), function () {
          trie.put(Buffer.from([12, 34, 44]), Buffer.from('create the last branch'), function () {
            // delete the middle branch
            trie.del(Buffer.from([11, 11, 11]), function () {
              trie.get(Buffer.from([11, 11, 11]), function (err, val) {
                t.equal(null, val)
                t.end(err)
              })
            })
          })
        })
      })
    })
  })
})

tape('it should create the genesis state root from ethereum', function (tester) {
  var it = tester.test
  var trie4 = new Trie() as CheckpointTrie
  var g = Buffer.from('8a40bfaa73256b60764c1bf40675a99083efb075', 'hex')
  var j = Buffer.from('e6716f9544a56c530d868e4bfbacb172315bdead', 'hex')
  var v = Buffer.from('1e12515ce3e0f817a4ddef9ca55788a1d66bd2df', 'hex')
  var a = Buffer.from('1a26338f0d905e295fccb71fa9ea849ffa12aaf4', 'hex')
  var stateRoot = Buffer.alloc(32)

  stateRoot.fill(0)
  var startAmount = Buffer.alloc(26)
  startAmount.fill(0)
  startAmount[0] = 1
  var account = [startAmount, 0, stateRoot, ethUtil.KECCAK256_NULL]
  var rlpAccount = rlp.encode(account)
  var cppRlp =
    'f85e9a010000000000000000000000000000000000000000000000000080a00000000000000000000000000000000000000000000000000000000000000000a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'

  var genesisStateRoot = '2f4399b08efe68945c1cf90ffe85bbe3ce978959da753f9e649f034015b8817d'
  tester.equal(cppRlp, rlpAccount.toString('hex'))

  it('shall match the root', function (t) {
    trie4.put(g, rlpAccount, function () {
      trie4.put(j, rlpAccount, function () {
        trie4.put(v, rlpAccount, function () {
          trie4.put(a, rlpAccount, function () {
            t.equal(trie4.root.toString('hex'), genesisStateRoot)
            t.end()
          })
        })
      })
    })
  })
})
