/* Example 1a - Creating and Updating a Base Trie*/

const { Trie } = require('../dist') // We import the library required to create a basic Merkle Patricia Tree

const trie = new Trie() // We create an empty Merkle Patricia Tree
console.log('Empty trie root (Bytes): ', trie.root) // The trie root (32 bytes)

async function test() {
  await trie.put('testKey', 'testValue') // We update (using "put") the trie with the key-value pair "testKey": "testValue"
  const value = await trie.get('testKey') // We retrieve (using "get") the value at key "testKey"
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
Updated trie root: <Buffer 8e 81 43 67 21 33 dd 5a b0 0d fc 4b 01 14 60 ea 2a 7b 00 d9 10 dc 42 78 94 2a e9 10 5c b6 20 74>
*/
