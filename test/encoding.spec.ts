import * as tape from 'tape'
const Trie = require('../dist/index').CheckpointTrie
const trie = new Trie()
const trie2 = new Trie()

const hex = 'FF44A3B3'
tape('encoding hexprefixes', function (t) {
  trie.put(Buffer.from(hex, 'hex'), Buffer.from('test'), function () {
    trie2.put('0x' + hex, Buffer.from('test'), function () {
      t.equal(trie.root.toString('hex'), trie2.root.toString('hex'))
      t.end()
    })
  })
})
