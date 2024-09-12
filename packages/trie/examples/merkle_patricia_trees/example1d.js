/* Example 1d - Deleting a Key-Value Pair from a Trie*/

const { bytesToHex, bytesToUtf8, utf8ToBytes } = require('@ethereumjs/util')

const { Trie } = require('../../dist/cjs/index.js')

const trie = new Trie()
console.log('Empty trie root: ', bytesToHex(trie.root())) // The trie root

async function test() {
  const key = utf8ToBytes('testKey')
  const value = utf8ToBytes('testValue')
  await trie.put(key, value) // We update (using "put") the trie with the key-value pair "testKey": "testValue"
  const valuePre = await trie.get(key) // We retrieve (using "get") the value at key "testKey"
  console.log('Value (String): ', bytesToUtf8(valuePre)) // We retrieve our value
  console.log('Updated trie root:', bytesToHex(trie.root())) // The new trie root

  await trie.del(key)
  const valuePost = await trie.get(key) // We try to retrieve the value at (deleted) key "testKey"
  console.log('Value at key "testKey": ', valuePost) // Key not found. Value is therefore null.
  console.log('Trie root after deletion:', bytesToHex(trie.root())) // Our trie root is back to its initial value
}

void test()

/*
Results:
Empty trie root:  0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421
Value (String):  testValue
Updated trie root: 0x8e8143672133dd5ab00dfc4b011460ea2a7b00d910dc4278942ae9105cb62074
Value at key "testKey":  null
Trie root after deletion: 0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421
*/
