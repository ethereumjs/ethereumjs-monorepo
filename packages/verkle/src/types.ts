import { intToBytes, utf8ToBytes } from '@ethereumjs/util'

import type { VerkleNode } from './node/index.js'
import type { WalkController } from './util/walkController.js'
import type { DB } from '@ethereumjs/util'
import type { VerkleCrypto as VerkleFFI } from 'verkle-cryptography-wasm'

// Field representation of a commitment
export interface Fr {}

// Elliptic curve point representation of a commitment
export interface Point {
  // Bytes returns the compressed serialized version of the element.
  bytes(): Uint8Array
  // BytesUncompressed returns the uncompressed serialized version of the element.
  bytesUncompressed(): Uint8Array

  // SetBytes deserializes a compressed group element from buf.
  // This method does all the proper checks assuming the bytes come from an
  // untrusted source.
  setBytes(bytes: Uint8Array): void

  // SetBytesUncompressed deserializes an uncompressed group element from buf.
  setBytesUncompressed(bytes: Uint8Array, trusted: boolean): void

  // computes X/Y
  mapToBaseField(): Point

  // mapToScalarField maps a group element to the scalar field.
  mapToScalarField(field: Fr): void

  // Equal returns true if p and other represent the same point.
  equal(secondPoint: Point): boolean

  // SetIdentity sets p to the identity element.
  setIdentity(): Point

  // Double sets p to 2*p1.
  double(point1: Point): Point

  // Add sets p to p1+p2.
  add(point1: Point, point2: Point): Point

  // Sub sets p to p1-p2.
  sub(point1: Point, point2: Point): Point

  // IsOnCurve returns true if p is on the curve.
  isOnCurve(): boolean

  normalise(): void

  // Set sets p to p1.
  set(): Point

  // Neg sets p to -p1.
  neg(): Point

  // ScalarMul sets p to p1*s.
  scalarMul(point1: Point, scalarMont: Fr): Point
}

export type Proof = Uint8Array[]

export interface VerkleTreeOpts {
  /**
   * An instantiated Verkle Cryptography interface
   */
  verkleCrypto: any
  /**
   * A database instance.
   */
  db?: DB<Uint8Array, Uint8Array>

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

export type FoundNodeFunction = (
  nodeRef: Uint8Array,
  node: VerkleNode | null,
  key: Uint8Array,
  walkController: WalkController
) => void

export const ROOT_DB_KEY = utf8ToBytes('__root__')

export type VerkleCrypto = VerkleFFI

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
