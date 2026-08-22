import { utf8ToBytes } from '@ethereumjs/util'

import type { DB, ValueEncoding } from '@ethereumjs/util'
import type { BranchMPTNode, ExtensionMPTNode, LeafMPTNode } from './node/index.ts'
import type { WalkController } from './util/walkController.ts'

/** Decoded MPT node: branch, extension, or leaf. */
export type MPTNode = BranchMPTNode | ExtensionMPTNode | LeafMPTNode

/** Half-byte (0–15) path segment used inside trie nodes. */
export type Nibbles = number[]

/** Non-serialized extension node: `[encodedPath, childRef]`. */
export type RawExtensionMPTNode = [Uint8Array, Uint8Array]

/** Non-serialized leaf node: `[remainingPath, value]`. */
export type RawLeafMPTNode = [Uint8Array, Uint8Array]

/** Child reference: 32-byte hash or inlined raw node when RLP length is under 32 bytes. */
export type NodeReferenceOrRawMPTNode = Uint8Array | RawExtensionMPTNode | RawLeafMPTNode

/** Branch slot value or `null` when the slot is empty. */
export type BranchMPTNodeBranchValue = NodeReferenceOrRawMPTNode | null

/** EIP-1186 proof: serialized trie nodes from root to leaf. */
export type Proof = Uint8Array[]

/** Shared subset of {@link @ethereumjs/common!Common} used internally by `@ethereumjs/mpt`. */
export interface CommonInterface {
  customCrypto: {
    keccak256?: (msg: Uint8Array) => Uint8Array
  }
}

/** Result of {@link MerklePatriciaTrie.findPath}: target node, unmatched nibbles, and path stack. */
export interface Path {
  node: MPTNode | null
  remaining: Nibbles
  stack: MPTNode[]
}

/** Callback invoked for each node during a trie walk. */
export type FoundNodeFunction = (
  nodeRef: NodeReferenceOrRawMPTNode,
  node: MPTNode | null,
  key: Nibbles,
  walkController: WalkController,
) => void

/** Key-hashing function for secure tries (defaults to keccak256). */
export type HashKeysFunction = (msg: Uint8Array) => Uint8Array

/** Options for {@link createMPT} and {@link MerklePatriciaTrie}. */
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
   * **keccak_256** hash function or alternatively the custom hash function provided.
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

/** {@link MPTOpts} with required fields filled in by the trie constructor. */
export type MPTOptsWithDefaults = MPTOpts & {
  useKeyHashing: boolean
  useKeyHashingFunction: HashKeysFunction
  useRootPersistence: boolean
  useNodePruning: boolean
  cacheSize: number
}

/** Overrides applied when shallow-copying a trie. */
export interface TrieShallowCopyOpts {
  /** Optional key prefix for the copied trie's DB keys. */
  keyPrefix?: Uint8Array
  /** LRU cache size for the copy; defaults to `0` (disabled). */
  cacheSize?: number
}

/** Options for {@link CheckpointDB}. */
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

/** In-memory diff layer for a trie checkpoint (keys stored as unprefixed hex strings). */
export type Checkpoint = {
  // We cannot use a Uint8Array => Uint8Array map directly. If you create two Uint8Arrays with the same internal value,
  // then when setting a value on the Map, it actually creates two indices.
  keyValueMap: Map<string, Uint8Array | undefined>
  /** Trie root hash at the time this checkpoint was opened. */
  root: Uint8Array
}

/** Internal DB key used when `useRootPersistence` stores the trie root. */
export const ROOT_DB_KEY = utf8ToBytes('__root__')
