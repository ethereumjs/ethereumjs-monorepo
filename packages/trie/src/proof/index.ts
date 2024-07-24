import { keccak256 } from 'ethereum-cryptography/keccak'

import { createTrieFromProof } from '../constructors.js'
import { verifyRangeProof } from '../index.js'
import { bytesToNibbles } from '../util/nibbles.js'

import type { Proof, TrieOpts } from '../index.js'

/**
 * Static version of verifyProof function with the same behavior. An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes
 * from the root node to the leaf node storing state data.
 * @param rootHash Root hash of the trie that this proof was created from and is being verified for
 * @param key Key that is being verified and that the proof is created for
 * @param proof An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.
 * @param opts optional, the opts may include a custom hashing function to use with the trie for proof verification
 * @throws If proof is found to be invalid.
 * @returns The value from the key, or null if valid proof of non-existence.
 */
export async function verifyTrieProof(
  key: Uint8Array,
  proof: Proof,
  opts?: TrieOpts
): Promise<Uint8Array | null> {
  try {
    const proofTrie = await createTrieFromProof(proof, opts)
    const value = await proofTrie.get(key, true)
    return value
  } catch (err: any) {
    throw new Error('Invalid proof provided')
  }
}

// /**
//  * A range proof is a proof that includes the encoded trie nodes from the root node to leaf node for one or more branches of a trie,
//  * allowing an entire range of leaf nodes to be validated. This is useful in applications such as snap sync where contiguous ranges
//  * of state trie data is received and validated for constructing world state, locally. Also see {@link verifyRangeProof}. A static
//  * version of this function also exists.
//  * @param rootHash - root hash of state trie this proof is being verified against.
//  * @param firstKey - first key of range being proven.
//  * @param lastKey - last key of range being proven.
//  * @param keys - key list of leaf data being proven.
//  * @param values - value list of leaf data being proven, one-to-one correspondence with keys.
//  * @param proof - proof node list, if all-elements-proof where no proof is needed, proof should be null, and both `firstKey` and `lastKey` must be null as well
//  * @param opts - optional, the opts may include a custom hashing function to use with the trie for proof verification
//  * @returns a flag to indicate whether there exists more trie node in the trie
//  */
export function verifyTrieRangeProof(
  rootHash: Uint8Array,
  firstKey: Uint8Array | null,
  lastKey: Uint8Array | null,
  keys: Uint8Array[],
  values: Uint8Array[],
  proof: Uint8Array[] | null,
  opts?: TrieOpts
): Promise<boolean> {
  return verifyRangeProof(
    rootHash,
    firstKey && bytesToNibbles(firstKey),
    lastKey && bytesToNibbles(lastKey),
    keys.map((k) => k).map(bytesToNibbles),
    values,
    proof,
    opts?.useKeyHashingFunction ?? keccak256
  )
}

export * from './range.js'
export * from './proofTrie.js'
