// Example 2c - Creating and looking up a leaf node

const { bytesToUtf8, utf8ToBytes } = require('@ethereumjs/util')

const { Trie } = require('../../dist/cjs/index.js')

const trie = new Trie()

async function test() {
  await trie.put(utf8ToBytes('testKey'), utf8ToBytes('testValue'))
  await trie.put(utf8ToBytes('testKey0'), utf8ToBytes('testValue0'))

  const node1 = await trie.findPath(utf8ToBytes('testKey0')) // We retrieve one of the leaf nodes
  console.log('Node 1: ', node1.node) // A leaf node! We can see that it contains 2 items: the nibbles and the value
  console.log('Node 1 value: ', bytesToUtf8(node1.node._value)) // The leaf node's value
}

void test()
