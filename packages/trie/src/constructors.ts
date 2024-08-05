import {
  KeyEncoding,
  ValueEncoding,
  bytesToUnprefixedHex,
  unprefixedHexToBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { concatBytes } from 'ethereum-cryptography/utils'

import { ROOT_DB_KEY, Trie, updateFromProof } from './index.js'

import type { Proof, TrieOpts } from './index.js'

export async function createTrie(opts?: TrieOpts) {
  const keccakFunction =
    opts?.common?.customCrypto.keccak256 ?? opts?.useKeyHashingFunction ?? keccak256
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
      await opts?.db.put(
        bytesToUnprefixedHex(key),
        <any>(encoding === ValueEncoding.Bytes ? opts.root : bytesToUnprefixedHex(opts.root)),
        {
          keyEncoding: KeyEncoding.String,
          valueEncoding: encoding,
        },
      )
    }
  }

  return new Trie(opts)
}

/**
 * Create a trie from a given (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof. A proof contains the encoded trie nodes
 * from the root node to the leaf node storing state data.
 * @param proof an EIP-1186 proof to create trie from
 * @param shouldVerifyRoot If `true`, verifies that the root key of the proof matches the trie root. Throws if this is not the case.
 * @param trieOpts trie opts to be applied to returned trie
 * @returns new trie created from given proof
 */
export async function createTrieFromProof(proof: Proof, trieOpts?: TrieOpts) {
  const shouldVerifyRoot = trieOpts?.root !== undefined
  const trie = new Trie(trieOpts)
  const root = await updateFromProof(trie, proof, shouldVerifyRoot)
  trie.root(root)
  await trie.persistRoot()
  return trie
}
