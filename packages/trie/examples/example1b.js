/* Example 1b - Manually Creating and Updating a Secure Trie*/

const { Trie } = require('../dist') // We import the library required to create a basic Merkle Patricia Tree
const { keccak256 } = require('ethereum-cryptography/keccak')

const trie = new Trie() // We create an empty Merkle Patricia Tree
console.log('Empty trie root (Bytes): ', trie.root) // The trie root (32 bytes)

async function test() {
  await trie.put(keccak256(Buffer.from('testKey')), Buffer.from('testValue')) // We update (using "put") the trie with the key-value pair "testKey": "testValue"
  const value = await trie.get(keccak256(Buffer.from('testKey'))) // We retrieve (using "get") the value at key "testKey"
  console.log('Value (Bytes): ', value)
  console.log('Value (String): ', value.toString())
  console.log('Updated trie root:', trie.root) // The new trie root (32 bytes)
}

test()

/*
Results:
Empty trie root (Bytes):  <Buffer 56 e8 1f 17 1b cc 55 a6 ff 83 45 e6 92 c0 f8 6e 5b 48 e0 1b 99 6c ad c0 01 62 2f b5 e3 63 b4 21>
Value (Bytes):  <Buffer 74 65 73 74 56 61 6c 75 65>
Value (String):  testValue
Updated trie root: <Buffer be ad e9 13 ab 37 dc a0 dc a2 e4 29 24 b9 18 c2 a1 ca c4 57 83 3b d8 2b 9e 32 45 de cb 87 d0 fb>
*/
