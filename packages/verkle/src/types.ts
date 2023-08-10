import { utf8ToBytes } from '@ethereumjs/util'

import type { VerkleNode } from './node'
import type { DB } from '@ethereumjs/util'

// Curve point of a commitment
export type CommitmentPoint = Uint8Array

export type Proof = Uint8Array[]

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
   * LRU cache for trie nodes to allow for faster node retrieval.
   *
   * Default: 0 (deactivated)
   */
  cacheSize?: number
}

export type VerkleTrieOptsWithDefaults = VerkleTrieOpts & {
  useRootPersistence: boolean
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

export type FoundNodeFunction = (
  nodeRef: Uint8Array,
  node: VerkleNode | null,
  key: Uint8Array,
  walkController: any // todo
) => void

export const ROOT_DB_KEY = utf8ToBytes('__root__')
