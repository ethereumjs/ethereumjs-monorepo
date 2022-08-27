import { utf8ToBytes } from 'ethereum-cryptography/utils'

import type { BranchNode, ExtensionNode, LeafNode } from './trie'
import type { WalkController } from './util/walkController'

export type TrieNode = BranchNode | ExtensionNode | LeafNode

export type Nibbles = number[]

// Branch and extension nodes might store
// hash to next node, or embed it if its len < 32
export type EmbeddedNode = Uint8Array | Uint8Array[]

export type Proof = Uint8Array[]

export type FoundNodeFunction = (
  nodeRef: Uint8Array,
  node: TrieNode | null,
  key: Nibbles,
  walkController: WalkController
) => void

export type HashKeysFunction = (msg: Uint8Array) => Uint8Array

export interface TrieOpts {
  /**
   * A database instance.
   */
  db?: DB

  /**
   * A `Uint8Array` for the root of a previously stored trie
   */
  root?: Uint8Array

  /**
   * Create as a secure Trie where the keys are automatically hashed using the
   * **keccak256** hash function or alternatively the custom hash function provided.
   * Default: `false`
   *
   * This is the flavor of the Trie which is used in production Ethereum networks
   * like Ethereum Mainnet.
   *
   * Note: This functionality has been refactored along the v5 release and was before
   * provided as a separate inherited class `SecureTrie`. Just replace with `Trie`
   * instantiation with `useKeyHashing` set to `true`.
   */
  useKeyHashing?: boolean

  /**
   * Hash function used for hashing trie node and securing key.
   */
  useKeyHashingFunction?: HashKeysFunction

  /**
   * Store the root inside the database after every `write` operation
   */
  useRootPersistence?: boolean

  /**
   * Flag to prune the trie. When set to `true`, each time a value is overridden,
   * unreachable nodes will be pruned (deleted) from the trie
   */
  useNodePruning?: boolean

  /**
   * LRU cache for trie nodes to allow for faster node retrieval.
   *
   * Default: 0 (deactivated)
   */
  cacheSize?: number
}

export type TrieOptsWithDefaults = TrieOpts & {
  useKeyHashing: boolean
  useKeyHashingFunction: HashKeysFunction
  useRootPersistence: boolean
  useNodePruning: boolean
  cacheSize: number
}

export interface CheckpointDBOpts {
  /**
   * A database instance.
   */
  db: DB

  /**
   * Cache size (default: 0)
   */
  cacheSize?: number
}

export type BatchDBOp = PutBatch | DelBatch

export interface PutBatch {
  type: 'put'
  key: Uint8Array
  value: Uint8Array
}

export interface DelBatch {
  type: 'del'
  key: Uint8Array
}

export interface DB {
  /**
   * Retrieves a raw value from leveldb.
   * @param key
   * @returns A Promise that resolves to `Uint8Array` if a value is found or `null` if no value is found.
   */
  get(key: Uint8Array): Promise<Uint8Array | null>

  /**
   * Writes a value directly to leveldb.
   * @param key The key as a `Uint8Array`
   * @param value The value to be stored
   */
  put(key: Uint8Array, val: Uint8Array): Promise<void>

  /**
   * Removes a raw value in the underlying leveldb.
   * @param keys
   */
  del(key: Uint8Array): Promise<void>

  /**
   * Performs a batch operation on db.
   * @param opStack A stack of levelup operations
   */
  batch(opStack: BatchDBOp[]): Promise<void>

  /**
   * Returns a copy of the DB instance, with a reference
   * to the **same** underlying leveldb instance.
   */
  copy(): DB
}

export type Checkpoint = {
  // We cannot use a Uint8Array => Uint8Array map directly. If you create two Uint8Arrays with the same internal value,
  // then when setting a value on the Map, it actually creates two indices.
  keyValueMap: Map<string, Uint8Array | null>
  root: Uint8Array
}

export const ROOT_DB_KEY = utf8ToBytes('__root__')

export type RangeProofItem = {
  key: Uint8Array
  value: Uint8Array
}
