import {
  MerklePatriciaTrie,
  createMPTFromProof,
  createMerkleProof,
  updateMPTFromMerkleProof,
} from '@ethereumjs/mpt'
import { bytesToUtf8, utf8ToBytes } from '@ethereumjs/util'

async function main() {
  const k1 = utf8ToBytes('keyOne')
  const k2 = utf8ToBytes('keyTwo')

  const someOtherTrie = new MerklePatriciaTrie({ useKeyHashing: true })
  await someOtherTrie.put(k1, utf8ToBytes('valueOne'))
  await someOtherTrie.put(k2, utf8ToBytes('valueTwo'))

  const proof = await createMerkleProof(someOtherTrie, k1)
  const trie = await createMPTFromProof(proof, { useKeyHashing: true })
  const otherProof = await createMerkleProof(someOtherTrie, k2)

  // To add more proofs to the trie, use `updateMPTFromMerkleProof`
  await updateMPTFromMerkleProof(trie, otherProof)

  const value = await trie.get(k1)
  console.log(bytesToUtf8(value!)) // valueOne
  const otherValue = await trie.get(k2)
  console.log(bytesToUtf8(otherValue!)) // valueTwo
}

void main()
