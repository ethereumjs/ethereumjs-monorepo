// Example 2c - Creating and looking up a leaf node

const { Trie } = require('../dist') // We import the library required to create a basic Merkle Patricia Tree

const trie = new Trie() // We create an empty Merkle Patricia Tree

async function test() {
  await trie.put(Buffer.from('testKey'), Buffer.from('testValue'))
  await trie.put(
    Buffer.from('testKey087234h928347rfh923476h9f28376hrf29'),
    Buffer.from('testValue0')
  )
  await trie.put(Buffer.from('testKeyA'), Buffer.from('testValueA'))

  const node1 = await trie.findPath(Buffer.from('testKey')) // We retrieve one of the leaf nodes
  console.log('Node 1: ', node1.node) // A leaf node! We can see that it contains 2 items: the encodedPath and the value
  console.log('Node 1 value: ', node1.node._value.toString()) // The leaf node's value
}

test()
