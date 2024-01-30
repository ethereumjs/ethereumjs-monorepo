import { Trie } from '@ethereumjs/trie'
import { bytesToUtf8 } from '@ethereumjs/util'
import { utf8ToBytes } from 'ethereum-cryptography/utils'

async function main() {
  const k1 = utf8ToBytes('keyOne')
  const k2 = utf8ToBytes('keyTwo')

  const someOtherTrie = new Trie({ useKeyHashing: true })
  await someOtherTrie.put(k1, utf8ToBytes('valueOne'))
  await someOtherTrie.put(k2, utf8ToBytes('valueTwo'))

  const proof = await someOtherTrie.createProof(k1)
  const trie = await Trie.createFromProof(proof, { useKeyHashing: true })
  const otherProof = await someOtherTrie.createProof(k2)

  // To add more proofs to the trie, use `updateFromProof`
  await trie.updateFromProof(otherProof)

  const value = await trie.get(k1)
  console.log(bytesToUtf8(value!)) // valueOne
  const otherValue = await trie.get(k2)
  console.log(bytesToUtf8(otherValue!)) // valueTwo
}

main()
