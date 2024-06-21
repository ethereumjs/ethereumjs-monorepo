import type { InternalNode } from './internalNode.js'
import type { LeafNode } from './leafNode.js'
import type { VerkleCrypto } from 'verkle-cryptography-wasm'

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
  children?: ChildNode[]
}
interface VerkleLeafNodeOptions extends BaseVerkleNodeOptions {
  stem: Uint8Array
  values: Uint8Array[]
  c1?: Uint8Array
  c2?: Uint8Array
}

export interface VerkleNodeOptions {
  [VerkleNodeType.Internal]: VerkleInternalNodeOptions
  [VerkleNodeType.Leaf]: VerkleLeafNodeOptions
}

export const NODE_WIDTH = 256
