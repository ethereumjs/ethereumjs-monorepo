// Example 2a - Creating and looking up a null node

const { utf8ToBytes } = require('@ethereumjs/util')

const { Trie } = require('../../dist/cjs/index.js')

const trie = new Trie()

async function test() {
  const node1 = await trie.findPath(utf8ToBytes('testKey')) // We attempt to retrieve the node using our key "testKey"
  console.log('Node 1: ', node1.node) // null
}

void test()

/*
Result:
Node 1:  null
*/
