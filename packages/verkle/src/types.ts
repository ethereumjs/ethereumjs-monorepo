import { utf8ToBytes } from '@ethereumjs/util'

import type { DB, VerkleCrypto } from '@ethereumjs/util'

// Field representation of a commitment
export type Fr = object

export type Proof = Uint8Array[]

export interface VerkleTreeOpts {
  /**
   * An instantiated Verkle Cryptography interface
   */
  verkleCrypto: VerkleCrypto
  /**
   * A database instance.
   */
  db: DB<Uint8Array, Uint8Array>

  /**
   * A `Uint8Array` for the root of a previously stored tree
   */
  root?: Uint8Array

  /**
   * Store the root inside the database after every `write` operation
   */
  useRootPersistence: boolean

  /**
   * LRU cache for tree nodes to allow for faster node retrieval.
   *
   * Default: 0 (deactivated)
   */
  cacheSize: number
}

export interface CheckpointDBOpts {
  /**
   * A database instance.
   */
  db: DB<Uint8Array, Uint8Array>

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
