import { EthereumJSErrorWithoutCode, bytesToHex, concatBytes, equalsBytes } from '@ethereumjs/util'

import { type MPTOpts, MerklePatriciaTrie, type Proof, createMPTFromProof } from '../index.ts'

import type { PutBatch } from '@ethereumjs/util'

/**
 * Verify an EIP-1186 account or storage proof against an expected trie root.
 *
 * @param key Key whose value is being proven (hashed when `useKeyHashing` is set)
 * @param proof Serialized trie nodes from root to leaf
 * @param opts Trie options (root, key hashing) used when reconstructing the proof trie
 * @throws If the proof is invalid
 * @returns Proven value, or `null` for a valid non-existence proof
 */
export async function verifyMerkleProof(
  key: Uint8Array,
  proof: Proof,
  opts?: MPTOpts,
): Promise<Uint8Array | null> {
  try {
    const proofTrie = await createMPTFromProof(proof, opts)
    const value = await proofTrie.get(key, true)
    return value
  } catch {
    throw EthereumJSErrorWithoutCode('Invalid proof provided')
  }
}

/**
 * Build an EIP-1186 proof for `key` from a full trie.
 *
 * @param trie Source trie (must contain the key path)
 * @param key Key to prove
 * @returns Serialized nodes along the path from root to leaf
 */
export async function createMerkleProof(trie: MerklePatriciaTrie, key: Uint8Array): Promise<Proof> {
  trie['DEBUG'] && trie['debug'](`Creating Proof for Key: ${bytesToHex(key)}`, ['create_proof'])
  const { stack } = await trie.findPath(trie['appliedKey'](key))
  const p = stack.map((stackElem) => {
    return stackElem.serialize()
  })
  trie['DEBUG'] && trie['debug'](`Proof created with (${stack.length}) nodes`, ['create_proof'])
  return p
}

/**
 * Populate a trie from an EIP-1186 proof by batch-putting all proof nodes.
 *
 * @param trie Trie to update (typically empty or sparse)
 * @param proof Serialized nodes from root to leaf
 * @param shouldVerifyRoot When `true`, require the first proof node's hash to match `trie.root()`
 * @returns Root hash derived from the first proof node
 */
export async function updateMPTFromMerkleProof(
  trie: MerklePatriciaTrie,
  proof: Proof,
  shouldVerifyRoot: boolean = false,
) {
  trie['DEBUG'] && trie['debug'](`Saving (${proof.length}) proof nodes in DB`, ['from_proof'])
  const opStack = proof.map((nodeValue) => {
    let key = Uint8Array.from(trie['hash'](nodeValue))
    key = trie['_opts'].keyPrefix ? concatBytes(trie['_opts'].keyPrefix, key) : key
    return {
      type: 'put',
      key,
      value: nodeValue,
    } as PutBatch
  })

  if (shouldVerifyRoot) {
    if (opStack[0] !== undefined && opStack[0] !== null) {
      if (!equalsBytes(trie.root(), opStack[0].key)) {
        throw EthereumJSErrorWithoutCode('The provided proof does not have the expected trie root')
      }
    }
  }

  await trie['_db'].batch(opStack)
  if (opStack[0] !== undefined) {
    return opStack[0].key
  }
}

/**
 * Verify a proof by loading nodes into a scratch trie and reading the key.
 *
 * @param trie Reference trie (supplies key-hashing options)
 * @param rootHash Expected root hash of the proven trie
 * @param key Key whose value is being verified
 * @param proof EIP-1186 proof nodes
 * @throws If the proof is invalid
 * @returns Proven value, or `null` for a valid non-existence proof
 */
export async function verifyMPTWithMerkleProof(
  trie: MerklePatriciaTrie,
  rootHash: Uint8Array,
  key: Uint8Array,
  proof: Proof,
): Promise<Uint8Array | null> {
  trie['DEBUG'] &&
    trie['debug'](
      `Verifying Proof:\n|| Key: ${bytesToHex(key)}\n|| Root: ${bytesToHex(
        rootHash,
      )}\n|| Proof: (${proof.length}) nodes
  `,
      ['VERIFY_PROOF'],
    )
  const proofTrie = new MerklePatriciaTrie({
    root: rootHash,
    useKeyHashingFunction: trie['_opts'].useKeyHashingFunction,
    common: trie['_opts'].common,
  })
  try {
    await updateMPTFromMerkleProof(proofTrie, proof, true)
  } catch {
    throw EthereumJSErrorWithoutCode('Invalid proof nodes given')
  }
  try {
    trie['DEBUG'] &&
      trie['debug'](`Verifying proof by retrieving key: ${bytesToHex(key)} from proof trie`, [
        'VERIFY_PROOF',
      ])
    const value = await proofTrie.get(trie['appliedKey'](key), true)
    trie['DEBUG'] && trie['debug'](`PROOF VERIFIED`, ['VERIFY_PROOF'])
    return value
  } catch (err: any) {
    if (err.message === 'Missing node in DB') {
      throw EthereumJSErrorWithoutCode('Invalid proof provided')
    } else {
      throw err
    }
  }
}
