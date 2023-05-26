import { utf8ToBytes } from 'ethereum-cryptography/utils'

import { MerklePatriciaTrie } from './trie/merklePatricia'
import { TrieWithDB } from './trie/trieDB'
import { TrieWrap } from './trie/trieWrapper'

import type { DB, TrieDatabase } from './db'
import type { BranchNode, ExtensionNode, LeafNode } from './trie'
import type { TNode } from './trie/node/types'
import type { WalkController } from './util/walkController'
import type { Debugger } from 'debug'
import type LRUCache from 'lru-cache'

export type PathToNode = {
  path: TNode[]
  remainingNibbles: number[]
}
export type WalkFilterFunction = (TrieNode: TNode, key: number[]) => Promise<boolean>

export type FoundNodeFunction = (TrieNode: TNode, key: number[]) => Promise<void>

export type HashKeysFunction = (msg: Uint8Array) => Uint8Array

export interface TrieOpts {
  /**
   * A database instance.
   */
  db?: DB<string, string>

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

export interface MerklePatriciaTrieOptions {
  root?: TNode
  rootNodeRLP?: Uint8Array
  nodes?: Map<Uint8Array, TNode>
  secure?: boolean
  hashFunction?: (data: Uint8Array) => Uint8Array
  debug?: Debugger
}

export interface TrieDBOptions extends Exclude<MerklePatriciaTrieOptions, 'nodes'> {
  db?: TrieDatabase
  cache?: LRUCache<Uint8Array, TNode>
  checkpoints?: Uint8Array[]
  maxCheckpoints?: number
  persistent?: boolean
  useNodePruning?: boolean
  useKeyHashing?: boolean
  useRootPersistence?: boolean
}

export interface TrieWrapOptions extends TrieDBOptions {}

export const Tries = {
  MERKLE_PATRICIA_TRIE: MerklePatriciaTrie,
  TRIE_WITH_DB: TrieWithDB,
  TRIE_WRAP: TrieWrap,
}

export type TrieType = keyof typeof Tries

export type TrieOptions<T extends TrieType> = T extends 'MERKLE_PATRICIA_TRIE'
  ? MerklePatriciaTrieOptions
  : T extends 'TRIE_WITH_DB'
  ? TrieDBOptions
  : T extends 'TRIE_WRAP'
  ? TrieWrapOptions
  : never

export const ROOT_DB_KEY = utf8ToBytes('__root__')
