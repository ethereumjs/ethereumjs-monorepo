/* Example 1a - Creating and Updating a Base Trie*/

const { bytesToHex, bytesToUtf8, utf8ToBytes } = require('@ethereumjs/util')

const { Trie } = require('../../dist/cjs/index.js') // We import the library required to create a basic Merkle Patricia Tree

const trie = new Trie() // We create an empty Merkle Patricia Tree
console.log('Empty trie root (Bytes): ', bytesToHex(trie.root())) // The trie root (32 bytes)

async function test() {
  const key = utf8ToBytes('testKey')
  const value = utf8ToBytes('testValue')
  await trie.put(key, value) // We update (using "put") the trie with the key-value pair "testKey": "testValue"
  const retrievedValue = await trie.get(key) // We retrieve (using "get") the value at key "testKey"
  console.log('Value (Bytes): ', bytesToHex(retrievedValue))
  console.log('Value (String): ', bytesToUtf8(retrievedValue))
  console.log('Updated trie root:', bytesToHex(trie.root())) // The new trie root (32 bytes)
}

void test()

/*
Results:
Empty trie root (Bytes):  0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421
Value (Bytes):  0x7465737456616c7565
Value (String):  testValue
Updated trie root: 0x8e8143672133dd5ab00dfc4b011460ea2a7b00d910dc4278942ae9105cb62074
*/
