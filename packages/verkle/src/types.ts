import { intToBytes, utf8ToBytes } from '@ethereumjs/util'

import type { DB } from '@ethereumjs/util'

// Field representation of a commitment
export interface Fr {}

export type Proof = Uint8Array[]

export interface VerkleTreeOpts {
  /**
   * An instantiated Verkle Cryptography interface
   */
  verkleCrypto: any
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
  useRootPersistence?: boolean

  /**
   * LRU cache for tree nodes to allow for faster node retrieval.
   *
   * Default: 0 (deactivated)
   */
  cacheSize?: number
}

export type VerkleTreeOptsWithDefaults = VerkleTreeOpts & {
  useRootPersistence: boolean
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

export enum LeafType {
  Version = 0,
  Balance = 1,
  Nonce = 2,
  CodeHash = 3,
  CodeSize = 4,
}

export const VERSION_LEAF_KEY = intToBytes(LeafType.Version)
export const BALANCE_LEAF_KEY = intToBytes(LeafType.Balance)
export const NONCE_LEAF_KEY = intToBytes(LeafType.Nonce)
export const CODE_HASH_LEAF_KEY = intToBytes(LeafType.CodeHash)
export const CODE_SIZE_LEAF_KEY = intToBytes(LeafType.CodeSize)

export const HEADER_STORAGE_OFFSET = 64
export const CODE_OFFSET = 128
export const VERKLE_NODE_WIDTH = 256
export const MAIN_STORAGE_OFFSET = BigInt(256) ** BigInt(31)

export const zeroValues = new Array(256).fill(new Uint8Array())
export const zeroCValues = new Array(128).fill(new Uint8Array())
