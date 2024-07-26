/* Example 1b - Manually Creating and Updating a Secure Trie*/

const { bytesToHex, bytesToUtf8, utf8ToBytes } = require('@ethereumjs/util')
const { keccak256 } = require('ethereum-cryptography/keccak')

const { Trie } = require('../../dist/cjs/index.js')

const trie = new Trie()
console.log('Empty trie root (Bytes): ', bytesToHex(trie.root())) // The trie root (32 bytes)

async function test() {
  await trie.put(keccak256(utf8ToBytes('testKey')), utf8ToBytes('testValue')) // We update (using "put") the trie with the key-value pair hash("testKey"): "testValue"
  const value = await trie.get(keccak256(utf8ToBytes('testKey'))) // We retrieve (using "get") the value at hash("testKey")
  console.log('Value (Bytes): ', bytesToHex(value))
  console.log('Value (String): ', bytesToUtf8(value))
  console.log('Updated trie root:', bytesToHex(trie.root())) // The new trie root (32 bytes)
}

void test()

/*
Results:
Empty trie root (Bytes):  0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421
Value (Bytes):  0x7465737456616c7565
Value (String):  testValue
Updated trie root: 0xbeade913ab37dca0dca2e42924b918c2a1cac457833bd82b9e3245decb87d0fb
*/
