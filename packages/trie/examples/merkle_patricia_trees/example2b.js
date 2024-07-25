// Example 2b - Creating and looking up a branch node

const { bytesToHex, bytesToUtf8, utf8ToBytes } = require('@ethereumjs/util')

const { Trie } = require('../../dist/cjs/index.js')

const trie = new Trie()

async function test() {
  // Notice how similar the following keys are
  console.log(bytesToHex(utf8ToBytes('testKey')))
  console.log(bytesToHex(utf8ToBytes('testKey0')))
  console.log(bytesToHex(utf8ToBytes('testKeyA')))

  // Add a key-value pair to the trie for each of them
  await trie.put(utf8ToBytes('testKey'), utf8ToBytes('testValue'))
  await trie.put(utf8ToBytes('testKey0'), utf8ToBytes('testValue0'))
  await trie.put(utf8ToBytes('testKeyA'), utf8ToBytes('testValueA'))

  const node1 = await trie.findPath(utf8ToBytes('testKey')) // We retrieve the node at the "branching" off of the keys
  console.log('Node 1: ', node1.node) // A branch node! We can see that it contains 16 branches and a value.
  console.log('Node 1 value: ', bytesToUtf8(node1.node._value)) // The branch node's value

  await trie.put(utf8ToBytes('testKey0'), utf8ToBytes('testValue0'))
  await trie.put(utf8ToBytes('testKeyA'), utf8ToBytes('testValueA'))

  console.log('Node 1 branches: ', node1.node._branches) // All of its branches are empty, except at index 4 (corresponding to hex value 3).

  console.log('Node 1 branch 3 hex value: ', bytesToHex(node1.node._branches[3][1]))
  console.log('Node 1 branch 4 hex value: ', bytesToHex(node1.node._branches[4][1]))
  console.log(
    'Node 1 branch 3 (hex): path: ',
    bytesToHex(node1.node._branches[3][0]),
    ' | value: ',
    bytesToHex(node1.node._branches[3][1]),
  )
  console.log(
    'Node 1 branch 4 (hex): path: ',
    bytesToHex(node1.node._branches[4][0]),
    ' | value:',
    bytesToHex(node1.node._branches[4][1]),
  )

  console.log('Value of branch at index 3: ', bytesToUtf8(node1.node._branches[3][1]))
  console.log('Value of branch at index 4: ', bytesToUtf8(node1.node._branches[4][1]))

  const node2 = await trie.findPath(utf8ToBytes('testKe')) // We retrieve the node at "testKe"
  console.log('Node 2: ', node2.node)
}

void test()
