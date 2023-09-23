// Example 2a - Creating and looking up a null node

const { Trie } = require('../../dist/cjs')
const { utf8ToBytes } = require('../../../util/dist/cjs')

const trie = new Trie() // We create an empty Merkle Patricia Tree

async function test() {
  const node1 = await trie.findPath(utf8ToBytes('testKey')) // We attempt to retrieve the node using our key "testKey"
  console.log('Node 1: ', node1.node) // null
}

test()

/*
Result:
Node 1:  null
*/
