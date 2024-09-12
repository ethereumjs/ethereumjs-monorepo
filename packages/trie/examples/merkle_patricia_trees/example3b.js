// Example 3b - Verification using a hash

const { bytesToHex, utf8ToBytes } = require('@ethereumjs/util')

const { Trie } = require('../../dist/cjs/index.js')

const trie1 = new Trie()
const trie2 = new Trie()

async function test() {
  await trie1.put(utf8ToBytes('testKey'), utf8ToBytes('testValue'))
  await trie1.put(utf8ToBytes('testKey0001'), utf8ToBytes('testValue1'))
  await trie1.put(utf8ToBytes('testKey000A'), utf8ToBytes('testValueA'))

  await trie2.put(utf8ToBytes('testKey'), utf8ToBytes('testValue'))
  await trie2.put(utf8ToBytes('testKey0001'), utf8ToBytes('testValue1'))
  await trie2.put(utf8ToBytes('testKey000z'), utf8ToBytes('testValuez'))

  const temp1 = await trie1.findPath(utf8ToBytes('testKey'))
  const temp2 = await trie2.findPath(utf8ToBytes('testKey'))

  const node1 = await trie1.lookupNode(temp1.node._branches[3])
  const node2 = await trie2.lookupNode(temp2.node._branches[3])

  console.log('Branch node 1 hash: ', bytesToHex(node1._value))
  console.log('Branch node 2 hash: ', bytesToHex(node2._value))

  console.log('Root of trie 1: ', bytesToHex(trie1.root()))
  console.log('Root of trie 2: ', bytesToHex(trie2.root()))
}

void test()
