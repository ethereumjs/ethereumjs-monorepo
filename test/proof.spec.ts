import * as tape from 'tape'
import * as async from 'async'
const Trie = require('../dist/index').CheckpointTrie
import { CheckpointTrie } from '../dist/checkpointTrie'

tape('simple merkle proofs generation and verification', function (tester) {
  var it = tester.test
  it('create a merkle proof and verify it', function (t) {
    var trie = new Trie() as CheckpointTrie

    async.series(
      [
        function (cb) {
          trie.put(
            Buffer.from('key1aa'),
            Buffer.from('0123456789012345678901234567890123456789xx'),
            cb,
          )
        },
        function (cb) {
          trie.put(Buffer.from('key2bb'), Buffer.from('aval2'), cb)
        },
        function (cb) {
          trie.put(Buffer.from('key3cc'), Buffer.from('aval3'), cb)
        },
        function (cb) {
          CheckpointTrie.prove(trie, Buffer.from('key2bb'), function (err, prove) {
            if (err) return cb(err)
            CheckpointTrie.verifyProof(trie.root, Buffer.from('key2bb'), prove!, function (
              err,
              val,
            ) {
              if (err) return cb(err)
              t.equal(val!.toString('utf8'), 'aval2')
              cb()
            })
          })
        },
        function (cb) {
          CheckpointTrie.prove(trie, Buffer.from('key1aa'), function (err, prove) {
            if (err) return cb(err)
            CheckpointTrie.verifyProof(trie.root, Buffer.from('key1aa'), prove!, function (
              err,
              val,
            ) {
              if (err) return cb(err)
              t.equal(val!.toString('utf8'), '0123456789012345678901234567890123456789xx')
              cb()
            })
          })
        },
        function (cb) {
          CheckpointTrie.prove(trie, Buffer.from('key2bb'), function (err, prove) {
            t.equal(err, null, 'Path to key2 should create valid proof of absence')
            if (err) return cb(err)
            CheckpointTrie.verifyProof(trie.root, Buffer.from('key2'), prove!, function (err, val) {
              // In this case, the proof _happens_ to contain enough nodes to prove `key2` because
              // traversing into `key22` would touch all the same nodes as traversing into `key2`
              t.equal(val, null, 'Expected value at a random key to be null')
              t.equal(err, null, 'Path to key2 should show a null value')
              cb()
            })
          })
        },
        function (cb) {
          let myKey = Buffer.from('anyrandomkey')
          CheckpointTrie.prove(trie, myKey, function (err, prove) {
            if (err) return cb(err)
            CheckpointTrie.verifyProof(trie.root, myKey, prove!, function (err, val) {
              t.equal(val, null, 'Expected value to be null')
              t.equal(err, null, err ? err.toString() : undefined)
              cb()
            })
          })
        },
        function (cb) {
          let myKey = Buffer.from('anothergarbagekey') // should generate a valid proof of null
          CheckpointTrie.prove(trie, myKey, function (err, prove) {
            if (err) return cb(err)
            prove!.push(Buffer.from('123456')) // extra nodes are just ignored
            CheckpointTrie.verifyProof(trie.root, myKey, prove!, function (err, val) {
              t.equal(val, null, 'Expected value to be null')
              t.equal(err, null, err ? err.toString() : undefined)
              cb()
            })
          })
        },
        function (cb) {
          trie.put(Buffer.from('another'), Buffer.from('3498h4riuhgwe'), cb)
        },
        function (cb) {
          // to throw an error we need to request proof for one key
          CheckpointTrie.prove(trie, Buffer.from('another'), function (err, prove) {
            if (err) return cb(err)
            // and try to use that proof on another key
            CheckpointTrie.verifyProof(trie.root, Buffer.from('key1aa'), prove!, function (
              err,
              val,
            ) {
              t.equal(val, null, 'Expected value: to be null ')
              // this proof would be insignificant to prove `key1aa`
              t.notEqual(err, null, 'Expected error: Missing node in DB')
              t.notEqual(err, undefined, 'Expected error: Missing node in DB')
              cb()
            })
          })
        },
      ],
      function (err) {
        t.end(err)
      },
    )
  })

  it('create a merkle proof and verify it with a single long key', function (t) {
    var trie = new Trie()

    async.series(
      [
        function (cb) {
          trie.put(
            Buffer.from('key1aa'),
            Buffer.from('0123456789012345678901234567890123456789xx'),
            cb,
          )
        },
        function (cb) {
          CheckpointTrie.prove(trie, Buffer.from('key1aa'), function (err, prove) {
            if (err) return cb(err)
            CheckpointTrie.verifyProof(trie.root, Buffer.from('key1aa'), prove!, function (
              err,
              val,
            ) {
              if (err) return cb(err)
              t.equal(val!.toString('utf8'), '0123456789012345678901234567890123456789xx')
              cb()
            })
          })
        },
      ],
      function (err) {
        t.end(err)
      },
    )
  })

  it('create a merkle proof and verify it with a single short key', function (t) {
    var trie = new Trie()

    async.series(
      [
        function (cb) {
          trie.put(Buffer.from('key1aa'), Buffer.from('01234'), cb)
        },
        function (cb) {
          CheckpointTrie.prove(trie, Buffer.from('key1aa'), function (err, prove) {
            if (err) return cb(err)
            CheckpointTrie.verifyProof(trie.root, Buffer.from('key1aa'), prove!, function (
              err,
              val,
            ) {
              if (err) return cb(err)
              t.equal(val!.toString('utf8'), '01234')
              cb()
            })
          })
        },
      ],
      function (err) {
        t.end(err)
      },
    )
  })

  it('create a merkle proof and verify it with keys in the middle', function (t) {
    var trie = new Trie()

    async.series(
      [
        function (cb) {
          trie.put(
            Buffer.from('key1aa'),
            Buffer.from('0123456789012345678901234567890123456789xxx'),
            cb,
          )
        },
        function (cb) {
          trie.put(
            Buffer.from('key1'),
            Buffer.from('0123456789012345678901234567890123456789Very_Long'),
            cb,
          )
        },
        function (cb) {
          trie.put(Buffer.from('key2bb'), Buffer.from('aval3'), cb)
        },
        function (cb) {
          trie.put(Buffer.from('key2'), Buffer.from('short'), cb)
        },
        function (cb) {
          trie.put(Buffer.from('key3cc'), Buffer.from('aval3'), cb)
        },
        function (cb) {
          trie.put(Buffer.from('key3'), Buffer.from('1234567890123456789012345678901'), cb)
        },
        function (cb) {
          CheckpointTrie.prove(trie, Buffer.from('key1'), function (err, prove) {
            if (err) return cb(err)
            CheckpointTrie.verifyProof(trie.root, Buffer.from('key1'), prove!, function (err, val) {
              if (err) return cb(err)
              t.equal(val!.toString('utf8'), '0123456789012345678901234567890123456789Very_Long')
              cb()
            })
          })
        },
        function (cb) {
          CheckpointTrie.prove(trie, Buffer.from('key2'), function (err, prove) {
            if (err) return cb(err)
            CheckpointTrie.verifyProof(trie.root, Buffer.from('key2'), prove!, function (err, val) {
              if (err) return cb(err)
              t.equal(val!.toString('utf8'), 'short')
              cb()
            })
          })
        },
        function (cb) {
          CheckpointTrie.prove(trie, Buffer.from('key3'), function (err, prove) {
            if (err) return cb(err)
            CheckpointTrie.verifyProof(trie.root, Buffer.from('key3'), prove!, function (err, val) {
              if (err) return cb(err)
              t.equal(val!.toString('utf8'), '1234567890123456789012345678901')
              cb()
            })
          })
        },
      ],
      function (err) {
        t.end(err)
      },
    )
  })

  it('should succeed with a simple embedded extension-branch', function (t) {
    var trie = new Trie()

    async.series(
      [
        (cb) => {
          trie.put(Buffer.from('a'), Buffer.from('a'), cb)
        },
        (cb) => {
          trie.put(Buffer.from('b'), Buffer.from('b'), cb)
        },
        (cb) => {
          trie.put(Buffer.from('c'), Buffer.from('c'), cb)
        },
        (cb) => {
          CheckpointTrie.prove(trie, Buffer.from('a'), function (err, prove) {
            if (err) return cb(err)
            CheckpointTrie.verifyProof(trie.root, Buffer.from('a'), prove!, function (err, val) {
              if (err) return cb(err)
              t.equal(val!.toString('utf8'), 'a')
              cb()
            })
          })
        },
        (cb) => {
          CheckpointTrie.prove(trie, Buffer.from('b'), function (err, prove) {
            if (err) return cb(err)
            CheckpointTrie.verifyProof(trie.root, Buffer.from('b'), prove!, function (err, val) {
              if (err) return cb(err)
              t.equal(val!.toString('utf8'), 'b')
              cb()
            })
          })
        },
        (cb) => {
          CheckpointTrie.prove(trie, Buffer.from('c'), function (err, prove) {
            if (err) return cb(err)
            CheckpointTrie.verifyProof(trie.root, Buffer.from('c'), prove!, function (err, val) {
              if (err) return cb(err)
              t.equal(val!.toString('utf8'), 'c')
              cb()
            })
          })
        },
      ],
      function (err) {
        t.end(err)
      },
    )
  })
})
