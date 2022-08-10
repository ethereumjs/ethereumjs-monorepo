// Example 2b - Creating and looking up a branch node

const { Trie } = require('../dist') // We import the library required to create a basic Merkle Patricia Tree

const trie = new Trie() // We create an empty Merkle Patricia Tree

async function test() {
  // Notice how similar the following keys are
  console.log(Buffer.from('testKey'))
  console.log(Buffer.from('testKey0'))
  console.log(Buffer.from('testKeyA'))

  // Add a key-value pair to the trie for each of them
  await trie.put(Buffer.from('testKey'), Buffer.from('testValue'))
  await trie.put(Buffer.from('testKey0'), Buffer.from('testValue0'))
  await trie.put(Buffer.from('testKeyA'), Buffer.from('testValueA'))

  const node1 = await trie.findPath(Buffer.from('testKey')) // We retrieve the node at the "branching" off of the keys
  console.log('Node 1: ', node1.node) // A branch node! We can see that it contains 16 branches and a value.

  console.log('Node 1 value: ', node1.node._value) // The branch node's value
  console.log('Node 1 branches: ', node1.node._branches) // All of its branches are empty, except at index 4 (corresponding to hex value 3).

  console.log('Value of branch at index 3: ', node1.node._branches[3][1].toString())
  console.log('Value of branch at index 4: ', node1.node._branches[4][1].toString())

  const node2 = await trie.findPath(Buffer.from('testKe')) // We retrieve the node at the "branching" off of the keys
  console.log('Node 2: ', node2.node)
}

test()
