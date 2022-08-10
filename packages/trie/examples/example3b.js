// Example 3b - Verification using a hash

const { Trie } = require('../dist') // We import the library required to create a basic Merkle Patricia Tree
const trie1 = new Trie()
const trie2 = new Trie()

async function test() {
  // We populate the tree to create an extension node.

  await trie1.put(Buffer.from('testKey'), Buffer.from('testValue'))
  await trie1.put(Buffer.from('testKey0001'), Buffer.from('testValue1'))
  await trie1.put(Buffer.from('testKey000A'), Buffer.from('testValueA'))

  await trie2.put(Buffer.from('testKey'), Buffer.from('testValue'))
  await trie2.put(Buffer.from('testKey0001'), Buffer.from('testValue1'))
  await trie2.put(Buffer.from('testKey000z'), Buffer.from('testValuez'))

  const temp1 = await trie1.findPath(Buffer.from('testKey'))
  const temp2 = await trie2.findPath(Buffer.from('testKey'))

  const node1 = await trie1.lookupNode(Buffer.from(temp1.node._branches[3]))
  const node2 = await trie2.lookupNode(Buffer.from(temp2.node._branches[3]))

  console.log('Branch node 1 hash: ', node1._value)
  console.log('Branch node 2 hash: ', node2._value)

  root1 = trie1.root
  root2 = trie2.root
  console.log(root1)
  console.log(root2)
}
test()
