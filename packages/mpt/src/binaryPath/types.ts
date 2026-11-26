import type { HashKeysFunction } from '../types.ts'

export type BinaryPathKeccak = HashKeysFunction

export type BinaryPathBatchOp =
  | { type: 'put'; pathKey: Uint8Array; bytes: Uint8Array }
  | { type: 'del'; pathKey: Uint8Array }

export interface BinaryPathNodeStore {
  getNode(pathKey: Uint8Array): Promise<Uint8Array | null>
  putNode(pathKey: Uint8Array, bytes: Uint8Array): Promise<void>
  deleteNode(pathKey: Uint8Array): Promise<void>
  applyBatch(ops: BinaryPathBatchOp[]): Promise<void>
}

export interface ExternalLeafStore {
  get(keyHash32: Uint8Array): Promise<Uint8Array | null | undefined>
  put?(keyHash32: Uint8Array, valueRlp: Uint8Array): Promise<void>
  del?(keyHash32: Uint8Array): Promise<void>
}

export interface BinaryPathMPTOpts {
  store?: BinaryPathNodeStore
  keccak256?: BinaryPathKeccak
  /** Fixed root prefix nibbles (e.g. single nibble bucket index). */
  prefixNibbles?: readonly number[]
  maxAnchorSnapshots?: number
  leaves?: ExternalLeafStore
}
