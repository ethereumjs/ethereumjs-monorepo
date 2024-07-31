import { Trie, createProof, verifyProof } from '@ethereumjs/trie'
import { bytesToUtf8, utf8ToBytes } from '@ethereumjs/util'

const trie = new Trie()

async function main() {
  const k1 = utf8ToBytes('key1')
  const k2 = utf8ToBytes('key2')
  const v1 = utf8ToBytes('one')
  const v2 = utf8ToBytes('two')

  // proof-of-inclusion
  await trie.put(k1, v1)
  let proof = await createProof(trie, k1)
  let value = await verifyProof(trie, trie.root(), k1, proof)
  console.log(value ? bytesToUtf8(value) : 'not found') // 'one'

  // proof-of-exclusion
  await trie.put(k1, v1)
  await trie.put(k2, v2)
  proof = await createProof(trie, utf8ToBytes('key3'))
  value = await verifyProof(trie, trie.root(), utf8ToBytes('key3'), proof)
  console.log(value ? bytesToUtf8(value) : 'null') // null

  // invalid proof
  await trie.put(k1, v1)
  await trie.put(k2, v2)
  proof = await createProof(trie, k2)
  proof[0].reverse()
  try {
    const _value = await verifyProof(trie, trie.root(), k2, proof) // results in error
  } catch (err) {
    console.log(err)
  }
}

void main()
