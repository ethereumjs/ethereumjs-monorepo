import * as tape from 'tape'
import * as async from 'async'
const Trie = require('../dist/secure').SecureTrie
import { SecureTrie } from '../dist/secure'

tape('SecureTrie', function (t) {
  const trie = new Trie() as SecureTrie
  const k = Buffer.from('foo')
  const v = Buffer.from('bar')

  t.test('put and get value', function (st) {
    trie.put(k, v, function () {
      trie.get(k, function (err, res) {
        st.error(err)
        st.ok(v.equals(res!))
        st.end()
      })
    })
  })

  t.test('copy trie', function (st) {
    const t = trie.copy()
    t.get(k, function (err, res) {
      st.error(err)
      st.ok(v.equals(res!))
      st.end()
    })
  })
})

tape('SecureTrie proof', function (t) {
  t.test('create a merkle proof and verify it with a single short key', function (st) {
    const trie = new Trie()

    async.series(
      [
        function (cb) {
          trie.put(Buffer.from('key1aa'), Buffer.from('01234'), cb)
        },
        function (cb) {
          SecureTrie.prove(trie, Buffer.from('key1aa'), function (err, prove) {
            if (err) return cb(err)
            SecureTrie.verifyProof(trie.root, Buffer.from('key1aa'), prove!, function (err, val) {
              if (err) return cb(err)
              st.equal(val!.toString('utf8'), '01234')
              cb()
            })
          })
        },
      ],
      function (err) {
        st.end(err)
      },
    )
  })
})

tape('secure tests', function (it) {
  let trie = new Trie() as SecureTrie
  const jsonTests = require('./fixtures/trietest_secureTrie.json').tests

  it.test('empty values', function (t) {
    async.eachSeries(
      jsonTests.emptyValues.in,
      function (row: any, cb) {
        trie.put(
          Buffer.from(row[0]),
          row[1] ? Buffer.from(row[1]) : ((null as unknown) as Buffer),
          cb,
        )
      },
      function (err) {
        t.equal('0x' + trie.root.toString('hex'), jsonTests.emptyValues.root)
        t.end(err)
      },
    )
  })

  it.test('branchingTests', function (t) {
    trie = new Trie()
    async.eachSeries(
      jsonTests.branchingTests.in,
      function (row: any, cb) {
        trie.put(
          Buffer.from(row[0]),
          row[1] ? Buffer.from(row[1]) : ((null as unknown) as Buffer),
          cb,
        )
      },
      function () {
        t.equal('0x' + trie.root.toString('hex'), jsonTests.branchingTests.root)
        t.end()
      },
    )
  })

  it.test('jeff', function (t) {
    async.eachSeries(
      jsonTests.jeff.in,
      function (row: any, cb) {
        var val = row[1]
        if (val) {
          val = Buffer.from(row[1].slice(2), 'hex')
        }

        trie.put(Buffer.from(row[0].slice(2), 'hex'), val, cb)
      },
      function () {
        t.equal('0x' + trie.root.toString('hex'), jsonTests.jeff.root.toString('hex'))
        t.end()
      },
    )
  })
})
