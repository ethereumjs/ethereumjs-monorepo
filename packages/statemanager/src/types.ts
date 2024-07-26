import { type PrefixedHexString, utf8ToBytes } from '@ethereumjs/util'

import type { CacheType } from './cache/index.js'
import type { AccessWitness } from './index.js'
import type { Common } from '@ethereumjs/common'
import type { Trie } from '@ethereumjs/trie'
import type { VerkleCrypto } from '@ethereumjs/util'

type CacheOptions = {
  /**
   * Allows for cache deactivation
   *
   * Depending on the use case and underlying datastore (and eventual concurrent cache
   * mechanisms there), usage with or without cache can be faster
   *
   * Default: false
   */
  deactivate?: boolean

  /**
   * Cache type to use.
   *
   * Available options:
   *
   * ORDERED_MAP: Cache with no fixed upper bound and dynamic allocation,
   * use for dynamic setups like testing or similar.
   *
   * LRU: LRU cache with pre-allocation of memory and a fixed size.
   * Use for larger and more persistent caches.
   */
  type?: CacheType

  /**
   * Size of the cache (only for LRU cache)
   *
   * Default: 100000 (account cache) / 20000 (storage cache) / 20000 (code cache)
   *
   * Note: the cache/trie interplay mechanism is designed in a way that
   * the theoretical number of max modified accounts between two flush operations
   * should be smaller than the cache size, otherwise the cache will "forget" the
   * old modifications resulting in an incomplete set of trie-flushed accounts.
   */
  size?: number
}

export type CacheSettings = {
  deactivate: boolean
  type: CacheType
  size: number
}

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
 * Cache state manager options (not to be used directly)
 */
interface CacheStateManagerOpts {
  accountCacheOpts?: CacheOptions
  storageCacheOpts?: CacheOptions
  codeCacheOpts?: CacheOptions
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
export interface DefaultStateManagerOpts extends BaseStateManagerOpts, CacheStateManagerOpts {
  /**
   * A {@link Trie} instance
   */
  trie?: Trie
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
}

/**
 * Options dictionary.
 */
export interface StatelessVerkleStateManagerOpts
  extends BaseStateManagerOpts,
    CacheStateManagerOpts {
  accesses?: AccessWitness
  verkleCrypto: VerkleCrypto
  initialStateRoot?: Uint8Array
}

export interface VerkleState {
  [key: PrefixedHexString]: PrefixedHexString | null
}

export interface EncodedVerkleProof {
  [key: PrefixedHexString]: PrefixedHexString
}

/**
 * Prefix to distinguish between a contract deployed with code `0x80`
 * and `RLP([])` (also having the value `0x80`).
 *
 * Otherwise the creation of the code hash for the `0x80` contract
 * will be the same as the hash of the empty trie which leads to
 * misbehaviour in the underlying trie library.
 */
export const CODEHASH_PREFIX = utf8ToBytes('c')

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
