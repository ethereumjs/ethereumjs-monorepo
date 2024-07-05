import { type VerkleCrypto } from '@ethereumjs/util'

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

export enum VerkleLeafNodeValue {
  Untouched = 0,
  Deleted = 1,
}
interface VerkleLeafNodeOptions extends BaseVerkleNodeOptions {
  stem: Uint8Array
  values?: (Uint8Array | VerkleLeafNodeValue)[]
  c1?: Uint8Array
  c2?: Uint8Array
}

export interface VerkleNodeOptions {
  [VerkleNodeType.Internal]: VerkleInternalNodeOptions
  [VerkleNodeType.Leaf]: VerkleLeafNodeOptions
}

export const NODE_WIDTH = 256

export const createUntouchedLeafValue = () => new Uint8Array(32)

export const createDeletedLeafValue = () => {
  const bytes = new Uint8Array(32)
  // Set the 129th bit to 1 directly by setting the 17th byte (index 16) to 0x80
  bytes[16] = 0x80

  return bytes
}

export const createDefaultLeafValues = () => new Array(256).fill(0)
