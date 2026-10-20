import { binaryTreeFromProof, createBinaryTree, verifyBinaryProof } from '@ethereumjs/binarytree'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'
import { blake3 } from '@noble/hashes/blake3.js'

const main = async () => {
  const tree = await createBinaryTree()

  const key = hexToBytes(`0x${'00'.repeat(31)}01`)
  const hashedKey = blake3(key)
  const value = hexToBytes(`0x${'02'.repeat(32)}`)
  const stem = hashedKey.slice(0, 31)
  const index = hashedKey[31]

  await tree.put(stem, [index], [value])

  const proof = await tree.createBinaryProof(hashedKey)
  const verified = await verifyBinaryProof(tree.root(), hashedKey, proof)
  const sparse = await binaryTreeFromProof(proof)

  console.log(`Proof length: ${proof.length} nodes`)
  console.log(`Verified value: ${bytesToHex(verified!)}`)
  console.log(`Sparse tree root match: ${bytesToHex(sparse.root()) === bytesToHex(tree.root())}`)
}

void main()
