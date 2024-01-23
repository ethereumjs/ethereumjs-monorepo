import { Trie } from '@ethereumjs/trie'
import { bytesToUtf8, utf8ToBytes } from '@ethereumjs/util'

const trie = new Trie()

async function main() {
  const t1 = utf8ToBytes('test1')
  const t2 = utf8ToBytes('test2')
  const v1 = utf8ToBytes('one')
  const v2 = utf8ToBytes('two')

  // proof-of-inclusion
  await trie.put(t1, v1)
  let proof = await trie.createProof(t1)
  let value = await trie.verifyProof(trie.root(), t1, proof)
  console.log(value ? bytesToUtf8(value) : 'not found') // 'one'

  // proof-of-exclusion
  await trie.put(utf8ToBytes('test'), utf8ToBytes('one'))
  await trie.put(utf8ToBytes('test2'), utf8ToBytes('two'))
  proof = await trie.createProof(utf8ToBytes('test3'))
  value = await trie.verifyProof(trie.root(), utf8ToBytes('test3'), proof)
  console.log(value ? bytesToUtf8(value) : 'null') // null

  // invalid proof
  await trie.put(utf8ToBytes('test'), utf8ToBytes('one'))
  await trie.put(utf8ToBytes('test2'), utf8ToBytes('two'))
  proof = await trie.createProof(utf8ToBytes('test2'))
  proof[1].reverse()
  try {
    const value = await trie.verifyProof(trie.root(), utf8ToBytes('test2'), proof) // results in error
  } catch (err) {
    console.log(err)
  }
}

main()
