import { type PrefixedHexString } from '@ethereumjs/util'

import type { BinaryTree } from '@ethereumjs/binarytree'
import type { Common } from '@ethereumjs/common'
import type { MerklePatriciaTrie } from '@ethereumjs/mpt'
import type { VerkleTree } from '@ethereumjs/verkle'
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

export interface RPCStateManagerOpts extends BaseStateManagerOpts {
  provider: string
  blockTag: bigint | 'earliest'
}

/**
 * Options for constructing a {@link StateManager}.
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

/**
 * Options dictionary.
 */
export interface StatelessVerkleStateManagerOpts extends BaseStateManagerOpts {
  common: Common // Common required since it provides verkleCrypto through customCrypto
  caches?: Caches
}

export interface StatefulVerkleStateManagerOpts extends BaseStateManagerOpts {
  common: Common // Common required since it provides verkleCrypto through customCrypto
  trie?: VerkleTree
  caches?: Caches
}

export interface StatefulBinaryTreeStateManagerOpts extends BaseStateManagerOpts {
  hashFunction?: (data: Uint8Array) => Uint8Array
  tree?: BinaryTree
  caches?: Caches
}

export interface BinaryTreeState {
  [key: PrefixedHexString]: PrefixedHexString | null
}

export interface EncodedBinaryTreeState {
  [key: PrefixedHexString]: PrefixedHexString | null
}

export interface VerkleState {
  [key: PrefixedHexString]: PrefixedHexString | null
}

export interface EncodedVerkleProof {
  [key: PrefixedHexString]: PrefixedHexString
}

export type StorageProof = {
  key: PrefixedHexString
  proof: PrefixedHexString[]
  value: PrefixedHexString
}

export type Proof = {
  address: PrefixedHexString
  balance: PrefixedHexString
  codeHash: PrefixedHexString
  nonce: PrefixedHexString
  storageHash: PrefixedHexString
  accountProof: PrefixedHexString[]
  storageProof: StorageProof[]
}
