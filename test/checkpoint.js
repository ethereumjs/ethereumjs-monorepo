const tape = require('tape')
const Trie = require('../src/checkpointTrie')

tape('testing checkpoints', function (tester) {
  let trie, preRoot, postRoot, trieCopy
  const it = tester.test

  it('setup', function (t) {
    trie = new Trie()
    trie.put('do', 'verb', function () {
      trie.put('doge', 'coin', function () {
        preRoot = trie.root.toString('hex')
        t.end()
      })
    })
  })

  it('should copy trie and get value before checkpoint', function (t) {
    trieCopy = trie.copy()
    t.equal(trieCopy.root.toString('hex'), preRoot)
    trieCopy.get('do', function (err, res) {
      t.error(err)
      t.ok(Buffer.from('verb').equals(res))
      t.end()
    })
  })

  it('should create a checkpoint', function (t) {
    trie.checkpoint()
    t.end()
  })

  it('should save to the cache', function (t) {
    trie.put('test', 'something', function () {
      trie.put('love', 'emotion', function () {
        postRoot = trie.root.toString('hex')
        t.end()
      })
    })
  })

  it('should get values from before checkpoint', function (t) {
    trie.get('doge', function (err, res) {
      t.error(err)
      t.ok(Buffer.from('coin').equals(res))
      t.end()
    })
  })

  it('should get values from cache', function (t) {
    trie.get('love', function (err, res) {
      t.error(err)
      t.ok(Buffer.from('emotion').equals(res))
      t.end()
    })
  })

  it('should copy trie and get upstream and cache values after checkpoint', function (t) {
    trieCopy = trie.copy()
    t.equal(trieCopy.root.toString('hex'), postRoot)
    t.equal(trieCopy._checkpoints.length, 1)
    t.ok(trieCopy.isCheckpoint)
    trieCopy.get('do', function (err, res) {
      t.error(err)
      t.ok(Buffer.from('verb').equals(res))
      trieCopy.get('love', function (err, res) {
        t.error(err)
        t.ok(Buffer.from('emotion').equals(res))
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
    trie.get('love', function (err, res) {
      t.error(err)
      t.notOk(res)
      t.end()
    })
  })

  it('should commit a checkpoint', function (t) {
    trie.checkpoint()
    trie.put('test', 'something', function () {
      trie.put('love', 'emotion', function () {
        trie.commit(function () {
          t.equal(trie.isCheckpoint, false)
          t.equal(trie.root.toString('hex'), postRoot)
          t.end()
        })
      })
    })
  })

  it('should get new values after commit', function (t) {
    trie.get('love', function (err, res) {
      t.error(err)
      t.ok(Buffer.from('emotion').equals(res))
      t.end()
    })
  })

  it('should commit a nested checkpoint', function (t) {
    trie.checkpoint()
    var root
    trie.put('test', 'something else', function () {
      root = trie.root
      trie.checkpoint()
      trie.put('the feels', 'emotion', function () {
        trie.revert()
        trie.commit(function () {
          t.equal(trie.isCheckpoint, false)
          t.equal(trie.root.toString('hex'), root.toString('hex'))
          t.end()
        })
      })
    })
  })
})
