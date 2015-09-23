var Trie = require('../index.js')
var assert = require('assert')
var trie = new Trie()
var trie2 = new Trie()

var hex = 'FF44A3B3'
describe('encoding', function () {
  it('hexprefixes ', function (done) {
    trie.put(new Buffer(hex, 'hex'), 'test', function () {
      trie2.put('0x' + hex, 'test', function () {
        assert.equal(trie.root.toString('hex'), trie2.root.toString('hex'))
        done()
      })
    })
  })
})
