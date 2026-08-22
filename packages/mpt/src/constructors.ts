import {
  KeyEncoding,
  ValueEncoding,
  bytesToUnprefixedHex,
  concatBytes,
  unprefixedHexToBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { MerklePatriciaTrie, ROOT_DB_KEY, updateMPTFromMerkleProof } from './index.ts'

import type { MPTOpts, Proof } from './index.ts'

/**
 * Creates a Merkle Patricia Trie instance.
 *
 * Preferred entry point over constructing {@link MerklePatriciaTrie} directly.
 * When `useRootPersistence` is enabled and a database is provided, loads or stores
 * the trie root under the internal root key.
 *
 * @param opts Trie configuration (database, root, key hashing, value encoding, etc.)
 * @returns Initialized trie ready for reads and writes
 */
export async function createMPT(opts?: MPTOpts) {
  const keccakFunction =
    opts?.common?.customCrypto.keccak256 ?? opts?.useKeyHashingFunction ?? keccak_256
  let key = ROOT_DB_KEY

  const encoding =
    opts?.valueEncoding === ValueEncoding.Bytes ? ValueEncoding.Bytes : ValueEncoding.String

  if (opts?.useKeyHashing === true) {
    key = keccakFunction.call(undefined, ROOT_DB_KEY) as Uint8Array
  }
  if (opts?.keyPrefix !== undefined) {
    key = concatBytes(opts.keyPrefix, key)
  }

  if (opts?.db !== undefined && opts?.useRootPersistence === true) {
    if (opts?.root === undefined) {
      // Using deprecated bytesToUnprefixedHex for performance: used as database keys (string encoding).
      const root = await opts?.db.get(bytesToUnprefixedHex(key), {
        keyEncoding: KeyEncoding.String,
        valueEncoding: encoding,
      })
      if (typeof root === 'string') {
        opts.root = unprefixedHexToBytes(root)
      } else {
        opts.root = root
      }
    } else {
      // Using deprecated bytesToUnprefixedHex for performance: used as database keys/values (string encoding).
      await opts?.db.put(
        bytesToUnprefixedHex(key),
        encoding === ValueEncoding.Bytes ? opts.root : bytesToUnprefixedHex(opts.root),
        {
          keyEncoding: KeyEncoding.String,
          valueEncoding: encoding,
        },
      )
    }
  }

  return new MerklePatriciaTrie(opts)
}

/**
 * Reconstruct a sparse trie from an EIP-1186 proof.
 *
 * @param proof Serialized trie nodes from root to the proven leaf
 * @param trieOpts Options for the returned trie (root verification, key hashing, etc.)
 * @returns Trie populated with proof nodes, root set from the proof
 */
export async function createMPTFromProof(proof: Proof, trieOpts?: MPTOpts) {
  const shouldVerifyRoot = trieOpts?.root !== undefined
  const trie = new MerklePatriciaTrie(trieOpts)
  const root = await updateMPTFromMerkleProof(trie, proof, shouldVerifyRoot)
  trie.root(root)
  await trie.persistRoot()
  return trie
}
