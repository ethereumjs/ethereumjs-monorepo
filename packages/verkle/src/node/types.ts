import { type VerkleCrypto, bigIntToBytes, bytesToBigInt, setLengthLeft } from '@ethereumjs/util'

import type { InternalNode } from './internalNode.js'
import type { LeafNode } from './leafNode.js'

export enum VerkleNodeType {
  Internal,
  Leaf,
}

export interface ChildNode {
  commitment: Uint8Array // 64 byte commitment to child node
  path: Uint8Array // path/partial stem to child node (used as DB key)
}
export interface TypedVerkleNode {
  [VerkleNodeType.Internal]: InternalNode
  [VerkleNodeType.Leaf]: LeafNode
}

export type VerkleNode = TypedVerkleNode[VerkleNodeType]

export interface VerkleNodeInterface {
  hash(): Uint8Array
  serialize(): Uint8Array
}

interface BaseVerkleNodeOptions {
  commitment: Uint8Array
  verkleCrypto: VerkleCrypto
}

interface VerkleInternalNodeOptions extends BaseVerkleNodeOptions {
  // Children nodes of this internal node.
  children?: (ChildNode | null)[]
}
interface VerkleLeafNodeOptions extends BaseVerkleNodeOptions {
  stem: Uint8Array
  values?: (Uint8Array | 0 | 1)[]
  c1?: Uint8Array
  c2?: Uint8Array
}

export interface VerkleNodeOptions {
  [VerkleNodeType.Internal]: VerkleInternalNodeOptions
  [VerkleNodeType.Leaf]: VerkleLeafNodeOptions
}

export const NODE_WIDTH = 256

export const EMPTY_CHILD: ChildNode = {
  commitment: new Uint8Array(64),
  path: new Uint8Array(),
}

export const ZERO_LEAF_VALUE = new Uint8Array(32)

export const DELETED_LEAF_VALUE = setLengthLeft(
  bigIntToBytes(bytesToBigInt(new Uint8Array(32)) + BigInt(2 ** 128)),
  32
)

export const DEFAULT_LEAF_VALUES = new Array(256).fill(0)
