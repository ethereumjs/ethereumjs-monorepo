import { utf8ToBytes } from '@ethereumjs/util'

// import type { BranchNode, ExtensionNode, LeafNode } from './node/index.js'
// import type { WalkController } from './util/walkController.js'
import type { DB } from '@ethereumjs/util'

export type VerkleTrieNode = any

export type Nibbles = number[]

// Branch and extension nodes might store
// hash to next node, or embed it if its len < 32
export type EmbeddedNode = Uint8Array | Uint8Array[]

export type Proof = Uint8Array[]

export type FoundNodeFunction = (
  nodeRef: Uint8Array,
  node: VerkleTrieNode | null,
  key: Nibbles,
  walkController: any
) => void

export interface VerkleTrieOpts {
  /**
   * A database instance.
   */
  db?: DB<string, string>

  /**
   * A `Uint8Array` for the root of a previously stored trie
   */
  root?: Uint8Array

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

export type VerkleTrieOptsWithDefaults = VerkleTrieOpts & {
  useRootPersistence: boolean
  useNodePruning: boolean
  cacheSize: number
}

export interface CheckpointDBOpts {
  /**
   * A database instance.
   */
  db: DB<string, string>

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
