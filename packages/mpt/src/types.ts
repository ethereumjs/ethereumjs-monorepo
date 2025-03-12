import { utf8ToBytes } from '@ethereumjs/util'

import type { BranchMPTNode, ExtensionMPTNode, LeafMPTNode } from './node/index.ts'
import type { WalkController } from './util/walkController.ts'
import type { DB, ValueEncoding } from '@ethereumjs/util'

export type MPTNode = BranchMPTNode | ExtensionMPTNode | LeafMPTNode

export type Nibbles = number[]

// A raw node refers to the non-serialized, array form of the node
// A raw extension node is a 2-item node, where the first item is the encoded path to the next node, and the second item is the reference to the next node
// A raw leaf node is a 2-item node, where the first item is the remaining path to the leaf node, and the second item is the value
// To learn more: https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/#optimization
export type RawExtensionMPTNode = [Uint8Array, Uint8Array]
export type RawLeafMPTNode = [Uint8Array, Uint8Array]

// Branch and extension nodes might store
// hash to next node, or a raw node if its length < 32
export type NodeReferenceOrRawMPTNode = Uint8Array | RawExtensionMPTNode | RawLeafMPTNode

export type BranchMPTNodeBranchValue = NodeReferenceOrRawMPTNode | null

export type Proof = Uint8Array[]

export interface CommonInterface {
  customCrypto: {
    keccak256?: (msg: Uint8Array) => Uint8Array
  }
}

export interface Path {
  node: MPTNode | null
  remaining: Nibbles
  stack: MPTNode[]
}

export type FoundNodeFunction = (
  nodeRef: Uint8Array,
  node: MPTNode | null,
  key: Nibbles,
  walkController: WalkController,
) => void

export type HashKeysFunction = (msg: Uint8Array) => Uint8Array

export interface MPTOpts {
  /**
   * A database instance.
   */
  db?: DB<string, string | Uint8Array>

  /**
   * A `Uint8Array` for the root of a previously stored trie
   */
  root?: Uint8Array

  /**
   * Create as a secure MerklePatriciaTrie where the keys are automatically hashed using the
   * **keccak256** hash function or alternatively the custom hash function provided.
   * Default: `false`
   *
   * This is the flavor of the MerklePatriciaTrie which is used in production Ethereum networks
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
   * Add a prefix to the trie node keys
   *
   * (potential performance benefits if multiple tries are stored within the same DB,
   * e.g. all storage tries being stored in the outer account state DB)
   */
  keyPrefix?: Uint8Array

  /**
   * ValueEncoding of the database (the values which are `put`/`get` in the db are of this type). Defaults to `string`
   */
  valueEncoding?: ValueEncoding

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

  /**
   * @ethereumjs/common `Common` instance (an alternative to passing in a `customHashingFunction`)
   */
  common?: CommonInterface
}

export type MPTOptsWithDefaults = MPTOpts & {
  useKeyHashing: boolean
  useKeyHashingFunction: HashKeysFunction
  useRootPersistence: boolean
  useNodePruning: boolean
  cacheSize: number
}

export interface TrieShallowCopyOpts {
  keyPrefix?: Uint8Array
  cacheSize?: number
}

export interface CheckpointDBOpts {
  /**
   * A database instance.
   */
  db: DB<string, string | Uint8Array>

  /**
   * ValueEncoding of the database (the values which are `put`/`get` in the db are of this type). Defaults to `string`
   */
  valueEncoding?: ValueEncoding

  /**
   * Cache size (default: 0)
   */
  cacheSize?: number
}

export type Checkpoint = {
  // We cannot use a Uint8Array => Uint8Array map directly. If you create two Uint8Arrays with the same internal value,
  // then when setting a value on the Map, it actually creates two indices.
  keyValueMap: Map<string, Uint8Array | undefined>
  root: Uint8Array
}

export const ROOT_DB_KEY = utf8ToBytes('__root__')
