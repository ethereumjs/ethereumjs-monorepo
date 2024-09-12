// Example 3a - Generating a hash

const rlp = require('@ethereumjs/rlp')
const { bytesToHex, utf8ToBytes } = require('@ethereumjs/util')
const { keccak256 } = require('ethereum-cryptography/keccak')

const { Trie } = require('../../dist/cjs/index.js')

const trie = new Trie()

async function test() {
  // We populate the tree to create an extension node.
  await trie.put(utf8ToBytes('testKey'), utf8ToBytes('testValue'))
  await trie.put(utf8ToBytes('testKey0001'), utf8ToBytes('testValue1'))
  await trie.put(utf8ToBytes('testKey000A'), utf8ToBytes('testValueA'))

  const node1 = await trie.findPath(utf8ToBytes('testKey'))
  const node2 = await trie.lookupNode(node1.node._branches[3])
  const node3 = await trie.lookupNode(node2._value)

  console.log('Extension node:', node2)
  console.log('Branch node:', node3._branches)
  console.log('Branch node hash:', bytesToHex(node2._value))
  console.log(
    'Branch node branch 4:',
    'path: ',
    bytesToHex(node3._branches[4][0]),
    ' | value: ',
    bytesToHex(node3._branches[4][1]),
  )

  console.log('Raw node:', bytesToHex(rlp.encode(node2.raw())))
  console.log('Our computed hash:       ', bytesToHex(keccak256(rlp.encode(node2.raw()))))
  console.log('The extension node hash: ', bytesToHex(node1.node._branches[3]))
}

void test()
