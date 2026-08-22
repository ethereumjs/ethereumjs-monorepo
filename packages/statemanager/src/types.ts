import type { PrefixedHexString } from '@ethereumjs/util'

import type { BinaryTree } from '@ethereumjs/binarytree'
import type { Common } from '@ethereumjs/common'
import type { MerklePatriciaTrie } from '@ethereumjs/mpt'
import type { Caches } from './index.ts'
/**
 * Basic state manager options (not to be used directly)
 */
interface BaseStateManagerOpts {
  /**
   * The common to use
   */
  common?: Common
}

/**
 * Options for constructing a {@link SimpleStateManager}.
 */
export interface SimpleStateManagerOpts extends BaseStateManagerOpts {
  // Keep this as an alias so that it might be able to extend in the future
}

/** Options for constructing a {@link RPCStateManager}. */
export interface RPCStateManagerOpts extends BaseStateManagerOpts {
  /** HTTP(S) JSON-RPC endpoint URL */
  provider: string
  /** Block number (hex) or `'earliest'` to pin state reads */
  blockTag: bigint | 'earliest'
}

/**
 * Options for constructing a {@link MerkleStateManager}.
 */
export interface MerkleStateManagerOpts extends BaseStateManagerOpts {
  /**
   * A {@link MerklePatriciaTrie} instance
   */
  trie?: MerklePatriciaTrie
  /**
   * Option to prefix codehashes in the database. This defaults to `true`.
   * If this is disabled, note that it is possible to corrupt the trie, by deploying code
   * which code is equal to the preimage of a trie-node.
   * E.g. by putting the code `0x80` into the empty trie, will lead to a corrupted trie.
   */
  prefixCodeHashes?: boolean

  /**
   * Option to prefix the keys for the storage tries with the first 7 bytes from the
   * associated account address. Activating this option gives a noticeable performance
   * boost for storage DB reads when operating on larger tries.
   *
   * Note: Activating/deactivating this option causes continued state reads to be
   * incompatible with existing databases.
   *
   * Default: false (for backwards compatibility reasons)
   */
  prefixStorageTrieKeys?: boolean

  /**
   * Options to enable and configure the use of a cache account, code and storage
   * This can be useful for speeding up reads, especially when the trie is large.
   * The cache is only used for reading from the trie and is not used for writing to the trie.
   *
   * Default: false
   */
  caches?: Caches
}

/** Options for a stateless Verkle-backed state manager (requires `common` with verkle crypto). */
export interface StatelessVerkleStateManagerOpts extends BaseStateManagerOpts {
  common: Common // Common required since it provides verkleCrypto through customCrypto
  caches?: Caches
}

/** Options for constructing a {@link StatefulBinaryTreeStateManager}. */
export interface StatefulBinaryTreeStateManagerOpts extends BaseStateManagerOpts {
  /** Node hash function (defaults to the tree's hash function). */
  hashFunction?: (data: Uint8Array) => Uint8Array
  /** Pre-existing {@link BinaryTree} instance. */
  tree?: BinaryTree
  /** Read-through caches for account, code, and storage. */
  caches?: Caches
}

/** Binary tree state keyed by hex address with hex slot values. */
export interface BinaryTreeState {
  [key: PrefixedHexString]: PrefixedHexString | null
}

/** Same as {@link BinaryTreeState} with encoded hex values. */
export interface EncodedBinaryTreeState {
  [key: PrefixedHexString]: PrefixedHexString | null
}

/** Single storage slot entry within an EIP-1186 proof. */
export type StorageProof = {
  key: PrefixedHexString
  proof: PrefixedHexString[]
  value: PrefixedHexString
}

/** EIP-1186 account proof returned by `eth_getProof` and related helpers. */
export type Proof = {
  address: PrefixedHexString
  balance: PrefixedHexString
  codeHash: PrefixedHexString
  nonce: PrefixedHexString
  storageHash: PrefixedHexString
  accountProof: PrefixedHexString[]
  storageProof: StorageProof[]
}
