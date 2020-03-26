import * as tape from 'tape'
const Trie = require('../dist/checkpointTrie').CheckpointTrie
import { CheckpointTrie } from '../dist/checkpointTrie'

tape('testing checkpoints', function (tester) {
  const it = tester.test

  let trie: CheckpointTrie
  let trieCopy: CheckpointTrie
  let preRoot: String
  let postRoot: String

  it('setup', function (t) {
    trie = new Trie()
    trie.put(Buffer.from('do'), Buffer.from('verb'), function () {
      trie.put(Buffer.from('doge'), Buffer.from('coin'), function () {
        preRoot = trie.root.toString('hex')
        t.end()
      })
    })
  })

  it('should copy trie and get value before checkpoint', function (t) {
    trieCopy = trie.copy()
    t.equal(trieCopy.root.toString('hex'), preRoot)
    trieCopy.get(Buffer.from('do'), function (err, res) {
      t.error(err)
      t.ok(Buffer.from('verb').equals(Buffer.from(res!)))
      t.end()
    })
  })

  it('should create a checkpoint', function (t) {
    trie.checkpoint()
    t.end()
  })

  it('should save to the cache', function (t) {
    trie.put(Buffer.from('test'), Buffer.from('something'), function () {
      trie.put(Buffer.from('love'), Buffer.from('emotion'), function () {
        postRoot = trie.root.toString('hex')
        t.end()
      })
    })
  })

  it('should get values from before checkpoint', function (t) {
    trie.get(Buffer.from('doge'), function (err, res) {
      t.error(err)
      t.ok(Buffer.from('coin').equals(Buffer.from(res!)))
      t.end()
    })
  })

  it('should get values from cache', function (t) {
    trie.get(Buffer.from('love'), function (err, res) {
      t.error(err)
      t.ok(Buffer.from('emotion').equals(Buffer.from(res!)))
      t.end()
    })
  })

  it('should copy trie and get upstream and cache values after checkpoint', function (t) {
    trieCopy = trie.copy()
    t.equal(trieCopy.root.toString('hex'), postRoot)
    t.equal(trieCopy._checkpoints.length, 1)
    t.ok(trieCopy.isCheckpoint)
    trieCopy.get(Buffer.from('do'), function (err, res) {
      t.error(err)
      t.ok(Buffer.from('verb').equals(Buffer.from(res!)))
      trieCopy.get(Buffer.from('love'), function (err, res) {
        t.error(err)
        t.ok(Buffer.from('emotion').equals(Buffer.from(res!)))
        t.end()
      })
    })
  })

  it('should revert to the orginal root', function (t) {
    t.equal(trie.isCheckpoint, true)
    trie.revert(function () {
      t.equal(trie.root.toString('hex'), preRoot)
      t.equal(trie.isCheckpoint, false)
      t.end()
    })
  })

  it('should not get values from cache after revert', function (t) {
    trie.get(Buffer.from('love'), function (err, res) {
      t.error(err)
      t.notOk(res)
      t.end()
    })
  })

  it('should commit a checkpoint', function (t) {
    trie.checkpoint()
    trie.put(Buffer.from('test'), Buffer.from('something'), function () {
      trie.put(Buffer.from('love'), Buffer.from('emotion'), function () {
        trie.commit(function () {
          t.equal(trie.isCheckpoint, false)
          t.equal(trie.root.toString('hex'), postRoot)
          t.end()
        })
      })
    })
  })

  it('should get new values after commit', function (t) {
    trie.get(Buffer.from('love'), function (err, res) {
      t.error(err)
      t.ok(Buffer.from('emotion').equals(Buffer.from(res!)))
      t.end()
    })
  })

  it('should commit a nested checkpoint', function (t) {
    trie.checkpoint()
    let root: Buffer
    trie.put(Buffer.from('test'), Buffer.from('something else'), function () {
      root = trie.root
      trie.checkpoint()
      trie.put(Buffer.from('the feels'), Buffer.from('emotion'), function () {
        trie.revert(() => {})
        trie.commit(function () {
          t.equal(trie.isCheckpoint, false)
          t.equal(trie.root.toString('hex'), root.toString('hex'))
          t.end()
        })
      })
    })
  })
})
